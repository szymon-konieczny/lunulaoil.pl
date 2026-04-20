import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * One-time script to remove "Not Tested On Animals" from product descriptions
 * for EU Regulation 655/2013 compliance (removes "obvious claim" prohibited by law).
 *
 * Usage:
 *   Local:   npx medusa exec src/scripts/fix-product-descriptions.ts
 *   Railway: DATABASE_URL="..." npx medusa exec src/scripts/fix-product-descriptions.ts
 */
export default async function fixProductDescriptions({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Scanning products for EU 655/2013 non-compliant claims...")

  // Fetch all products (in batches if needed)
  const products = await productModuleService.listProducts(
    {},
    { take: 200 }
  )

  logger.info(`Checking ${products.length} products...`)

  const prohibitedPatterns: Array<[RegExp, string]> = [
    // "GMO Free, Organic, Not Tested On Animals." → "GMO Free, Organic."
    [/, Not Tested On Animals\./g, "."],
    // Any remaining " Not Tested On Animals" tokens
    [/,?\s*Not Tested On Animals\.?/g, ""],
    // CPNP references (defensive — shouldn't be in products but just in case)
    [/\s*Zarejestrowan[ey] w bazie CPNP[^.]*\./gi, ""],
    [/\s*\(baza CPNP\)/gi, ""],
    // Microbiological/dermatological norm claims
    [/Wszystkie produkty spełniają surowe normy mikrobiologiczne i dermatologiczne\.\s*/gi, ""],
    [/Są zarejestrowane w farmaceutycznej Bazie Leków[^.]*\.\s*/gi, ""],
    [/Certyfikowane dermatologicznie[.,]?\s*/gi, ""],
  ]

  let updatedCount = 0
  const updated: string[] = []

  for (const product of products) {
    const desc = product.description
    if (!desc) continue

    let newDesc = desc
    for (const [pattern, replacement] of prohibitedPatterns) {
      newDesc = newDesc.replace(pattern, replacement)
    }

    // Trim any double spaces/trailing whitespace introduced
    newDesc = newDesc.replace(/\s{2,}/g, " ").trim()

    if (newDesc !== desc) {
      await productModuleService.updateProducts(product.id, {
        description: newDesc,
      })
      updatedCount++
      updated.push(product.handle || product.id)
      logger.info(`  ✓ Updated: ${product.handle} (${product.title})`)
    }
  }

  logger.info("")
  logger.info(`Done. Updated ${updatedCount}/${products.length} products.`)
  if (updated.length) {
    logger.info("Updated products:")
    for (const h of updated) {
      logger.info(`  - ${h}`)
    }
  }
}
