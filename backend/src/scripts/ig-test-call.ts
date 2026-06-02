import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../modules/instagram_bot"
import type InstagramBotService from "../modules/instagram_bot/service"

/**
 * Two jobs in one:
 *  1. Makes the "required test API calls" App Review expects for
 *     instagram_business_manage_comments — a successful GET /{media}/comments
 *     flips the permission's call counter above 0.
 *  2. Lists the comments on the target post with their id + author id, so you
 *     can feed a real comment into `npm run ig:replay` for the screencast.
 *
 * Uses the stored long-lived token from ig_credential (never printed).
 *
 * Target a specific post (recommended — the demo reel):
 *   IG_MEDIA_ID=18084759761128018 railway run npm run ig:testcall
 * Or omit IG_MEDIA_ID to use the account's most recent media:
 *   railway run npm run ig:testcall
 *
 * `railway run` injects the prod service env (token + DATABASE_URL). If it can't
 * reach the DB (internal host), tell me — we'll switch to a token-based standalone.
 */

const GRAPH = "https://graph.instagram.com"

type Comment = {
  id: string
  text?: string
  username?: string
  timestamp?: string
  from?: { id?: string; username?: string }
}

export default async function igTestCall({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const igBot = container.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

  const cred = await igBot.getCredential()
  if (!cred?.access_token) {
    logger.error("[ig-test-call] No stored credential — run OAuth first.")
    return
  }
  const auth = { headers: { Authorization: `Bearer ${cred.access_token}` } }

  // token sanity / account identity
  const meRes = await fetch(`${GRAPH}/me?fields=id,username`, auth)
  const me = (await meRes.json()) as { id?: string; username?: string }
  logger.info(`[ig-test-call] account: @${me.username ?? "?"} (${me.id ?? "?"}) — /me ${meRes.status}`)

  // resolve target media
  let mediaId = process.env.IG_MEDIA_ID
  if (!mediaId) {
    const mediaRes = await fetch(`${GRAPH}/me/media?fields=id&limit=1`, auth)
    const media = (await mediaRes.json()) as { data?: { id: string }[] }
    mediaId = media?.data?.[0]?.id
  }
  if (!mediaId) {
    logger.error("[ig-test-call] No media id (set IG_MEDIA_ID or check token).")
    return
  }

  // manage_comments call (registers the App Review test call) + author ids
  const cRes = await fetch(
    `${GRAPH}/${mediaId}/comments?fields=id,text,username,timestamp,from{id,username}&limit=25`,
    auth
  )
  const payload = (await cRes.json()) as { data?: Comment[]; error?: unknown }
  logger.info(`[ig-test-call] GET /${mediaId}/comments → ${cRes.status}`)

  if (!cRes.ok) {
    logger.error(`[ig-test-call] ✗ comments call failed: ${JSON.stringify(payload).slice(0, 300)}`)
    return
  }
  logger.info("[ig-test-call] ✓ manage_comments API call succeeded — App Review counter should register it.")

  const comments = payload.data ?? []
  logger.info(`[ig-test-call] ${comments.length} comment(s) on ${mediaId}:`)
  for (const c of comments) {
    const fromId = c.from?.id ?? "(no from.id)"
    const handle = c.from?.username ?? c.username ?? "?"
    logger.info(`  • id=${c.id} from=${fromId} @${handle} text="${c.text ?? ""}"`)
  }

  // pre-built replay command for the first keyword match (HIAL by default)
  const kw = (process.env.IG_KEYWORD ?? "HIAL").toLowerCase()
  const hit = comments.find((c) => (c.text ?? "").toLowerCase().includes(kw))
  if (hit?.from?.id) {
    logger.info(
      `[ig-test-call] Ready replay command:\n  npm run ig:replay -- --media-id ${mediaId} --comment-id ${hit.id} --from-id ${hit.from.id} --text ${process.env.IG_KEYWORD ?? "HIAL"}`
    )
  } else if (hit) {
    logger.info(`[ig-test-call] Found keyword comment ${hit.id} but no from.id returned — use the commenter's own user id for ig:replay.`)
  } else {
    logger.info(`[ig-test-call] No comment containing "${process.env.IG_KEYWORD ?? "HIAL"}" yet — add one from a second account, then re-run.`)
  }
}
