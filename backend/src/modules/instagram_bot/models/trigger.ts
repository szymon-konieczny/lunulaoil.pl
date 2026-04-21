import { model } from "@medusajs/framework/utils"

const IgTrigger = model.define("ig_trigger", {
  id: model.id().primaryKey(),
  ig_post_id: model.text(),
  pattern_type: model.enum(["keyword", "regex", "exact"]).default("keyword"),
  pattern: model.text(),
  product_handle: model.text(),
  dm_template: model.text(),
  is_active: model.boolean().default(true),
  rate_limit_hours: model.number().default(24),
  metadata: model.json().nullable(),
})

export default IgTrigger
