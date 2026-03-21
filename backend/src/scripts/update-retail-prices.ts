import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * One-time script to update retail prices for existing products
 * and create JojobaCode Gold 100ml if missing.
 *
 * Usage: npx medusa exec src/scripts/update-retail-prices.ts
 */
export default async function updateRetailPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const pricingModuleService = container.resolve(Modules.PRICING)

  // ── Price updates (handle → new PLN price in grosze) ──
  const priceUpdates: Record<string, number> = {
    "pelnia-ksiezyca-250ml": 22100,
    "wschod-slonca-250ml": 14900,
    "ragnar-250ml": 14900,
    "hialcode": 6900,
    "squalanecode": 5600,
    "jojobacode": 5900,
  }

  // ── Cream title/option updates (50ml → 60ml) ──
  const creamHandles = [
    "geranium-glow-moon-touch-cream",
    "golden-glow-solar-touch-cream",
    "rose-alchemy-phyto-renew-cream",
    "clear-ritual-pure-touch-cream",
  ]

  // ── Update retail prices ──
  logger.info("Updating retail prices...")

  const allHandles = [
    ...Object.keys(priceUpdates),
    ...creamHandles,
  ]

  const products = await productModuleService.listProducts(
    { handle: allHandles },
    { relations: ["variants"], take: 50 }
  )

  for (const product of products) {
    const handle = product.handle
    if (!handle) continue

    // Update prices
    if (handle in priceUpdates) {
      const newAmount = priceUpdates[handle]
      const variant = product.variants?.[0]
      if (!variant) {
        logger.warn(`  No variant found for ${handle}, skipping price update`)
        continue
      }

      // Use query.graph to traverse the link between variant and price_set
      const { data: variantPriceData } = await query.graph({
        entity: "product_variant",
        fields: ["id", "price_set.id", "price_set.prices.*"],
        filters: { id: variant.id },
      })

      const priceSet = (variantPriceData[0] as any)?.price_set

      if (!priceSet?.id) {
        logger.warn(`  No price set found for ${handle}, skipping`)
        continue
      }

      // Find the PLN price and update it
      const plnPrice = priceSet.prices?.find(
        (p: any) => p.currency_code === "pln"
      )

      if (plnPrice) {
        await (pricingModuleService as any).updatePrices([
          { id: plnPrice.id, amount: newAmount },
        ])
        logger.info(
          `  ${handle}: ${plnPrice.amount / 100} zl → ${newAmount / 100} zl`
        )
      }
    }

    // Update cream titles and variants from 50ml to 60ml
    if (creamHandles.includes(handle)) {
      const newTitle = product.title?.replace("50ml", "60ml")
      if (newTitle && newTitle !== product.title) {
        await productModuleService.updateProducts(product.id, {
          title: newTitle,
        })
        logger.info(`  ${handle}: title updated to 60ml`)
      }

      // Update variant title and SKU
      const variant = product.variants?.[0]
      if (variant) {
        const newSku = variant.sku?.replace("-50", "-60")
        await productModuleService.updateProductVariants(variant.id, {
          title: "60ml",
          ...(newSku ? { sku: newSku } : {}),
        })
      }

      // Update product options
      const productWithOptions = await productModuleService.retrieveProduct(
        product.id,
        { relations: ["options", "options.values"] }
      )
      for (const option of productWithOptions.options || []) {
        for (const value of option.values || []) {
          if ((value as any).value === "50ml") {
            await productModuleService.updateProductOptionValues(
              (value as any).id,
              { value: "60ml" }
            )
          }
        }
      }
    }
  }

  // ── Create JojobaCode Gold 100ml if missing ──
  logger.info("Checking for JojobaCode Gold 100ml...")

  const existingGold = await productModuleService.listProducts({
    handle: "jojobacode-gold-100ml",
  })

  if (existingGold.length) {
    logger.info("  JojobaCode Gold 100ml already exists, skipping.")
  } else {
    logger.info("  Creating JojobaCode Gold 100ml...")

    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    const defaultSalesChannel =
      await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
      })
    const shippingProfiles =
      await fulfillmentModuleService.listShippingProfiles({ type: "default" })

    // Find Biozgodna Pielegnacja category
    const biocareCategories =
      await productModuleService.listProductCategories({
        name: "Biozgodna Pielegnacja",
      })

    const { result: createdProducts } = await createProductsWorkflow(
      container
    ).run({
      input: {
        products: [
          {
            title:
              "JojobaCode Gold - Olej jojoba z drobinkami zlota 100ml",
            subtitle: "Biozgodna Pielęgnacja",
            category_ids: biocareCategories.length
              ? [biocareCategories[0].id]
              : [],
            description:
              "100ml nierafinowanego oleju jojoba z drobinkami mineralnego zlota. Plynny wosk estrowy o budowie zblizonej do ludzkiego sebum, wzbogacony mieniącymi się drobinkami zlota. Reguluje wydzielanie sebum, nawilza, regeneruje i nadaje skorze subtelny blask. Idealny do masazu twarzy, pielegnacji ciala i aromaterapii. Bez parabenow, silikonow, SLS. GMO Free, Organic, Not Tested On Animals.",
            handle: "jojobacode-gold-100ml",
            weight: 150,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfiles[0]?.id,
            images: [
              {
                url: "https://lunulaoil.pl/wp-content/uploads/2022/08/Jojoba-Gold-Pelnia-Ksiezyca-Duza-Butelka.jpg",
              },
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
            sales_channels: defaultSalesChannel.length
              ? [{ id: defaultSalesChannel[0].id }]
              : [],
          },
        ],
      },
    })

    logger.info(`  Created JojobaCode Gold 100ml (88 zl)`)

    // Set inventory level
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
    })

    if (stockLocations[0] && createdProducts[0]?.variants?.[0]) {
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

      const newLevels: CreateInventoryLevelInput[] = []
      for (const item of inventoryItems) {
        if (!existingItemIds.has(item.id)) {
          newLevels.push({
            location_id: stockLocations[0].id,
            stocked_quantity: 1000000,
            inventory_item_id: item.id,
          })
        }
      }

      if (newLevels.length) {
        await createInventoryLevelsWorkflow(container).run({
          input: { inventory_levels: newLevels },
        })
      }
    }
  }

  logger.info("Retail price update complete!")
}
