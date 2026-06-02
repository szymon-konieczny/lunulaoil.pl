import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../modules/instagram_bot"
import type InstagramBotService from "../modules/instagram_bot/service"
import { refreshLongLivedToken } from "../lib/instagram/oauth-client"

// Refresh once the token is within this many days of expiry. Instagram
// long-lived tokens last ~60 days; refreshing requires the token to be >24h old
// and not yet expired, so a daily check with a 10-day window is safe.
const REFRESH_WITHIN_DAYS = 10

export default async function igRefreshTokenJob(
  container: MedusaContainer
): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (process.env.ENABLE_INSTAGRAM_BOT !== "true") {
    return
  }

  const igBot = container.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
  const credential = await igBot.getCredential()

  if (!credential?.access_token) {
    logger.info("ig-refresh-token: no stored credential yet — skipping")
    return
  }

  // Only refresh when close to expiry (skip if we still have plenty of time).
  if (credential.expires_at) {
    const msLeft = new Date(credential.expires_at).getTime() - Date.now()
    if (msLeft > REFRESH_WITHIN_DAYS * 24 * 3600 * 1000) {
      return
    }
  }

  try {
    const refreshed = await refreshLongLivedToken({
      accessToken: credential.access_token,
    })
    await igBot.saveCredential({
      ig_user_id: credential.ig_user_id,
      username: credential.username ?? null,
      access_token: refreshed.access_token,
      token_type: refreshed.token_type,
      expires_in: refreshed.expires_in,
    })
    logger.info(
      `ig-refresh-token: token refreshed (expires_in=${refreshed.expires_in}s)`
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error(`ig-refresh-token: refresh failed: ${msg}`)
  }
}

export const config = {
  name: "ig-refresh-token",
  // Daily at 03:15
  schedule: "15 3 * * *",
}
