import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

const INSTAGRAM_AUTHORIZE_URL = "https://www.instagram.com/oauth/authorize"

const DEFAULT_SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_messages",
  "instagram_manage_comments",
].join(",")

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const clientId = process.env.INSTAGRAM_APP_ID
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!clientId || !redirectUri) {
    res.status(500).json({
      error: "instagram_oauth_not_configured",
      message:
        "Set INSTAGRAM_APP_ID and INSTAGRAM_REDIRECT_URI in the backend environment.",
    })
    return
  }

  const scopes = process.env.INSTAGRAM_SCOPES || DEFAULT_SCOPES
  const state = crypto.randomBytes(16).toString("hex")

  const authUrl = new URL(INSTAGRAM_AUTHORIZE_URL)
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", scopes)
  authUrl.searchParams.set("state", state)

  res.redirect(authUrl.toString())
}
