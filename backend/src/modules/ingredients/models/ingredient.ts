import { model } from "@medusajs/framework/utils"

const Ingredient = model.define("ingredient", {
  id: model.id().primaryKey(),
  name: model.text(),
  name_latin: model.text().nullable(),
  handle: model.text().unique(),
  description: model.text(),
  benefits: model.array().default([]),
  source: model.text().nullable(),
  category: model.text().default("other"),
  product_handles: model.array().default([]),
  hide_in_lexicon: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default Ingredient
