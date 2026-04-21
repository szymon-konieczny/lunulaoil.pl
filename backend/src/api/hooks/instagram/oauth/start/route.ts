import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { randomBytes } from "crypto"
import { buildAuthorizationUrl } from "../../../../../lib/instagram/oauth-client"

const DEFAULT_SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_messages",
  "instagram_business_manage_comments",
]

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  if (process.env.ENABLE_INSTAGRAM_BOT !== "true") {
    res.status(404).send("Not found")
    return
  }
  const clientId = process.env.IG_APP_ID
  const redirectUri = process.env.IG_OAUTH_REDIRECT_URI
  if (!clientId || !redirectUri) {
    res.status(500).json({
      error: "IG_APP_ID or IG_OAUTH_REDIRECT_URI not configured",
    })
    return
  }
  const state = randomBytes(16).toString("hex")
  const url = buildAuthorizationUrl({
    clientId,
    redirectUri,
    scopes: DEFAULT_SCOPES,
    state,
  })
  res.redirect(302, url)
}
