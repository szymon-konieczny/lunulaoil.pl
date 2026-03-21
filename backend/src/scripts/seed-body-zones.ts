import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Seed body-zone categories (Twarz, Cialo, Rytual, Wlosy)
 * and assign existing products to them.
 *
 * Usage:
 *   npx medusa exec src/scripts/seed-body-zones.ts
 */
export default async function seedBodyZones({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Seeding body-zone categories...")

  // ── 1. Define categories ──
  const zones = [
    { name: "Twarz", handle: "twarz" },
    { name: "Cialo", handle: "cialo" },
    { name: "Rytual", handle: "rytual" },
    { name: "Wlosy", handle: "wlosy" },
  ]

  // ── 2. Get or create parent category ──
  let parentId: string | undefined
  const existingParent = await productModuleService.listProductCategories({
    handle: "strefa-pielegnacji",
  })

  if (existingParent.length) {
    parentId = existingParent[0].id
    logger.info(`  Using existing parent: Strefa pielegnacji (${parentId})`)
  } else {
    const { result: parentResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: [
          {
            name: "Strefa pielegnacji",
            handle: "strefa-pielegnacji",
            is_active: true,
            is_internal: true,
          },
        ],
      },
    })
    parentId = parentResult[0].id
    logger.info(`  Created parent: Strefa pielegnacji (${parentId})`)
  }

  // ── 3. Create zone categories ──
  const zoneIds: Record<string, string> = {}

  for (const zone of zones) {
    const existing = await productModuleService.listProductCategories({
      handle: zone.handle,
    })

    if (existing.length) {
      zoneIds[zone.handle] = existing[0].id
      logger.info(`  Using existing: ${zone.name} (${existing[0].id})`)
    } else {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name: zone.name,
              handle: zone.handle,
              is_active: true,
              parent_category_id: parentId,
            },
          ],
        },
      })
      zoneIds[zone.handle] = result[0].id
      logger.info(`  Created: ${zone.name} (${result[0].id})`)
    }
  }

  // ── 4. Product → Zone mappings ──
  const productZones: Record<string, string[]> = {
    // Twarz: serums, face oils, creams
    hialcode: ["twarz"],
    squalanecode: ["twarz"],
    jojobacode: ["twarz"],
    "jojobacode-gold-100ml": ["twarz"],
    "lipidcode-30ml": ["twarz"],
    "geranium-glow-moon-touch-cream": ["twarz"],
    "golden-glow-solar-touch-cream": ["twarz"],
    "rose-alchemy-phyto-renew-cream": ["twarz"],
    "clear-ritual-pure-touch-cream": ["twarz"],

    // Cialo: massage/body oils 250ml
    "pelnia-ksiezyca-250ml": ["cialo"],
    "wschod-slonca-250ml": ["cialo"],
    "ragnar-250ml": ["cialo"],
    "ksiezyc-w-nowiu-250ml": ["cialo"],
    "poranna-rosa-250ml": ["cialo"],
    "magnolia-250ml": ["cialo"],
    "green-witch-divine-250ml": ["cialo"],

    // Rytual: ritual soaps
    "rusalka-mydlo-rytualne": ["rytual"],
    "rozyczka-mydlo-rytualne": ["rytual"],
    "mokosza-mydlo-rytualne": ["rytual"],

    // Wlosy: oils that work for hair too
    "pelnia-ksiezyca-250ml_hair": ["wlosy"],
    "magnolia-250ml_hair": ["wlosy"],
    "poranna-rosa-250ml_hair": ["wlosy"],
  }

  // Flatten: collect all handles that need each zone
  const zoneToHandles: Record<string, string[]> = {
    twarz: [],
    cialo: [],
    rytual: [],
    wlosy: [],
  }

  for (const [handle, zones] of Object.entries(productZones)) {
    const cleanHandle = handle.replace(/_hair$/, "")
    for (const zone of zones) {
      if (!zoneToHandles[zone].includes(cleanHandle)) {
        zoneToHandles[zone].push(cleanHandle)
      }
    }
  }

  // ── 5. Assign products to categories ──
  for (const [zoneHandle, handles] of Object.entries(zoneToHandles)) {
    const categoryId = zoneIds[zoneHandle]
    logger.info(`\nAssigning products to ${zoneHandle}...`)

    for (const handle of handles) {
      const products = await productModuleService.listProducts({ handle })
      if (!products.length) {
        logger.warn(`  Product not found: ${handle}`)
        continue
      }

      const product = products[0]

      // Get current category IDs
      const fullProduct = await productModuleService.retrieveProduct(
        product.id,
        { relations: ["categories"] }
      )
      const existingCategoryIds = (fullProduct.categories || []).map(
        (c: any) => c.id
      )

      // Skip if already assigned
      if (existingCategoryIds.includes(categoryId)) {
        logger.info(`  ${handle}: already in ${zoneHandle}`)
        continue
      }

      // Add the new category (keep existing ones)
      await productModuleService.updateProducts(product.id, {
        category_ids: [...existingCategoryIds, categoryId],
      })
      logger.info(`  ${handle}: added to ${zoneHandle}`)
    }
  }

  logger.info("\nDone! Body-zone categories are set up.")
  logger.info("Categories: Twarz, Cialo, Rytual, Wlosy")
}
