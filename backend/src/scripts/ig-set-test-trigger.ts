import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../modules/instagram_bot"
import type InstagramBotService from "../modules/instagram_bot/service"

/**
 * Create / update a CATCH-ALL Instagram trigger: every comment on one post →
 * private DM with a fixed shop link.
 *
 * You pass the post SHORTCODE (the bit after /p/ or /reel/ in the IG URL); the
 * script resolves it to the numeric media id the webhook actually carries, by
 * matching permalinks under /me/media. The shop link is kept LITERAL in the DM
 * template (not built from the product handle), so the ?v_id= variant survives.
 *
 *   IG_POST_SHORTCODE=DZcnvXNtEZN railway run npm run ig:set-test-trigger
 *
 * `railway run` injects the prod service env (long-lived token + DATABASE_URL),
 * so this writes the prod trigger from your machine — no deploy needed. The
 * token is read from ig_credential and never printed. Idempotent: re-running
 * updates the same row (matched by media id). Disable later by setting the row
 * is_active=false via the admin API, or delete it.
 *
 * Overridable via env: IG_POST_SHORTCODE, IG_MEDIA_ID (skip resolution),
 * IG_PRODUCT_HANDLE, IG_DM_LINK, IG_DM_TEMPLATE, IG_RATE_LIMIT_HOURS.
 */

const GRAPH = "https://graph.instagram.com"

const SHORTCODE = process.env.IG_POST_SHORTCODE ?? "DZcnvXNtEZN"
const PRODUCT_HANDLE =
  process.env.IG_PRODUCT_HANDLE ?? "golden-glow-solar-touch-cream"
const DM_LINK =
  process.env.IG_DM_LINK ??
  "https://www.lunulaoil.pl/pl/products/golden-glow-solar-touch-cream?v_id=variant_01KM1AWNYM6ES8YGJRPSZ6SV6W"
const DM_TEMPLATE =
  process.env.IG_DM_TEMPLATE ??
  `Cześć! Dziękujemy za komentarz 🌿 Oto Twój link do kremu Golden Glow – Solar Touch: ${DM_LINK}`
const RATE_LIMIT_HOURS = Number.parseInt(
  process.env.IG_RATE_LIMIT_HOURS ?? "24",
  10
)

type Media = { id: string; permalink?: string }
type MediaPage = { data?: Media[]; paging?: { next?: string }; error?: unknown }

const matchesShortcode = (permalink: string | undefined): boolean =>
  !!permalink &&
  (permalink.includes(`/p/${SHORTCODE}`) ||
    permalink.includes(`/reel/${SHORTCODE}`) ||
    permalink.includes(`/tv/${SHORTCODE}`))

export default async function igSetTestTrigger({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const igBot = container.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
  const productModule = container.resolve(Modules.PRODUCT)

  // The workflow resolves the product by handle and fails if it's missing, so
  // validate it here before writing the trigger.
  const [product] = await productModule.listProducts({ handle: PRODUCT_HANDLE })
  if (!product) {
    logger.error(
      `[ig-set-test-trigger] product handle "${PRODUCT_HANDLE}" not found on this env — aborting.`
    )
    return
  }

  const cred = await igBot.getCredential()
  if (!cred?.access_token) {
    logger.error(
      "[ig-set-test-trigger] no stored IG credential — connect the account via OAuth first."
    )
    return
  }
  const auth = { headers: { Authorization: `Bearer ${cred.access_token}` } }

  // Resolve shortcode → numeric media id via permalink match.
  let mediaId = process.env.IG_MEDIA_ID
  if (!mediaId) {
    let url = `${GRAPH}/me/media?fields=id,permalink&limit=50`
    for (let page = 0; page < 12 && url && !mediaId; page++) {
      const res = await fetch(url, auth)
      const json = (await res.json()) as MediaPage
      if (!res.ok) {
        logger.error(
          `[ig-set-test-trigger] /me/media → ${res.status}: ${JSON.stringify(
            json
          ).slice(0, 300)}`
        )
        return
      }
      const hit = (json.data ?? []).find((m) => matchesShortcode(m.permalink))
      if (hit) mediaId = hit.id
      url = json.paging?.next ?? ""
    }
  }
  if (!mediaId) {
    logger.error(
      `[ig-set-test-trigger] could not find media for shortcode "${SHORTCODE}" on this account (checked up to 600 posts). Set IG_MEDIA_ID to override.`
    )
    return
  }
  logger.info(
    `[ig-set-test-trigger] resolved shortcode ${SHORTCODE} → media id ${mediaId}`
  )

  const fields = {
    ig_post_id: mediaId,
    pattern_type: "regex" as const,
    pattern: ".*", // catch-all: matches every comment
    product_handle: PRODUCT_HANDLE,
    dm_template: DM_TEMPLATE,
    is_active: true,
    rate_limit_hours: Number.isFinite(RATE_LIMIT_HOURS) ? RATE_LIMIT_HOURS : 24,
    metadata: { country_code: "pl", note: "catch-all test trigger" },
  }

  // Idempotent upsert: one trigger per media id.
  const existing = await igBot.listIgTriggers({ ig_post_id: mediaId })
  if (existing.length) {
    await igBot.updateIgTriggers({ id: existing[0].id, ...fields })
    if (existing.length > 1) {
      await igBot.deleteIgTriggers(existing.slice(1).map((t) => t.id))
    }
    logger.info(
      `[ig-set-test-trigger] ✓ updated trigger ${existing[0].id} (catch-all → private DM)`
    )
  } else {
    const [trigger] = await igBot.createIgTriggers([fields])
    logger.info(
      `[ig-set-test-trigger] ✓ created trigger ${trigger.id} (catch-all → private DM)`
    )
  }

  logger.info(`[ig-set-test-trigger] post:      ${SHORTCODE} (media ${mediaId})`)
  logger.info(`[ig-set-test-trigger] rate limit: ${fields.rate_limit_hours}h per user`)
  logger.info(`[ig-set-test-trigger] DM text:    ${DM_TEMPLATE}`)
}
