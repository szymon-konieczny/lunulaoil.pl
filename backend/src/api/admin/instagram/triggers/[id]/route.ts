import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../../modules/instagram_bot/service"

type PatternType = "keyword" | "regex" | "exact"

type UpdateTriggerBody = {
  ig_post_id?: string
  pattern_type?: PatternType
  pattern?: string
  product_handle?: string
  dm_template?: string
  is_active?: boolean
  rate_limit_hours?: number
  metadata?: Record<string, unknown> | null
}

const PATTERN_TYPES: PatternType[] = ["keyword", "regex", "exact"]

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
  const trigger = await igBot.retrieveIgTrigger(req.params.id)
  res.json({ trigger })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateTriggerBody>,
  res: MedusaResponse
): Promise<void> => {
  const body = req.body ?? {}

  if (body.pattern_type && !PATTERN_TYPES.includes(body.pattern_type)) {
    res
      .status(400)
      .json({ error: `pattern_type must be one of ${PATTERN_TYPES.join(", ")}` })
    return
  }
  if (
    body.rate_limit_hours !== undefined &&
    (typeof body.rate_limit_hours !== "number" || body.rate_limit_hours < 0)
  ) {
    res
      .status(400)
      .json({ error: "rate_limit_hours must be a non-negative number" })
    return
  }
  if (
    body.pattern_type === "regex" ||
    (body.pattern && body.pattern_type === undefined)
  ) {
    if (body.pattern) {
      try {
        new RegExp(body.pattern)
      } catch {
        if (body.pattern_type === "regex") {
          res
            .status(400)
            .json({ error: "pattern is not a valid regular expression" })
          return
        }
      }
    }
  }

  if (body.product_handle) {
    const productModule = req.scope.resolve(Modules.PRODUCT)
    const products = await productModule.listProducts({
      handle: body.product_handle,
    })
    if (products.length === 0) {
      res.status(400).json({
        error: `Product with handle "${body.product_handle}" not found`,
      })
      return
    }
  }

  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
  const update: Record<string, unknown> = { id: req.params.id }
  for (const key of [
    "ig_post_id",
    "pattern_type",
    "pattern",
    "product_handle",
    "dm_template",
    "is_active",
    "rate_limit_hours",
    "metadata",
  ] as const) {
    if (body[key] !== undefined) update[key] = body[key]
  }
  const [trigger] = await igBot.updateIgTriggers([update])
  res.json({ trigger })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
  await igBot.deleteIgTriggers(req.params.id)
  res.json({ id: req.params.id, object: "ig_trigger", deleted: true })
}
