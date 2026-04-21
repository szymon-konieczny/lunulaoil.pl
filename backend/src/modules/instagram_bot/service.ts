import { MedusaService } from "@medusajs/framework/utils"
import IgTrigger from "./models/trigger"
import IgDmLog from "./models/dm-log"
import IgOptOut from "./models/opt-out"
import { matchAny, TriggerLike } from "./matchers"

type CanSendResult =
  | { ok: true }
  | { ok: false; reason: "opted_out" | "rate_limited" }

class InstagramBotService extends MedusaService({
  IgTrigger,
  IgDmLog,
  IgOptOut,
}) {
  async findActiveTriggersForPost(ig_post_id: string) {
    return this.listIgTriggers({ ig_post_id, is_active: true })
  }

  matchComment<T extends TriggerLike>(text: string, triggers: T[]): T | null {
    for (const t of triggers) {
      if (matchAny(text, t)) return t
    }
    return null
  }

  async canSendDm(
    ig_user_id: string,
    trigger: { id: string; rate_limit_hours?: number | null }
  ): Promise<CanSendResult> {
    const [optOut] = await this.listIgOptOuts({ ig_user_id })
    if (optOut) return { ok: false, reason: "opted_out" }

    const hours = trigger.rate_limit_hours ?? 24
    const windowStart = new Date(Date.now() - hours * 3600 * 1000)

    const recent = await this.listIgDmLogs({
      ig_user_id,
      trigger_id: trigger.id,
      status: "sent",
    })

    const withinWindow = recent.some(
      (r: { created_at?: Date | string | null }) => {
        if (!r.created_at) return false
        const ts =
          r.created_at instanceof Date
            ? r.created_at.getTime()
            : new Date(r.created_at).getTime()
        return ts >= windowStart.getTime()
      }
    )

    if (withinWindow) return { ok: false, reason: "rate_limited" }
    return { ok: true }
  }
}

export default InstagramBotService
