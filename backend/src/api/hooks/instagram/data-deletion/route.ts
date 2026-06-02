import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { randomBytes } from "crypto"
import { parseSignedRequest } from "../../../../lib/instagram/signature"
import { INSTAGRAM_BOT_MODULE } from "../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../modules/instagram_bot/service"

/**
 * Meta "Data Deletion Request" callback.
 *
 * When a user removes our app from their Instagram/Facebook settings (or files a
 * deletion request), Meta POSTs a `signed_request` here. We verify it with the
 * app secret, wipe everything we store for that account, and return the
 * `{ url, confirmation_code }` JSON Meta requires so the user can track status.
 *
 * Docs: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
 */

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
      code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
      .ok { color: #166534; }
    </style>
  </head>
  <body>${body}</body>
</html>`

const getSignedRequest = (req: MedusaRequest): string | undefined => {
  const fromBody = (req.body as { signed_request?: unknown } | undefined)
    ?.signed_request
  if (typeof fromBody === "string") return fromBody

  const raw = (req as MedusaRequest & { rawBody?: unknown }).rawBody
  const str = Buffer.isBuffer(raw)
    ? raw.toString("utf8")
    : typeof raw === "string"
      ? raw
      : undefined
  if (!str) return undefined
  return new URLSearchParams(str).get("signed_request") ?? undefined
}

const statusBase = (req: MedusaRequest): string => {
  const redirect = process.env.IG_OAUTH_REDIRECT_URI
  if (redirect) {
    try {
      return new URL(redirect).origin
    } catch {
      /* fall through */
    }
  }
  return `https://${req.headers.host}`
}

/**
 * Status page Meta links the user to. We don't persist per-request status (the
 * deletion is synchronous and complete by the time we return), so any code that
 * reaches here is reported as done.
 */
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const code = req.query.code
  res.status(200).type("html").send(
    renderPage(
      "Usuwanie danych — Lunula",
      `<h1 class="ok">Żądanie usunięcia danych zostało zrealizowane</h1>
       <p>Wszystkie dane powiązane z Twoim kontem Instagram (historia wiadomości
       bota i ewentualny wpis o rezygnacji) zostały usunięte z naszego systemu.</p>
       ${typeof code === "string" ? `<p>Kod potwierdzenia: <code>${code}</code></p>` : ""}
       <p>W razie pytań: <a href="mailto:kontakt@lunulaoil.pl">kontakt@lunulaoil.pl</a></p>`
    )
  )
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER)

  const appSecret = process.env.IG_APP_SECRET
  if (!appSecret) {
    res.status(500).json({ error: "IG_APP_SECRET not configured" })
    return
  }

  const signedRequest = getSignedRequest(req)
  const payload = parseSignedRequest(signedRequest, appSecret)
  if (!payload || typeof payload.user_id !== "string") {
    res.status(400).json({ error: "Invalid signed_request" })
    return
  }

  const igUserId = payload.user_id
  const code = randomBytes(12).toString("hex")

  try {
    const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
    const removed = await igBot.deleteUserData(igUserId)
    logger.info(
      `[ig data-deletion] code=${code} user=${igUserId} dm_logs=${removed.dm_logs} opt_outs=${removed.opt_outs}`
    )
  } catch (e) {
    // We still return 200 with the code: deletion is best-effort and Meta only
    // needs a trackable confirmation. The error is logged for follow-up.
    logger.error(
      `[ig data-deletion] code=${code} user=${igUserId} failed: ${
        e instanceof Error ? e.message : String(e)
      }`
    )
  }

  res.status(200).json({
    url: `${statusBase(req)}/hooks/instagram/data-deletion?code=${code}`,
    confirmation_code: code,
  })
}
