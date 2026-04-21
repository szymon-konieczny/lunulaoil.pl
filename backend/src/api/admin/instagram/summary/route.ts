import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { INSTAGRAM_BOT_MODULE } from "../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../modules/instagram_bot/service"

const DAY_MS = 24 * 60 * 60 * 1000

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

  const now = Date.now()
  const since24h = new Date(now - DAY_MS)
  const since7d = new Date(now - 7 * DAY_MS)

  const recent = await igBot.listIgDmLogs(
    {},
    { take: 1000, order: { created_at: "DESC" } }
  )

  const tally = (rows: typeof recent, since: Date) => {
    let sent = 0
    let failed = 0
    let other = 0
    for (const r of rows) {
      const ts =
        r.created_at instanceof Date
          ? r.created_at.getTime()
          : new Date(r.created_at as unknown as string).getTime()
      if (ts < since.getTime()) continue
      if (r.status === "sent") sent++
      else if (r.status === "failed") failed++
      else other++
    }
    return { sent, failed, other }
  }

  const day = tally(recent, since24h)
  const week = tally(recent, since7d)
  const totalWeek = week.sent + week.failed + week.other
  const successRate =
    totalWeek === 0 ? null : Number(((week.sent / totalWeek) * 100).toFixed(1))

  const [, activeTriggers] = await igBot.listAndCountIgTriggers({
    is_active: true,
  })
  const [, totalTriggers] = await igBot.listAndCountIgTriggers({})

  res.json({
    day,
    week,
    success_rate_week: successRate,
    triggers: { active: activeTriggers, total: totalTriggers },
    enabled: process.env.ENABLE_INSTAGRAM_BOT === "true",
  })
}
