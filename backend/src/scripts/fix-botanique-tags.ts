import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function fixBotaniqueTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  const tagMapping: Record<string, string[]> = {
    hialcode: ["kwas hialuronowy", "biozgodna pielegnacja", "nawilzenie", "twarz", "serum", "elastycznosc"],
    squalanecode: ["skwalan", "biozgodna pielegnacja", "lipid", "twarz", "wlosy", "nawilzenie", "bariera hydrolipidowa"],
    jojobacode: ["jojoba", "biozgodna pielegnacja", "wielozadaniowy", "twarz", "wlosy", "sebum", "emolient"],
    "rusalka-mydlo-rytualne": ["mydlo", "slavic soap", "rumianek", "lawenda", "owsianka", "skora wrazliwa", "ukojenie"],
    "rozyczka-mydlo-rytualne": ["mydlo", "slavic soap", "glinka rozowa", "may chang", "roza", "blask", "rozswietlenie"],
    "mokosza-mydlo-rytualne": ["mydlo", "slavic soap", "kawa", "hibiskus", "peeling", "energia", "mezczyzna"],
  }

  // Get all unique tag values
  const allTagValues = [...new Set(Object.values(tagMapping).flat())]

  // Get or create tags
  const tagMap = new Map<string, string>()

  const existingTags = await productModuleService.listProductTags(
    { value: allTagValues },
    { take: allTagValues.length }
  )
  for (const tag of existingTags) {
    tagMap.set(tag.value, tag.id)
  }

  const missingTagValues = allTagValues.filter((v) => !tagMap.has(v))
  if (missingTagValues.length) {
    logger.info(`Creating ${missingTagValues.length} missing tags...`)
    const created = await productModuleService.createProductTags(
      missingTagValues.map((v) => ({ value: v }))
    )
    for (const tag of created) {
      tagMap.set(tag.value, tag.id)
    }
  }

  // Assign tags to products
  for (const [handle, tagValues] of Object.entries(tagMapping)) {
    const [product] = await productModuleService.listProducts({ handle })
    if (!product) {
      logger.warn(`Product ${handle} not found, skipping tags.`)
      continue
    }
    const tagIds = tagValues.map((v) => tagMap.get(v)).filter(Boolean) as string[]
    await productModuleService.updateProducts(product.id, { tag_ids: tagIds })
    logger.info(`Tagged ${handle} with ${tagIds.length} tags.`)
  }

  logger.info("Done! Tags fixed.")
}
