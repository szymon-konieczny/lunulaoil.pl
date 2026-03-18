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

  const productModuleService = container.resolve(Modules.PRODUCT);

  logger.info("Getting or creating Kremy category...");

  // Check if category already exists
  const existingCategories = await productModuleService.listProductCategories({
    name: "Kremy",
  });

  let catCreams: string;
  if (existingCategories.length) {
    catCreams = existingCategories[0].id;
    logger.info(`Using existing Kremy category: ${catCreams}`);
  } else {
    const { result: categoryResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: [{ name: "Kremy", is_active: true }],
      },
    });
    catCreams = categoryResult[0].id;
    logger.info(`Created Kremy category: ${catCreams}`);
  }

  logger.info("Seeding Lunula Botanique cream products...");

  // Product definitions (without tags — added separately after creation)
  const productDefs = [
    {
      title: "Geranium Glow — Moon Touch Cream 50ml",
      subtitle: "Moon Ritual — Balance",
      category_ids: [catCreams],
      description:
        "Krem przywracający równowagę, inspirowany cyklem księżyca. Formuła oparta na olejku geraniowym, oleju z pestek winogron i skwalanie roślinnym. Koi podrażnienia, wygładza skórę i przywraca jej naturalną harmonię. Idealny dla skóry wrażliwej, reaktywnej i potrzebującej ukojenia — równoważy, łagodzi i wygładza. Delikatna, lekka konsystencja otula skórę bez obciążania. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
      handle: "geranium-glow-moon-touch-cream",
      weight: 120,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemność", values: ["50ml"] }],
      variants: [
        {
          title: "50ml",
          sku: "LUNULA-GERANIUMGLOW-50",
          options: { Pojemność: "50ml" },
          prices: [
            { amount: 12900, currency_code: "pln" },
            { amount: 3000, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
      _tagValues: ["krem", "skóra wrażliwa", "ukojenie", "równowaga", "wygładzenie", "geranium", "skwalan", "twarz"],
    },
    {
      title: "Golden Glow — Solar Touch Cream 50ml",
      subtitle: "Solar Ritual — Radiance",
      category_ids: [catCreams],
      description:
        "Krem o złocistej konsystencji inspirowany ciepłem słońca. Formuła oparta na skwalanie, oleju z pestek malin, oleju z rokitnika, fermentach botanicznych i ekstraktach owocowych. Rozświetla, regeneruje i odżywia zmęczoną, pozbawioną blasku skórę. Idealny dla skóry suchej i zmęczonej — przywraca naturalny blask i witalność. Lekka, jedwabista konsystencja szybko się wchłania, pozostawiając subtelny efekt glow. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
      handle: "golden-glow-solar-touch-cream",
      weight: 120,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemność", values: ["50ml"] }],
      variants: [
        {
          title: "50ml",
          sku: "LUNULA-GOLDENGLOW-50",
          options: { Pojemność: "50ml" },
          prices: [
            { amount: 13900, currency_code: "pln" },
            { amount: 3200, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
      _tagValues: ["krem", "skóra sucha", "zmęczona", "rozświetlenie", "odżywienie", "miękkość", "blask", "skwalan", "rokitnik", "twarz"],
    },
    {
      title: "Rose Alchemy — Phyto Renew Cream 50ml",
      subtitle: "Alchemy Ritual — Renewal",
      category_ids: [catCreams],
      description:
        "Krem regenerujący inspirowany alchemią róży. Zawiera bakuchiol (naturalną alternatywę retinolu), koenzym Q10, olej z dzikiej róży oraz kompleks ekstraktów kwiatowych. Intensywnie regeneruje, wygładza drobne zmarszczki i poprawia elastyczność skóry. Stworzony z myślą o skórze dojrzałej i wymagającej odnowy — wspiera naturalny proces regeneracji komórkowej. Bogata, aksamitna formuła otula skórę, dostarczając głębokie odżywienie. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
      handle: "rose-alchemy-phyto-renew-cream",
      weight: 120,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemność", values: ["50ml"] }],
      variants: [
        {
          title: "50ml",
          sku: "LUNULA-ROSEALCHEMY-50",
          options: { Pojemność: "50ml" },
          prices: [
            { amount: 14900, currency_code: "pln" },
            { amount: 3500, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
      _tagValues: ["krem", "skóra dojrzała", "przeciwzmarszczkowy", "ujędrnienie", "wygładzenie", "odnowa", "bakuchiol", "róża", "koenzym Q10", "twarz"],
    },
    {
      title: "Clear Ritual — Pure Touch Cream 50ml",
      subtitle: "Pure Ritual — Purity",
      category_ids: [catCreams],
      description:
        "Krem oczyszczająco-łagodzący oparty na ziołowym naparze z kory białej wierzby, przywrotnika i łopianu. Wzbogacony olejem konopnym, olejem z pestek winogron i alantoiną. Reguluje wydzielanie sebum, łagodzi stany zapalne i wspomaga naturalny proces oczyszczania skóry. Stworzony dla skóry mieszanej, problematycznej i trądzikowej — przywraca równowagę bez wysuszania. Lekka, matująca formuła nie zatyka porów i nie obciąża skóry. Lunula Botanique — naturalna pielęgnacja w rytmie slow care. Bez parabenów, silikonów, SLS. Vegan, Not Tested On Animals.",
      handle: "clear-ritual-pure-touch-cream",
      weight: 120,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemność", values: ["50ml"] }],
      variants: [
        {
          title: "50ml",
          sku: "LUNULA-CLEARRITUAL-50",
          options: { Pojemność: "50ml" },
          prices: [
            { amount: 11900, currency_code: "pln" },
            { amount: 2800, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
      _tagValues: ["krem", "skóra mieszana", "trądzikowa", "problematyczna", "regulacja sebum", "ukojenie", "nawilżenie", "olej konopny", "twarz"],
    },
  ];

  // Extract tag values and strip from product defs before passing to workflow
  const tagMapping: { handle: string; tagValues: string[] }[] = [];
  const products = productDefs.map(({ _tagValues, ...product }) => {
    tagMapping.push({ handle: product.handle, tagValues: _tagValues });
    return product;
  });

  const { result: createdProducts } = await createProductsWorkflow(
    container
  ).run({
    input: { products },
  });

  logger.info(`Created ${createdProducts.length} cream products.`);

  // Now add tags to products using product module service
  logger.info("Adding tags to products...");

  // Collect all unique tag values
  const allTagValues = [
    ...new Set(tagMapping.flatMap((m) => m.tagValues)),
  ];

  // Create tags
  const createdTags = await productModuleService.createProductTags(
    allTagValues.map((v) => ({ value: v }))
  );
  const tagMap = new Map<string, string>();
  for (const tag of createdTags) {
    tagMap.set(tag.value, tag.id);
  }

  // Update each product with its tags
  for (const mapping of tagMapping) {
    const product = createdProducts.find(
      (p: any) => p.handle === mapping.handle
    );
    if (product) {
      const tagIds = mapping.tagValues
        .map((v) => tagMap.get(v))
        .filter(Boolean) as string[];
      if (tagIds.length) {
        await productModuleService.updateProducts(product.id, {
          tags: tagIds.map((id) => ({ id })),
        });
      }
    }
  }

  logger.info("Tags added successfully.");

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

  logger.info(
    "Done! 4 cream products added: Geranium Glow (129 zł), Golden Glow (139 zł), Rose Alchemy (149 zł), Clear Ritual (119 zł)."
  );
}
