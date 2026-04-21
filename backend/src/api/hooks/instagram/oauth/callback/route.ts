import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  getInstagramUserInfo,
} from "../../../../../lib/instagram/oauth-client"

const renderPage = (title: string, body: string): string => `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: -apple-system, system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.5; }
      h1 { font-size: 22px; margin-bottom: 8px; }
      p { margin: 12px 0; }
      .ok { color: #166534; }
      .err { color: #991b1b; }
    </style>
  </head>
  <body>${body}</body>
</html>`

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  if (process.env.ENABLE_INSTAGRAM_BOT !== "true") {
    res.status(404).send("Not found")
    return
  }

  const error = req.query.error
  const errorReason = req.query.error_reason
  const errorDescription = req.query.error_description
  if (typeof error === "string") {
    logger.warn(
      `ig-oauth-callback: user declined or error: ${error} / ${errorReason} / ${errorDescription}`
    )
    res
      .status(400)
      .type("text/html")
      .send(
        renderPage(
          "Autoryzacja anulowana",
          `<h1 class="err">Autoryzacja anulowana</h1>
           <p>Instagram zwrócił błąd: <b>${String(error)}</b>.</p>
           <p>${String(errorDescription ?? "")}</p>
           <p>Prosimy zamknąć kartę i skontaktować się z nami.</p>`
        )
      )
    return
  }

  const code = req.query.code
  if (typeof code !== "string" || !code) {
    res.status(400).type("text/html").send(
      renderPage(
        "Brak kodu autoryzacji",
        `<h1 class="err">Brak kodu autoryzacji</h1>
         <p>Upewnij się, że klikasz link otrzymany bezpośrednio od nas.</p>`
      )
    )
    return
  }

  const clientId = process.env.IG_APP_ID
  const clientSecret = process.env.IG_APP_SECRET
  const redirectUri = process.env.IG_OAUTH_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) {
    logger.error(
      "ig-oauth-callback: missing IG_APP_ID / IG_APP_SECRET / IG_OAUTH_REDIRECT_URI"
    )
    res.status(500).type("text/html").send(
      renderPage(
        "Błąd konfiguracji",
        `<h1 class="err">Błąd konfiguracji po stronie serwera</h1>
         <p>Skontaktuj się z nami — nie możemy dokończyć autoryzacji.</p>`
      )
    )
    return
  }

  try {
    const shortLived = await exchangeCodeForShortLivedToken({
      clientId,
      clientSecret,
      redirectUri,
      code,
    })
    const longLived = await exchangeForLongLivedToken({
      clientSecret,
      shortLivedToken: shortLived.access_token,
    })
    const user = await getInstagramUserInfo({
      accessToken: longLived.access_token,
    })

    logger.info(
      `ig-oauth-callback: SUCCESS user_id=${user.id} username=${user.username ?? "?"} expires_in=${longLived.expires_in}s token=${longLived.access_token}`
    )

    res.status(200).type("text/html").send(
      renderPage(
        "Autoryzacja zakończona",
        `<h1 class="ok">✓ Autoryzacja zakończona</h1>
         <p>Dziękujemy! Konto Instagram <b>${user.username ?? user.id}</b> zostało pomyślnie połączone z botem.</p>
         <p>Możesz zamknąć tę kartę. Nic więcej nie trzeba klikać.</p>`
      )
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error(`ig-oauth-callback: token exchange failed: ${msg}`)
    res.status(500).type("text/html").send(
      renderPage(
        "Błąd wymiany tokena",
        `<h1 class="err">Nie udało się zakończyć autoryzacji</h1>
         <p>Szczegóły: ${msg}</p>
         <p>Prosimy skontaktować się z nami.</p>`
      )
    )
  }
}
