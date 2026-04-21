import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { INSTAGRAM_BOT_MODULE } from "../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../modules/instagram_bot/service"

type PatternType = "keyword" | "regex" | "exact"

type CreateTriggerBody = {
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

const validateCreate = (body: CreateTriggerBody): string | null => {
  if (!body.ig_post_id?.trim()) return "ig_post_id is required"
  if (!body.pattern?.trim()) return "pattern is required"
  if (!body.product_handle?.trim()) return "product_handle is required"
  if (!body.dm_template?.trim()) return "dm_template is required"
  if (body.pattern_type && !PATTERN_TYPES.includes(body.pattern_type)) {
    return `pattern_type must be one of ${PATTERN_TYPES.join(", ")}`
  }
  if (
    body.rate_limit_hours !== undefined &&
    (typeof body.rate_limit_hours !== "number" || body.rate_limit_hours < 0)
  ) {
    return "rate_limit_hours must be a non-negative number"
  }
  if (body.pattern_type === "regex") {
    try {
      new RegExp(body.pattern!)
    } catch {
      return "pattern is not a valid regular expression"
    }
  }
  return null
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

  const limit = Math.min(
    Number.parseInt((req.query.limit as string) ?? "50", 10) || 50,
    200
  )
  const offset =
    Number.parseInt((req.query.offset as string) ?? "0", 10) || 0
  const q = (req.query.q as string | undefined)?.trim()
  const is_active =
    req.query.is_active === "true"
      ? true
      : req.query.is_active === "false"
        ? false
        : undefined

  const filters: Record<string, unknown> = {}
  if (is_active !== undefined) filters.is_active = is_active
  if (q) filters.ig_post_id = q

  const [triggers, count] = await igBot.listAndCountIgTriggers(filters, {
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  })

  res.json({ triggers, count, limit, offset })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateTriggerBody>,
  res: MedusaResponse
): Promise<void> => {
  const body = req.body ?? {}
  const err = validateCreate(body)
  if (err) {
    res.status(400).json({ error: err })
    return
  }

  const productModule = req.scope.resolve(Modules.PRODUCT)
  const products = await productModule.listProducts({
    handle: body.product_handle,
  })
  if (products.length === 0) {
    res
      .status(400)
      .json({ error: `Product with handle "${body.product_handle}" not found` })
    return
  }

  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)
  const [trigger] = await igBot.createIgTriggers([
    {
      ig_post_id: body.ig_post_id!.trim(),
      pattern_type: body.pattern_type ?? "keyword",
      pattern: body.pattern!.trim(),
      product_handle: body.product_handle!.trim(),
      dm_template: body.dm_template!,
      is_active: body.is_active ?? true,
      rate_limit_hours: body.rate_limit_hours ?? 24,
      metadata: body.metadata ?? null,
    },
  ])

  res.status(201).json({ trigger })
}
