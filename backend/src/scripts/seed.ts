import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["pl", "de", "fr", "es", "it", "gb", "se"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "pln",
          is_default: true,
        },
        {
          currency_code: "eur",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Polska",
          currency_code: "pln",
          countries: ["pl"],
          payment_providers: ["pp_system_default"],
        },
        {
          name: "Europa",
          currency_code: "eur",
          countries: countries.filter((c) => c !== "pl"),
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Magazyn Lunula Oil",
          address: {
            city: "Bydgoszcz",
            country_code: "PL",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Wysyłka Lunula Oil",
    type: "shipping",
    service_zones: [
      {
        name: "Polska i Europa",
        geo_zones: countries.map((country_code) => ({
          country_code,
          type: "country" as const,
        })),
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Kurier DPD",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Kurier",
          description: "Wysyłka w 2-3 dni robocze.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "pln",
            amount: 15,
          },
          {
            currency_code: "eur",
            amount: 5,
          },
          {
            region_id: region.id,
            amount: 15,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Paczkomat InPost",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Paczkomat",
          description: "Odbiór w paczkomacie InPost w 1-2 dni.",
          code: "express",
        },
        prices: [
          {
            currency_code: "pln",
            amount: 12,
          },
          {
            currency_code: "eur",
            amount: 4,
          },
          {
            region_id: region.id,
            amount: 12,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Olejki BIO – LUNULA Oil",
          is_active: true,
        },
        {
          name: "Olejki do twarzy",
          is_active: true,
        },
        {
          name: "Warsztaty",
          is_active: true,
        },
        {
          name: "Skrypty i materiały",
          is_active: true,
        },
      ],
    },
  });

  const catOils = categoryResult.find((c) => c.name === "Olejki BIO – LUNULA Oil")!.id;
  const catFace = categoryResult.find((c) => c.name === "Olejki do twarzy")!.id;
  const catWorkshops = categoryResult.find((c) => c.name === "Warsztaty")!.id;
  const catScripts = categoryResult.find((c) => c.name === "Skrypty i materiały")!.id;

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // ── Olejki BIO 250ml ──────────────────────────────────────
        {
          title: "Olej Jojoba z drobinkami złota PEŁNIA KSIĘŻYCA 250ml",
          category_ids: [catOils],
          description:
            "Luksusowy olejek do ciała i twarzy łączący tłoczony na zimno, nierafinowany olej jojoba z mieniącymi się drobinkami mineralnego złota. Orientalny zapach perfum utrzymuje się przez cały dzień. Zawiera fitosterole, witaminy A, E i F. Natłuszcza, zmiękcza, ujędrnia skórę, wspiera redukcję cellulitu, regeneruje i działa przeciwzapalnie. Bez alkoholu, parabenów, silikonów, SLS. GMO Free, Organic, Not Tested On Animals.",
          handle: "pelnia-ksiezyca-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2022/08/Jojoba-Gold-Pelnia-Ksiezyca-Duza-Butelka.jpg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-PELNIA-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 21000, currency_code: "pln" },
                { amount: 4900, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Olej z makadamii z nutą wanilii WSCHÓD SŁOŃCA 250ml",
          category_ids: [catOils],
          description:
            "Wysokiej jakości olej z dojrzałych orzechów makadamii o wyjątkowym zapachu wanilii. Zawiera kwas palmitooleinowy, skwalen, witaminy A i E, kwas oleinowy. Tworzy na skórze film ochronny wzmacniający barierę. Ujędrnia, poprawia elastyczność, regeneruje, działa przeciwzmarszczkowo. Szczególnie polecany dla skóry suchej, wrażliwej, dojrzałej i podrażnionej. Silne właściwości antycellulitowe. Bez parabenów, silikonów, SLS.",
          handle: "wschod-slonca-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2022/08/wschodduzy.jpg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-WSCHOD-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 13900, currency_code: "pln" },
                { amount: 3200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Olej z makadamii z nutą Whisky i Tytoniu – RAGNAR 250ml",
          category_ids: [catOils],
          description:
            "Olej makadamia o wyrazistym zapachu whisky i tytoniu. Z dojrzałych orzechów makadamii zbieranych naturalnie w Australii i Indonezji. Bogaty w nienasycone kwasy tłuszczowe, witaminę A, witaminy z grupy B, fenole, lecytyny i minerały. Wzmacnia barierę skóry, ujędrnia, wygładza. Przenika do głębszych warstw skóry aktywując procesy regeneracyjne. Polecany szczególnie dla mężczyzn. Pomaga na blizny i rozstępy. GMO Free, Organic, Not Tested On Animals.",
          handle: "ragnar-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2022/11/ragnarduza.jpg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-RAGNAR-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 13900, currency_code: "pln" },
                { amount: 3200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Olej z pestek winogron – KSIĘŻYC W NOWIU 250ml",
          category_ids: [catOils],
          description:
            "Olej stworzony, by obudzić ciało i zwiększyć wewnętrzną energię. Zawiera ok. 70% kwasu linolowego, 16% kwasu oleinowego, witaminę E. Wygładza skórę zatrzymując wilgoć, działa antyoksydacyjnie, ujędrnia, zwalcza bakterie i stany zapalne. Niekomedogenny - nie zatyka porów. Dla wszystkich typów skóry, w tym suchej, wrażliwej, mieszanej, tłustej i trądzikowej. Bez alkoholu, parabenów, silikonów, SLS.",
          handle: "ksiezyc-w-nowiu-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2022/08/Ksiezyc-w-Nowiu-Duza-Butelka-2.jpg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-NOWIU-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 13900, currency_code: "pln" },
                { amount: 3200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Olej ze słodkich migdałów z nutą kwiatów leśnych PORANNA ROSA 250ml",
          category_ids: [catOils],
          description:
            "Olej przenoszący w podróż po leśnej łące pokrytej kwiatami. Nuty głowy: mirt i bergamotka, serca: fiołek, lawenda i paczula. Lekki, nietłusty olej ze słodkich migdałów zawierający skwalen, tokoferol, fitosterole, kwas oleinowy, linolowy oraz witaminy A, B1, B2, B6, D, E. Łagodzi, aktywuje procesy odbudowy naskórka, zatrzymuje wilgoć. INCI: Prunus Amygdalus Dulcis Oil, Parfum. Bez parabenów, silikonów, SLS.",
          handle: "poranna-rosa-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2022/08/Poranna-Rosa-Duza-Butelka.jpg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-ROSA-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 13900, currency_code: "pln" },
                { amount: 3200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Olej ze słodkich migdałów z nutą magnolii MAGNOLIA 250ml",
          category_ids: [catOils],
          description:
            "Premiumowy olej ze słodkich migdałów z nutą magnolii. Zawiera ok. 90% nienasyconych kwasów tłuszczowych, skwalen, tokoferol, fitosterole, kwas oleinowy i linolowy, witaminy A, B1, B2, B6, D, E. Łagodzi podrażnienia, uruchamia procesy odbudowy naskórka, nawilża nawet bardzo suchą skórę, redukuje zmarszczki, regeneruje i przywraca jędrność. Polecany do demakijażu, pielęgnacji ciała i włosów, masażu. Bez parabenów, silikonów, SLS.",
          handle: "magnolia-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2022/08/Magnolia-Duza-butelka-v3-1.jpg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-MAGNOLIA-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 13900, currency_code: "pln" },
                { amount: 3200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Olej awokado z nutą zielonej herbaty Green Witch Divine 250ml",
          category_ids: [catOils],
          description:
            "Rytualny olej do masażu i pielęgnacji ciała i twarzy. Zrodzony z zielonego serca natury - pachnie jak dzika łąka po deszczu, jak świeżo zerwane liście zielonej herbaty. Zawiera witaminę E, kwasy Omega 9 i 6, lecytynę, skwalan, fitosterole. Do masażu twarzy rozcieńczyć 1:1 z olejem jojoba. Dla skóry suchej, wrażliwej, dojrzałej i normalnej. W ciemnym szkle chroniącym właściwości roślinne.",
          handle: "green-witch-divine-250ml",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/11/received_808684485404943.jpeg" },
          ],
          options: [{ title: "Pojemność", values: ["250ml"] }],
          variants: [
            {
              title: "250ml",
              sku: "LUNULA-GREENWITCH-250",
              options: { "Pojemność": "250ml" },
              prices: [
                { amount: 14900, currency_code: "pln" },
                { amount: 3500, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Olejki do twarzy 30ml ────────────────────────────────
        {
          title: "Olej jojoba nierafinowany LipidCode 30ml",
          category_ids: [catFace],
          description:
            "Certyfikowany 100% nierafinowany olej jojoba - płynny wosk estrowy, którego struktura odzwierciedla ludzkie sebum. Niekomedogenny, przeciwzapalny, ochronny i regeneracyjny. Wzmacnia barierę, łagodzi, regeneruje i chroni. Czystość to luksus. Prostota to siła. Inteligentny olej do codziennej pielęgnacji twarzy.",
          handle: "lipidcode-30ml",
          weight: 80,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/11/lipidcode.png" },
          ],
          options: [{ title: "Pojemność", values: ["30ml"] }],
          variants: [
            {
              title: "30ml",
              sku: "LUNULA-LIPIDCODE-30",
              options: { "Pojemność": "30ml" },
              prices: [
                { amount: 6900, currency_code: "pln" },
                { amount: 1600, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Warsztaty ─────────────────────────────────────────────
        {
          title: "Slow Care – naturalna pielęgnacja - warsztaty stacjonarne",
          category_ids: [catWorkshops],
          description:
            "Warsztaty stacjonarne łączące teorię, praktykę i doświadczenie. Ok. 3h (1,5h teoria + 1,5h praktyka), grupy 6-8 osób. Tematyka: dlaczego samo nawilżanie nie wystarczy, jak działają humektanty i emolienty, błędy demakijażu, odżywianie mikrobiomu skóry, korzyści przejścia z kremów na olejki, komedogenność, pokaz destylacji hydrolatu na żywo. Prowadząca: Agata Przygodzka, terapeutka skóry i ekspertka naturalnej pielęgnacji.",
          handle: "slow-care-warsztaty",
          weight: 0,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/10/DSCF5874.jpg" },
          ],
          options: [{ title: "Wariant", values: ["Stacjonarny"] }],
          variants: [
            {
              title: "Stacjonarny",
              sku: "LUNULA-SLOWCARE-BASIC",
              options: { "Wariant": "Stacjonarny" },
              prices: [
                { amount: 18000, currency_code: "pln" },
                { amount: 4200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Slow Care + Slow MakeUp – Sekret aksamitnej skóry i naturalnego Glow",
          category_ids: [catWorkshops],
          description:
            "Limitowane warsztaty premium. Część Slow Care: metodologia Code - HyaCode (serum hialuronowe), LipidCode (nierafinowany olej jojoba), SqualaneCode (biomimetyczny lipid). Część Slow MakeUp: Capsule Signature Makeup - minimalistyczne podejście z wielofunkcyjnymi produktami włoskiej produkcji. Nacisk na sekwencję, ilość, dotyk i czas. Prowadząca: Agata Przygodzka.",
          handle: "slow-care-slow-makeup",
          weight: 0,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/10/DSCF7596-2.png" },
          ],
          options: [{ title: "Wariant", values: ["Premium"] }],
          variants: [
            {
              title: "Premium",
              sku: "LUNULA-SLOWCARE-MAKEUP",
              options: { "Wariant": "Premium" },
              prices: [
                { amount: 19900, currency_code: "pln" },
                { amount: 4600, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Slow Care PRO – Indywidualne",
          category_ids: [catWorkshops],
          description:
            "Profesjonalne szkolenie indywidualne, ok. 4-5h (2h teoria + 2h praktyka). Tematyka: komedogenność, emolienty i humektanty, różnice między kremami a olejkami, odżywianie mikrobiomu skóry, wpływ kortyzolu na skórę, terapia dźwiękiem w masażu, stymulacja nerwu błędnego, aktywacja parasympatyczna podczas masażu twarzy, destylacja hydrolatu na żywo. Sesje indywidualne lub max 3 osoby z jednego salonu. W cenie: serum hialuronowe HyaCode. Faktura VAT dostępna.",
          handle: "slow-care-pro",
          weight: 0,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/11/FB_IMG_1762794101812-1.jpg" },
          ],
          options: [{ title: "Wariant", values: ["Indywidualny"] }],
          variants: [
            {
              title: "Indywidualny",
              sku: "LUNULA-SLOWCARE-PRO",
              options: { "Wariant": "Indywidualny" },
              prices: [
                { amount: 49000, currency_code: "pln" },
                { amount: 11500, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Slow Coffee Cream - warsztaty tworzenia kremu",
          category_ids: [catWorkshops],
          description:
            "Warsztaty tworzenia kremu w rytmie SLOW. Uczestnicy tworzą Slow Coffee Cream - energizującą, regenerującą formułę łączącą esencję kawy, olej z rokitnika, skwalan i olej z pestek winogron. Dodatkowo powstaje naturalne serum pod oczy z olejem z zielonej kawy, olejem Tsubaki, olejem z opuncji figowej i roślinnym skwalanem. Pełna receptura, krok po kroku od surowców do gotowego produktu.",
          handle: "slow-coffee-cream",
          weight: 0,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/10/DSCF7651.png" },
          ],
          options: [{ title: "Wariant", values: ["Stacjonarny"] }],
          variants: [
            {
              title: "Stacjonarny",
              sku: "LUNULA-COFFEE-CREAM",
              options: { "Wariant": "Stacjonarny" },
              prices: [
                { amount: 19000, currency_code: "pln" },
                { amount: 4400, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Skrypty ───────────────────────────────────────────────
        {
          title: "Slow Care + Slow Care PRO – skrypty z warsztatów (teoria)",
          category_ids: [catScripts],
          description:
            "Kompletny pakiet skryptów z dwóch warsztatów: Slow Care (59 stron teorii) + Slow Care PRO (32 strony teorii) + bonus 6 stron o zarządzaniu kortyzolem przez masaż i pielęgnację. Tematyka: komedogenność, emolienty i humektanty, różnice krem vs olej, mikrobiom skóry, dobór olejków do masażu, wpływ kortyzolu na skórę, częstotliwości terapii dźwiękiem, stymulacja nerwu błędnego, muzykoterapia. Autorka: Agata Przygodzka. Format: Canva link lub PDF.",
          handle: "slow-care-skrypty",
          weight: 0,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://lunulaoil.pl/wp-content/uploads/2025/10/DSCF5846.jpg" },
          ],
          options: [{ title: "Format", values: ["PDF / Canva"] }],
          variants: [
            {
              title: "PDF / Canva",
              sku: "LUNULA-SKRYPTY-SLOWCARE",
              options: { "Format": "PDF / Canva" },
              prices: [
                { amount: 13900, currency_code: "pln" },
                { amount: 3200, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
