import { model } from "@medusajs/framework/utils"

/**
 * Stores the long-lived Instagram access token obtained via OAuth, so it can be
 * auto-refreshed by the `ig-refresh-token` job (env vars can't be rewritten at
 * runtime). A single logical row is maintained (see service.saveCredential).
 */
const IgCredential = model.define("ig_credential", {
  id: model.id().primaryKey(),
  ig_user_id: model.text(),
  username: model.text().nullable(),
  access_token: model.text(),
  token_type: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
})

export default IgCredential
