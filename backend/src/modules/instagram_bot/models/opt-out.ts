import { model } from "@medusajs/framework/utils"

const IgOptOut = model.define("ig_opt_out", {
  id: model.id().primaryKey(),
  ig_user_id: model.text().unique(),
})

export default IgOptOut
