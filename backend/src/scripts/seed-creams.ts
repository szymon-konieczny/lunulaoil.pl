import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedLunulaCreams({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

  // Get existing infrastructure
  const defaultSalesChannel =
    await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });

  if (!defaultSalesChannel.length) {
    logger.error(
      "No Default Sales Channel found. Run 'npm run seed' first to set up infrastructure."
    );
    return;
  }

  const shippingProfiles =
    await fulfillmentModuleService.listShippingProfiles({
      type: "default",
    });
  const shippingProfile = shippingProfiles[0];

  if (!shippingProfile) {
    logger.error("No shipping profile found. Run 'npm run seed' first.");
    return;
  }

  // Get existing stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  });
  const stockLocation = stockLocations[0];

  if (!stockLocation) {
    logger.error("No stock location found. Run 'npm run seed' first.");
    return;
  }

  logger.info("Creating Kremy category...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Kremy", is_active: true },
      ],
    },
  });

  const catCreams = categoryResult[0].id;

  logger.info("Seeding Lunula Botanique cream products...");

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // ── Golden Glow — Solar Touch Cream ──────────────────────
        {
          title: "Golden Glow — Solar Touch Cream 50ml",
          category_ids: [catCreams],
          description:
            "Krem o złocistej konsystencji inspirowany ciepłem słońca. Formuła oparta na skwalanie, oleju z pestek malin, oleju z rokitnika, fermentach botanicznych i ekstraktach owocowych. Rozświetla, regeneruje i odżywia zmęczoną, pozbawioną blasku skórę. Idealny dla skóry suchej i zmęczonej — przywraca naturalny blask i witalność. Lekka, jedwabista konsystencja szybko się wchłania, pozostawiając subtelny efekt glow. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
          handle: "golden-glow-solar-touch-cream",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [],
          tags: [
            { value: "krem" },
            { value: "skóra sucha" },
            { value: "zmęczona" },
            { value: "rozświetlenie" },
            { value: "regeneracja" },
            { value: "skwalan" },
            { value: "rokitnik" },
            { value: "twarz" },
          ],
          options: [{ title: "Pojemność", values: ["50ml"] }],
          variants: [
            {
              title: "50ml",
              sku: "LUNULA-GOLDENGLOW-50",
              options: { Pojemność: "50ml" },
              prices: [
                { amount: 14900, currency_code: "pln" },
                { amount: 3500, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Rose Alchemy — Phyto Renew Cream ────────────────────
        {
          title: "Rose Alchemy — Phyto Renew Cream 50ml",
          category_ids: [catCreams],
          description:
            "Krem regenerujący inspirowany alchemią róży. Zawiera bakuchiol (naturalną alternatywę retinolu), koenzym Q10, olej z dzikiej róży oraz kompleks ekstraktów kwiatowych. Intensywnie regeneruje, wygładza drobne zmarszczki i poprawia elastyczność skóry. Stworzony z myślą o skórze dojrzałej i wymagającej odnowy — wspiera naturalny proces regeneracji komórkowej. Bogata, aksamitna formuła otula skórę, dostarczając głębokie odżywienie. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
          handle: "rose-alchemy-phyto-renew-cream",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [],
          tags: [
            { value: "krem" },
            { value: "skóra dojrzała" },
            { value: "przeciwzmarszczkowy" },
            { value: "regeneracja" },
            { value: "bakuchiol" },
            { value: "róża" },
            { value: "koenzym Q10" },
            { value: "twarz" },
          ],
          options: [{ title: "Pojemność", values: ["50ml"] }],
          variants: [
            {
              title: "50ml",
              sku: "LUNULA-ROSEALCHEMY-50",
              options: { Pojemność: "50ml" },
              prices: [
                { amount: 15900, currency_code: "pln" },
                { amount: 3700, currency_code: "eur" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        // ── Clear Ritual — Pure Touch Cream ─────────────────────
        {
          title: "Clear Ritual — Pure Touch Cream 50ml",
          category_ids: [catCreams],
          description:
            "Krem oczyszczająco-łagodzący oparty na ziołowym naparze z kory białej wierzby, przywrotnika i łopianu. Wzbogacony olejem konopnym, olejem z pestek winogron i alantoiną. Reguluje wydzielanie sebum, łagodzi stany zapalne i wspomaga naturalny proces oczyszczania skóry. Stworzony dla skóry mieszanej, problematycznej i trądzikowej — przywraca równowagę bez wysuszania. Lekka, matująca formuła nie zatyka porów i nie obciąża skóry. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
          handle: "clear-ritual-pure-touch-cream",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [],
          tags: [
            { value: "krem" },
            { value: "skóra mieszana" },
            { value: "trądzikowa" },
            { value: "problematyczna" },
            { value: "oczyszczanie" },
            { value: "matowanie" },
            { value: "olej konopny" },
            { value: "twarz" },
          ],
          options: [{ title: "Pojemność", values: ["50ml"] }],
          variants: [
            {
              title: "50ml",
              sku: "LUNULA-CLEARRITUAL-50",
              options: { Pojemność: "50ml" },
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

  logger.info("Finished seeding cream products.");

  // Set inventory levels for new products
  logger.info("Setting inventory levels for creams...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
  });
  const existingItemIds = new Set(
    existingLevels.map((l: any) => l.inventory_item_id)
  );

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    if (!existingItemIds.has(inventoryItem.id)) {
      inventoryLevels.push({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: inventoryItem.id,
      });
    }
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    });
  }

  logger.info("Done! 3 cream products added: Golden Glow, Rose Alchemy, Clear Ritual.");
}
