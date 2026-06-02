import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../modules/instagram_bot"
import type InstagramBotService from "../modules/instagram_bot/service"

/**
 * Makes the "required test API calls" App Review expects before you can submit
 * `instagram_business_manage_comments`. It uses the stored long-lived token (from
 * ig_credential — never printed) to hit two Instagram Graph API endpoints:
 *   1. GET /me/media           → exercises instagram_business_basic
 *   2. GET /{media-id}/comments → exercises instagram_business_manage_comments
 *
 * One successful comments call flips the permission's API-call counter above 0,
 * which is what the "wykonano wymagane testowe wywołania API" checkbox tracks.
 *
 * Run against the environment that holds the token (prod):
 *   railway run npm run ig:testcall          # uses the prod service env + DB
 * or inside the deployed container's shell:
 *   npx medusa exec ./src/scripts/ig-test-call.ts
 */

const GRAPH = "https://graph.instagram.com"

export default async function igTestCall({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const igBot = container.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

  const cred = await igBot.getCredential()
  if (!cred?.access_token) {
    logger.error("[ig-test-call] No stored credential — run OAuth first.")
    return
  }

  const auth = { headers: { Authorization: `Bearer ${cred.access_token}` } }

  // 1) basic — list the account's own media
  const mediaRes = await fetch(`${GRAPH}/me/media?fields=id,caption&limit=1`, auth)
  const media = (await mediaRes.json()) as {
    data?: { id: string }[]
    error?: unknown
  }
  logger.info(
    `[ig-test-call] GET /me/media → ${mediaRes.status} ${JSON.stringify(
      media
    ).slice(0, 300)}`
  )

  const mediaId = media?.data?.[0]?.id
  if (!mediaId) {
    logger.error(
      "[ig-test-call] No media returned — cannot run the comments test call."
    )
    return
  }

  // 2) manage_comments — read comments on that media
  const commentsRes = await fetch(
    `${GRAPH}/${mediaId}/comments?fields=id,text&limit=5`,
    auth
  )
  const comments = (await commentsRes.json()) as {
    data?: unknown[]
    error?: unknown
  }
  logger.info(
    `[ig-test-call] GET /${mediaId}/comments → ${commentsRes.status} ${JSON.stringify(
      comments
    ).slice(0, 300)}`
  )

  if (commentsRes.ok) {
    logger.info(
      "[ig-test-call] ✓ manage_comments API call succeeded — the App Review counter should now register it."
    )
  } else {
    logger.error(
      "[ig-test-call] ✗ comments call failed — check token scope / expiry."
    )
  }
}
