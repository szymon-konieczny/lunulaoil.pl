import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { parseSignedRequest } from "../../../../lib/instagram/signature"
import { INSTAGRAM_BOT_MODULE } from "../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../modules/instagram_bot/service"

/**
 * Meta "Deauthorize" callback.
 *
 * Fired when a user disconnects our app. Meta POSTs a `signed_request`; we verify
 * it, drop the stored access token for that account (it can no longer be used or
 * refreshed), and also clear the user's bot data so a disconnect leaves nothing
 * behind. Meta only expects a 200 — no body is required.
 *
 * Docs: https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#deauthcallback
 */

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

  const payload = parseSignedRequest(getSignedRequest(req), appSecret)
  if (!payload || typeof payload.user_id !== "string") {
    res.status(400).json({ error: "Invalid signed_request" })
    return
  }

  const igUserId = payload.user_id

  try {
    const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
    const removedCreds = await igBot.deleteCredentialForUser(igUserId)
    const removedData = await igBot.deleteUserData(igUserId)
    logger.info(
      `[ig deauthorize] user=${igUserId} credentials=${removedCreds} dm_logs=${removedData.dm_logs} opt_outs=${removedData.opt_outs}`
    )
  } catch (e) {
    logger.error(
      `[ig deauthorize] user=${igUserId} failed: ${
        e instanceof Error ? e.message : String(e)
      }`
    )
  }

  res.status(200).json({ ok: true })
}
