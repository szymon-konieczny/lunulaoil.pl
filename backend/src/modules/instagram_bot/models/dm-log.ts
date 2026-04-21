import { model } from "@medusajs/framework/utils"

const IgDmLog = model.define("ig_dm_log", {
  id: model.id().primaryKey(),
  trigger_id: model.text().nullable(),
  ig_user_id: model.text(),
  ig_username: model.text().nullable(),
  ig_comment_id: model.text().unique(),
  comment_text: model.text(),
  product_handle: model.text(),
  product_url: model.text(),
  dm_message_id: model.text().nullable(),
  status: model.enum([
    "sent",
    "failed",
    "rate_limited",
    "duplicate",
    "opted_out",
    "no_match",
  ]),
  error: model.text().nullable(),
})

export default IgDmLog
