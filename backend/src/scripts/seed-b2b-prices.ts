import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Creates a "Salon / B2B" customer group and a Price List with
 * salon/wholesale prices for all Lunula products.
 *
 * Idempotent: skips if group/price list already exist.
 *
 * Usage: npx medusa exec src/scripts/seed-b2b-prices.ts
 */
export default async function seedB2BPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)
  const customerModuleService = container.resolve(Modules.CUSTOMER)
  const pricingModuleService = container.resolve(Modules.PRICING)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // ── Salon prices (handle → PLN price in grosze) ──
  const salonPrices: Record<string, number> = {
    // 250ml oils
    "magnolia-250ml": 8600,
    "poranna-rosa-250ml": 8600,
    "ksiezyc-w-nowiu-250ml": 9600,
    "wschod-slonca-250ml": 9900,
    "pelnia-ksiezyca-250ml": 19000,
    "ragnar-250ml": 9900,
    "green-witch-divine-250ml": 9600,
    // 100ml
    "jojobacode-gold-100ml": 6800,
    // 30ml serums
    "hialcode": 4900,
    "squalanecode": 3600,
    "jojobacode": 3900,
    // Soaps 100g
    "rusalka-mydlo-rytualne": 2600,
    "rozyczka-mydlo-rytualne": 2600,
    "mokosza-mydlo-rytualne": 2600,
    // Creams 60ml
    "geranium-glow-moon-touch-cream": 6500,
    "golden-glow-solar-touch-cream": 7000,
    "rose-alchemy-phyto-renew-cream": 7500,
    "clear-ritual-pure-touch-cream": 6500,
  }

  // ── 1. Create or find B2B Customer Group ──
  logger.info("Setting up Salon / B2B customer group...")

  const existingGroups = await customerModuleService.listCustomerGroups({
    name: "Salon / B2B",
  })

  let b2bGroupId: string

  if (existingGroups.length) {
    b2bGroupId = existingGroups[0].id
    logger.info(`  Using existing group: ${b2bGroupId}`)
  } else {
    const group = await customerModuleService.createCustomerGroups({
      name: "Salon / B2B",
    })
    b2bGroupId = (group as any).id
    logger.info(`  Created group: ${b2bGroupId}`)
  }

  // ── 2. Look up variant IDs and their price_set_ids ──
  logger.info("Looking up product variants and price sets...")

  const handles = Object.keys(salonPrices)
  const products = await productModuleService.listProducts(
    { handle: handles },
    { relations: ["variants"], take: handles.length + 5 }
  )

  // Map handle → { variantId, priceSetId }
  const variantMap = new Map<string, { variantId: string; priceSetId: string }>()

  for (const p of products) {
    if (!p.handle || !p.variants?.[0]) continue
    const variantId = p.variants[0].id

    // Look up the price_set linked to this variant
    const { data: variantPriceData } = await query.graph({
      entity: "product_variant",
      fields: ["id", "price_set.id"],
      filters: { id: variantId },
    })

    const priceSetId = (variantPriceData[0] as any)?.price_set?.id
    if (priceSetId) {
      variantMap.set(p.handle, { variantId, priceSetId })
    } else {
      logger.warn(`  No price set for ${p.handle}`)
    }
  }

  // Report missing products
  for (const handle of handles) {
    if (!variantMap.has(handle)) {
      logger.warn(`  Product not found or no price set: ${handle}`)
    }
  }

  logger.info(`  Found ${variantMap.size}/${handles.length} products with price sets`)

  // ── 3. Check for existing price list ──
  const existingPriceLists = await (pricingModuleService as any).listPriceLists({
    title: "Cennik salonowy B2B",
  })

  if (existingPriceLists.length) {
    logger.info(
      `  Price list "Cennik salonowy B2B" already exists (${existingPriceLists[0].id}). Deleting and recreating...`
    )
    await pricingModuleService.deletePriceLists([existingPriceLists[0].id])
  }

  // ── 4. Build price list prices ──
  const prices: {
    price_set_id: string
    currency_code: string
    amount: number
  }[] = []

  for (const [handle, amount] of Object.entries(salonPrices)) {
    const entry = variantMap.get(handle)
    if (entry) {
      prices.push({
        price_set_id: entry.priceSetId,
        currency_code: "pln",
        amount,
      })
    }
  }

  if (!prices.length) {
    logger.error("  No prices to create. Aborting.")
    return
  }

  // ── 5. Create the Price List ──
  logger.info(`Creating B2B price list with ${prices.length} prices...`)

  const priceList = await pricingModuleService.createPriceLists([
    {
      title: "Cennik salonowy B2B",
      description: "Ceny hurtowe dla salonow kosmetycznych i SPA",
      type: "override",
      status: "active",
      rules: {
        customer_group_id: [b2bGroupId],
      },
      prices,
    },
  ])

  logger.info(`  Created price list: ${(priceList as any)[0]?.id}`)

  // Log summary
  logger.info("\nB2B Price Summary:")
  for (const [handle, amount] of Object.entries(salonPrices)) {
    if (variantMap.has(handle)) {
      logger.info(`  ${handle}: ${amount / 100} zl`)
    }
  }

  logger.info("\nDone! B2B pricing is active.")
  logger.info(
    "To add a customer to the B2B group, use the Medusa Admin dashboard:\n" +
      "  Customer Groups → Salon / B2B → Add Customers"
  )
}
