import { MedusaService } from "@medusajs/framework/utils"
import IgTrigger from "./models/trigger"
import IgDmLog from "./models/dm-log"
import IgOptOut from "./models/opt-out"
import IgCredential from "./models/ig-credential"
import { matchAny, TriggerLike } from "./matchers"

type CanSendResult =
  | { ok: true }
  | { ok: false; reason: "opted_out" | "rate_limited" }

type SaveCredentialInput = {
  ig_user_id: string
  access_token: string
  expires_in?: number | null
  token_type?: string | null
  username?: string | null
}

class InstagramBotService extends MedusaService({
  IgTrigger,
  IgDmLog,
  IgOptOut,
  IgCredential,
}) {
  /** Returns the stored Instagram credential, or null if not connected yet. */
  async getCredential() {
    const all = await this.listIgCredentials({})
    return all[0] ?? null
  }

  /**
   * Upserts the single credential row. `expires_in` (seconds, from the token
   * response) is converted to an absolute `expires_at` used by the refresh job.
   */
  async saveCredential(data: SaveCredentialInput) {
    const expires_at =
      typeof data.expires_in === "number"
        ? new Date(Date.now() + data.expires_in * 1000)
        : null

    const fields = {
      ig_user_id: data.ig_user_id,
      access_token: data.access_token,
      token_type: data.token_type ?? null,
      username: data.username ?? null,
      expires_at,
    }

    const existing = await this.listIgCredentials({})
    if (existing.length) {
      const [first, ...rest] = existing
      if (rest.length) {
        await this.deleteIgCredentials(rest.map((r) => r.id))
      }
      return await this.updateIgCredentials({ id: first.id, ...fields })
    }
    return await this.createIgCredentials(fields)
  }

  /**
   * GDPR / Meta "Data Deletion Request": removes every row that ties this IG
   * user to our system — their DM history and any opt-out record. We never store
   * message content beyond delivery logs, so this is the full footprint.
   * Returns the row counts removed (useful for logging / the status page).
   */
  async deleteUserData(
    ig_user_id: string
  ): Promise<{ dm_logs: number; opt_outs: number }> {
    const logs = await this.listIgDmLogs({ ig_user_id })
    if (logs.length) {
      await this.deleteIgDmLogs(logs.map((l) => l.id))
    }
    const optOuts = await this.listIgOptOuts({ ig_user_id })
    if (optOuts.length) {
      await this.deleteIgOptOuts(optOuts.map((o) => o.id))
    }
    return { dm_logs: logs.length, opt_outs: optOuts.length }
  }

  /**
   * Meta "Deauthorize" callback: the user disconnected our app, so the stored
   * access token is now useless and must not linger. Removes the credential row
   * for that account (matches the single-row model in saveCredential).
   */
  async deleteCredentialForUser(ig_user_id: string): Promise<number> {
    const creds = await this.listIgCredentials({ ig_user_id })
    if (creds.length) {
      await this.deleteIgCredentials(creds.map((c) => c.id))
    }
    return creds.length
  }

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
