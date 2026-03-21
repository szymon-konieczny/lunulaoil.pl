import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Fix category structure:
 * - Make body-zone categories top-level (remove parent)
 * - Hide old clutter categories from nav (mark as internal)
 * - Delete empty parent "Strefa pielegnacji"
 *
 * Usage:
 *   npx medusa exec src/scripts/fix-categories.ts
 */
export default async function fixCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  logger.info("Fixing category structure...")

  // ── 1. Make zone categories top-level ──
  const zoneHandles = ["twarz", "cialo", "rytual", "wlosy"]

  for (const handle of zoneHandles) {
    const cats = await productModuleService.listProductCategories({ handle })
    if (cats.length) {
      await productModuleService.updateProductCategories(cats[0].id, {
        parent_category_id: null,
        rank: zoneHandles.indexOf(handle),
      } as any)
      logger.info(`  ${handle}: made top-level`)
    }
  }

  // ── 2. Hide old categories from nav ──
  const hideHandles = [
    "biozgodna-pielegnacja",
    "mydla-rytualne",
    "olejki-bio-lunula-oil",
    "olejki-do-twarzy",
    "warsztaty",
    "skrypty-i-materialy",
    "kremy",
    "strefa-pielegnacji",
  ]

  for (const handle of hideHandles) {
    const cats = await productModuleService.listProductCategories({ handle })
    if (cats.length) {
      await productModuleService.updateProductCategories(cats[0].id, {
        is_internal: true,
      })
      logger.info(`  ${handle}: hidden from nav`)
    }
  }

  logger.info("\nDone! Nav now shows: Twarz, Cialo, Rytual, Wlosy")
}
