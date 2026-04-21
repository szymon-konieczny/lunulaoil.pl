import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import type { IEventBusModuleService } from "@medusajs/types"
import { verifySignature } from "../../../../lib/instagram/signature"

export const IG_COMMENT_RECEIVED = "instagram.comment.received"
export const IG_MESSAGE_RECEIVED = "instagram.message.received"

type IgCommentValue = {
  id: string
  text: string
  from?: { id: string; username?: string }
  media?: { id: string }
}

type IgMessageValue = {
  sender: { id: string }
  recipient?: { id: string }
  message: { mid?: string; text?: string }
  timestamp?: number
}

type IgChange<T> = { field: string; value: T }

type IgEntry = {
  id: string
  time: number
  changes?: IgChange<unknown>[]
  messaging?: IgMessageValue[]
}

type IgWebhookPayload = {
  object: string
  entry?: IgEntry[]
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]
  const expected = process.env.IG_VERIFY_TOKEN

  if (
    mode === "subscribe" &&
    typeof token === "string" &&
    typeof challenge === "string" &&
    expected &&
    token === expected
  ) {
    res.status(200).type("text/plain").send(challenge)
    return
  }
  res.status(403).send("Forbidden")
}

const getRawBody = (req: MedusaRequest): Buffer | string | undefined => {
  const raw = (req as MedusaRequest & { rawBody?: unknown }).rawBody
  if (Buffer.isBuffer(raw)) return raw
  if (typeof raw === "string") return raw
  return undefined
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  if (process.env.ENABLE_INSTAGRAM_BOT !== "true") {
    res.status(200).json({ ok: true, skipped: "disabled" })
    return
  }

  const appSecret = process.env.IG_APP_SECRET
  if (!appSecret) {
    res.status(500).json({ error: "IG_APP_SECRET not configured" })
    return
  }

  const raw = getRawBody(req)
  if (!raw) {
    res.status(400).json({ error: "Missing raw body" })
    return
  }

  const signatureHeader =
    (req.headers["x-hub-signature-256"] as string | undefined) ??
    (req.headers["X-Hub-Signature-256"] as unknown as string | undefined)

  if (!verifySignature(raw, signatureHeader, appSecret)) {
    res.status(401).json({ error: "Invalid signature" })
    return
  }

  const payload = req.body as IgWebhookPayload
  if (!payload || payload.object !== "instagram") {
    res.status(200).json({ ok: true, skipped: "non-instagram object" })
    return
  }

  const eventBus = req.scope.resolve<IEventBusModuleService>(Modules.EVENT_BUS)
  const messages: { name: string; data: unknown }[] = []

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field === "comments") {
        const value = change.value as IgCommentValue
        if (!value?.id || !value?.from?.id) continue
        messages.push({
          name: IG_COMMENT_RECEIVED,
          data: {
            ig_comment_id: value.id,
            ig_post_id: value.media?.id ?? entry.id,
            ig_user_id: value.from.id,
            ig_username: value.from.username ?? null,
            text: value.text ?? "",
          },
        })
      }
    }
    for (const m of entry.messaging ?? []) {
      if (!m?.sender?.id) continue
      messages.push({
        name: IG_MESSAGE_RECEIVED,
        data: {
          ig_user_id: m.sender.id,
          text: m.message?.text ?? "",
          message_id: m.message?.mid ?? null,
        },
      })
    }
  }

  if (messages.length > 0) {
    await eventBus.emit(messages)
  }

  res.status(200).json({ ok: true, emitted: messages.length })
}
