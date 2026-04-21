import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { INSTAGRAM_BOT_MODULE } from "../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../modules/instagram_bot/service"

const STATUSES = [
  "sent",
  "failed",
  "rate_limited",
  "duplicate",
  "opted_out",
  "no_match",
] as const
type LogStatus = (typeof STATUSES)[number]

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

  const status = req.query.status as string | undefined
  const trigger_id = req.query.trigger_id as string | undefined

  const filters: Record<string, unknown> = {}
  if (status && (STATUSES as readonly string[]).includes(status)) {
    filters.status = status as LogStatus
  }
  if (trigger_id) filters.trigger_id = trigger_id

  const [logs, count] = await igBot.listAndCountIgDmLogs(filters, {
    skip: offset,
    take: limit,
    order: { created_at: "DESC" },
  })

  res.json({ logs, count, limit, offset })
}
