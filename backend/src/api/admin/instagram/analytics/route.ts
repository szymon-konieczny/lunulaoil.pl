import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { INSTAGRAM_BOT_MODULE } from "../../../../modules/instagram_bot"
import type InstagramBotService from "../../../../modules/instagram_bot/service"

type LogLike = {
  id: string
  trigger_id: string | null
  status:
    | "sent"
    | "failed"
    | "rate_limited"
    | "duplicate"
    | "opted_out"
    | "no_match"
  created_at: Date | string
}

const DAY_MS = 24 * 60 * 60 * 1000

const toDayKey = (ts: number): string => {
  const d = new Date(ts)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const igBot = req.scope.resolve<InstagramBotService>(INSTAGRAM_BOT_MODULE)

  const days = Math.max(
    1,
    Math.min(Number.parseInt((req.query.days as string) ?? "14", 10) || 14, 90)
  )
  const since = new Date(Date.now() - days * DAY_MS)

  const logs = (await igBot.listIgDmLogs(
    {},
    { take: 10_000, order: { created_at: "DESC" } }
  )) as LogLike[]

  const inWindow = logs.filter((l) => {
    const ts =
      l.created_at instanceof Date
        ? l.created_at.getTime()
        : new Date(l.created_at).getTime()
    return ts >= since.getTime()
  })

  const byDay = new Map<
    string,
    { sent: number; failed: number; other: number }
  >()
  for (let i = 0; i < days; i++) {
    const key = toDayKey(Date.now() - (days - 1 - i) * DAY_MS)
    byDay.set(key, { sent: 0, failed: 0, other: 0 })
  }
  for (const l of inWindow) {
    const ts =
      l.created_at instanceof Date
        ? l.created_at.getTime()
        : new Date(l.created_at).getTime()
    const key = toDayKey(ts)
    const bucket = byDay.get(key) ?? { sent: 0, failed: 0, other: 0 }
    if (l.status === "sent") bucket.sent++
    else if (l.status === "failed") bucket.failed++
    else bucket.other++
    byDay.set(key, bucket)
  }

  const daily = Array.from(byDay.entries()).map(([day, v]) => ({
    day,
    ...v,
  }))

  const perTrigger = new Map<string, { sent: number; failed: number }>()
  for (const l of inWindow) {
    if (!l.trigger_id) continue
    const cur = perTrigger.get(l.trigger_id) ?? { sent: 0, failed: 0 }
    if (l.status === "sent") cur.sent++
    else if (l.status === "failed") cur.failed++
    perTrigger.set(l.trigger_id, cur)
  }
  const topTriggers = Array.from(perTrigger.entries())
    .map(([trigger_id, v]) => ({ trigger_id, ...v }))
    .sort((a, b) => b.sent - a.sent)
    .slice(0, 10)

  res.json({ days, daily, top_triggers: topTriggers })
}
