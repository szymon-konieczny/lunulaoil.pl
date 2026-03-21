import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function seedBotaniqueProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  // Get existing infrastructure
  const defaultSalesChannel =
    await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    })

  if (!defaultSalesChannel.length) {
    logger.error(
      "No Default Sales Channel found. Run 'npm run seed' first to set up infrastructure."
    )
    return
  }

  const shippingProfiles =
    await fulfillmentModuleService.listShippingProfiles({
      type: "default",
    })
  const shippingProfile = shippingProfiles[0]

  if (!shippingProfile) {
    logger.error("No shipping profile found. Run 'npm run seed' first.")
    return
  }

  // Get existing stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  const stockLocation = stockLocations[0]

  if (!stockLocation) {
    logger.error("No stock location found. Run 'npm run seed' first.")
    return
  }

  const productModuleService = container.resolve(Modules.PRODUCT)

  // ── Categories ──────────────────────────────────────────────

  logger.info("Creating categories for new product lines...")

  async function getOrCreateCategory(name: string): Promise<string> {
    const existing = await productModuleService.listProductCategories({ name })
    if (existing.length) {
      logger.info(`  Using existing category: ${name}`)
      return existing[0].id
    }
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name, is_active: true }] },
    })
    logger.info(`  Created category: ${name}`)
    return result[0].id
  }

  const catBiocare = await getOrCreateCategory("Biozgodna Pielegnacja")
  const catSoaps = await getOrCreateCategory("Mydla Rytualne")

  // ── Product Definitions ─────────────────────────────────────

  const salesChannelId = defaultSalesChannel[0].id

  const productDefs = [
    // ── Biozgodna Pielęgnacja Twarzy ──
    {
      title: "HialCode - Serum z kwasem hialuronowym",
      subtitle: "Biozgodna Pielęgnacja Twarzy",
      category_ids: [catBiocare],
      description:
        "Kwas hialuronowy to naturalny skladnik skory, ktory odpowiada za jej nawilzenie i elastycznosc. Intensywnie nawilza w glebi skory, wypelnia drobne zmarszczki od wewnatrz, przywraca elastycznosc i jedrnosc, wzmacnia bariere ochronna skory. Odpowiedni dla kazdego typu cery. Idealnie sprawdza sie w polaczeniu z SqualaneCode lub JojobaCode. Kwas hialuronowy intensywnie nawilza, a skwalan lub jojoba pomagaja zamknac wilgoc w skorze, tworzac ochronna bariere. Nawilzenie, ktore skora rozumie. HialCode.",
      handle: "hialcode",
      weight: 50,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemnosc", values: ["30ml"] }],
      variants: [
        {
          title: "30ml",
          sku: "LUNULA-HIALCODE-30",
          options: { Pojemnosc: "30ml" },
          prices: [
            { amount: 6900, currency_code: "pln" },
            { amount: 1900, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "kwas hialuronowy",
        "nawilzenie",
        "biozgodna pielegnacja",
        "serum",
        "twarz",
        "elastycznosc",
      ],
    },
    {
      title: "SqualaneCode - Skwalan",
      subtitle: "Biozgodna Pielęgnacja Twarzy",
      category_ids: [catBiocare],
      description:
        "Ultra lekki, suchy, niekomedogenny lipid. Skwalan to stabilna, uwodorniona forma skwalenu - lipidu, ktory naturalnie wystepuje w ludzkim sebum. Biokompatybilny ze skora: dobrze tolerowany, lekki i niekomedogenny. Wzmacnia bariere hydrolipidowa, ogranicza transepidermalna utrate wody (TEWL), zmiekcza i wygladza skore, poprawia elastycznosc bez efektu ciezkosci. Odpowiedni takze dla skory wrazliwej i tradzikowej. Idealnie sprawdza sie w polaczeniu z HialCode. Minimalizm, ktory dziala. Skora rozumie ten jezyk. SqualaneCode.",
      handle: "squalanecode",
      weight: 50,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemnosc", values: ["30ml"] }],
      variants: [
        {
          title: "30ml",
          sku: "LUNULA-SQUALANECODE-30",
          options: { Pojemnosc: "30ml" },
          prices: [
            { amount: 5600, currency_code: "pln" },
            { amount: 1400, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "skwalan",
        "biozgodna pielegnacja",
        "lipid",
        "twarz",
        "wlosy",
        "nawilzenie",
        "bariera hydrolipidowa",
      ],
    },
    {
      title: "JojobaCode - Olej jojoba",
      subtitle: "Biozgodna Pielęgnacja Twarzy",
      category_ids: [catBiocare],
      description:
        "Inteligentny, wielozadaniowy, samoregulujacy. Olej jojoba to nie olej, a plynny wosk o budowie zblizonej do ludzkiego sebum. Rozpoznaje potrzeby skory - wspiera regulacje wydzielania loju: utrzymuje wilgoc w skorze suchej, ogranicza przetluszczanie sie tlustej. Sprawdza sie jako emolient, baza do masazu, olejek do demakijazu, eliksir na koncowki wlosow, baza do aromaterapii, serum do skorek i ust. Z komedogennoscia 0-1 rozcienncza ciezsze oleje. Jojoba to olej, ktory slucha skory. JojobaCode.",
      handle: "jojobacode",
      weight: 50,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Pojemnosc", values: ["30ml"] }],
      variants: [
        {
          title: "30ml",
          sku: "LUNULA-JOJOBACODE-30",
          options: { Pojemnosc: "30ml" },
          prices: [
            { amount: 5900, currency_code: "pln" },
            { amount: 1400, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "jojoba",
        "biozgodna pielegnacja",
        "wielozadaniowy",
        "twarz",
        "wlosy",
        "masaz",
        "aromaterapia",
        "regulacja sebum",
      ],
    },

    {
      title: "JojobaCode Gold - Olej jojoba z drobinkami zlota 100ml",
      subtitle: "Biozgodna Pielęgnacja",
      category_ids: [catBiocare],
      description:
        "100ml nierafinowanego oleju jojoba z drobinkami mineralnego zlota. Plynny wosk estrowy o budowie zblizonej do ludzkiego sebum, wzbogacony mieniącymi się drobinkami zlota. Reguluje wydzielanie sebum, nawilza, regeneruje i nadaje skorze subtelny blask. Idealny do masazu twarzy, pielegnacji ciala i aromaterapii. Bez parabenow, silikonow, SLS. GMO Free, Organic, Not Tested On Animals.",
      handle: "jojobacode-gold-100ml",
      weight: 150,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [
        { url: "https://lunulaoil.pl/wp-content/uploads/2022/08/Jojoba-Gold-Pelnia-Ksiezyca-Duza-Butelka.jpg" },
      ],
      options: [{ title: "Pojemnosc", values: ["100ml"] }],
      variants: [
        {
          title: "100ml",
          sku: "LUNULA-JOJOBACODE-GOLD-100",
          options: { Pojemnosc: "100ml" },
          prices: [
            { amount: 8800, currency_code: "pln" },
            { amount: 2100, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "jojoba",
        "zloto",
        "biozgodna pielegnacja",
        "twarz",
        "cialo",
        "100ml",
      ],
    },

    // ── Mydła Rytualne - Lunula Slavic Soap ──
    {
      title: "Rusalka - Mydlo rytualne",
      subtitle: "Lunula Slavic Soap",
      category_ids: [catSoaps],
      description:
        "Rumianek, lawenda, platki owsiane. W INCI m.in. roslinne oleje (Olea Europaea Fruit Oil, Cocos Nucifera Oil), maslo shea (Butyrospermum Parkii Butter), ekstrakt z rumianku (Chamomilla Recutita), olejek lawendowy (Lavandula Angustifolia Oil) oraz Avena Sativa. Rusalka to lekkosc i ukojenie. Delikatnie ziolowa z dodatkiem platkow owsianych, ktore nadaja jej miekkiej, naturalnej faktury. Sprawdza sie przy skorze wrazliwej i suchej - kiedy potrzeba ciszy, prostoty i oddechu.",
      handle: "rusalka-mydlo-rytualne",
      weight: 100,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Wariant", values: ["Standardowy"] }],
      variants: [
        {
          title: "Standardowy",
          sku: "LUNULA-RUSALKA",
          options: { Wariant: "Standardowy" },
          prices: [
            { amount: 3300, currency_code: "pln" },
            { amount: 800, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "mydlo",
        "slavic soap",
        "rumianek",
        "lawenda",
        "owsianka",
        "skora wrazliwa",
        "ukojenie",
      ],
    },
    {
      title: "Rozyczka - Mydlo rytualne",
      subtitle: "Lunula Slavic Soap",
      category_ids: [catSoaps],
      description:
        "Glinka rozowa i czerwona, May Chang, slodka pomarancza, roza damascenska. W skladzie m.in.: naturalne oleje roslinne, Illite i Kaolin (glinki), Litsea Cubeba Oil (May Chang), Citrus Aurantium Dulcis Peel Oil, Rosa Damascena Flower Oil. Rozyczka laczy mineralna moc glinki z promienna energia cytrusow i rozy. Kwiatowo-owocowa, swieza, z subtelna nuta kobiecego ciepla. Wspiera rownowage skory i nadaje jej zdrowy, naturalny blask. To mydlo czasu rozkwitu.",
      handle: "rozyczka-mydlo-rytualne",
      weight: 100,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Wariant", values: ["Standardowy"] }],
      variants: [
        {
          title: "Standardowy",
          sku: "LUNULA-ROZYCZKA",
          options: { Wariant: "Standardowy" },
          prices: [
            { amount: 3300, currency_code: "pln" },
            { amount: 800, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "mydlo",
        "slavic soap",
        "glinka",
        "roza",
        "may chang",
        "rozswietlenie",
        "blask",
      ],
    },
    {
      title: "Mokosza - Mydlo rytualne",
      subtitle: "Lunula Slavic Soap",
      category_ids: [catSoaps],
      description:
        "Kawa, oleje roslinne, hibiskus. W INCI m.in.: Coffea Arabica Seed Powder, Hibiscus Sabdariffa Flower Extract oraz bogata baza olejowa i maslo shea. Mokosza jest ziemista i wyrazista. Naturalny kolor kawy, delikatnie peelingujaca struktura i ciepiy, otulajacy zapach sprawiaja, ze to mydlo ma korzenny, stabilny charakter. Inspirowana archetypem Matki Ziemi, chetnie wybierana rowniez przez mezczyzn. Daje poczucie mocy, zakorzenienia i energii.",
      handle: "mokosza-mydlo-rytualne",
      weight: 100,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [] as { url: string }[],
      options: [{ title: "Wariant", values: ["Standardowy"] }],
      variants: [
        {
          title: "Standardowy",
          sku: "LUNULA-MOKOSZA",
          options: { Wariant: "Standardowy" },
          prices: [
            { amount: 3300, currency_code: "pln" },
            { amount: 800, currency_code: "eur" },
          ],
        },
      ],
      sales_channels: [{ id: salesChannelId }],
      _tagValues: [
        "mydlo",
        "slavic soap",
        "kawa",
        "hibiskus",
        "peeling",
        "energia",
        "mezczyzna",
      ],
    },
  ]

  // ── Create Products ─────────────────────────────────────────

  logger.info(`Seeding ${productDefs.length} Lunula Botanique products...`)

  const tagMapping: { handle: string; tagValues: string[] }[] = []
  const products = productDefs.map(({ _tagValues, ...product }) => {
    tagMapping.push({ handle: product.handle, tagValues: _tagValues })
    return product
  })

  const { result: createdProducts } = await createProductsWorkflow(
    container
  ).run({
    input: { products },
  })

  logger.info(`Created ${createdProducts.length} products.`)

  // ── Tags ────────────────────────────────────────────────────

  logger.info("Adding tags to products...")

  const allTagValues = [...new Set(tagMapping.flatMap((m) => m.tagValues))]
  const tagMap = new Map<string, string>()

  // Get existing tags first
  const existingTags = await productModuleService.listProductTags(
    { value: allTagValues },
    { take: allTagValues.length }
  )
  for (const tag of existingTags) {
    tagMap.set(tag.value, tag.id)
  }

  // Create only missing tags
  const missingTagValues = allTagValues.filter((v) => !tagMap.has(v))
  if (missingTagValues.length) {
    const createdTags = await productModuleService.createProductTags(
      missingTagValues.map((v) => ({ value: v }))
    )
    for (const tag of createdTags) {
      tagMap.set(tag.value, tag.id)
    }
  }

  for (const mapping of tagMapping) {
    const product = createdProducts.find(
      (p: any) => p.handle === mapping.handle
    )
    if (product) {
      const tagIds = mapping.tagValues
        .map((v) => tagMap.get(v))
        .filter(Boolean) as string[]
      if (tagIds.length) {
        await productModuleService.updateProducts(product.id, {
          tag_ids: tagIds,
        })
      }
    }
  }

  logger.info("Tags added.")

  // ── Inventory ───────────────────────────────────────────────

  logger.info("Setting inventory levels...")

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id"],
  })
  const existingItemIds = new Set(
    existingLevels.map((l: any) => l.inventory_item_id)
  )

  const inventoryLevels: CreateInventoryLevelInput[] = []
  for (const inventoryItem of inventoryItems) {
    if (!existingItemIds.has(inventoryItem.id)) {
      inventoryLevels.push({
        location_id: stockLocation.id,
        stocked_quantity: 1000000,
        inventory_item_id: inventoryItem.id,
      })
    }
  }

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    })
  }

  logger.info(
    "Done! Products seeded:\n" +
      "  - HialCode (69 zl)\n" +
      "  - SqualaneCode (56 zl)\n" +
      "  - JojobaCode (59 zl)\n" +
      "  - JojobaCode Gold 100ml (88 zl)\n" +
      "  - Rusalka (33 zl)\n" +
      "  - Rozyczka (33 zl)\n" +
      "  - Mokosza (33 zl)"
  )
}
