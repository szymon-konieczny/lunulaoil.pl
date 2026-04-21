import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const SHORT_LIVED_TOKEN_URL = "https://api.instagram.com/oauth/access_token"
const LONG_LIVED_TOKEN_URL = "https://graph.instagram.com/access_token"

type ShortLivedTokenResponse = {
  access_token: string
  user_id: number
  permissions?: string[]
}

type LongLivedTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { code, error, error_description } = req.query as Record<
    string,
    string | undefined
  >

  if (error) {
    res.status(400).json({
      error,
      error_description: error_description ?? null,
    })
    return
  }

  if (!code) {
    res.status(400).json({ error: "missing_code" })
    return
  }

  const clientId = process.env.INSTAGRAM_APP_ID
  const clientSecret = process.env.INSTAGRAM_APP_SECRET
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    res.status(500).json({
      error: "instagram_oauth_not_configured",
      message:
        "Set INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, and INSTAGRAM_REDIRECT_URI in the backend environment.",
    })
    return
  }

  const form = new URLSearchParams()
  form.set("client_id", clientId)
  form.set("client_secret", clientSecret)
  form.set("grant_type", "authorization_code")
  form.set("redirect_uri", redirectUri)
  form.set("code", code)

  const shortRes = await fetch(SHORT_LIVED_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  })

  if (!shortRes.ok) {
    const body = await shortRes.text()
    console.error("[instagram oauth] short-lived token exchange failed", {
      status: shortRes.status,
      body,
    })
    res.status(502).json({
      error: "short_token_exchange_failed",
      status: shortRes.status,
      body,
    })
    return
  }

  const shortToken = (await shortRes.json()) as ShortLivedTokenResponse

  const longUrl = new URL(LONG_LIVED_TOKEN_URL)
  longUrl.searchParams.set("grant_type", "ig_exchange_token")
  longUrl.searchParams.set("client_secret", clientSecret)
  longUrl.searchParams.set("access_token", shortToken.access_token)

  const longRes = await fetch(longUrl.toString())

  if (!longRes.ok) {
    const body = await longRes.text()
    console.error("[instagram oauth] long-lived token exchange failed", {
      status: longRes.status,
      body,
    })
    // Short-lived token is still usable (valid ~1 hour); log it so it isn't lost.
    console.log("[instagram oauth] short-lived access_token:", shortToken.access_token)
    console.log("[instagram oauth] user_id:", shortToken.user_id)
    res.status(502).json({
      error: "long_token_exchange_failed",
      status: longRes.status,
      body,
    })
    return
  }

  const longToken = (await longRes.json()) as LongLivedTokenResponse

  // The shop owner sees the success page; the developer reads the token from
  // the backend logs. Never render the token in the browser response.
  console.log("[instagram oauth] authorization complete")
  console.log("  user_id:        ", shortToken.user_id)
  console.log("  permissions:    ", shortToken.permissions ?? [])
  console.log("  access_token:   ", longToken.access_token)
  console.log("  expires_in (s): ", longToken.expires_in)

  res
    .status(200)
    .setHeader("Content-Type", "text/html; charset=utf-8")
    .send(
      `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <title>Lunula — Instagram połączone</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; max-width: 480px; margin: 10vh auto; padding: 0 1.5rem; color: #1f1f1f; }
      h1 { font-weight: 500; }
      p { line-height: 1.5; }
    </style>
  </head>
  <body>
    <h1>Instagram połączony z Lunulą</h1>
    <p>Autoryzacja zakończona pomyślnie. Możesz zamknąć to okno.</p>
  </body>
</html>`
    )
}
