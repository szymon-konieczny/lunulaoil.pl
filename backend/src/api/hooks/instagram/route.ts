import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "node:crypto"

import { handleInstagramEvent } from "./handlers"
import type { InstagramWebhookPayload } from "./types"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  const expected = process.env.IG_WEBHOOK_VERIFY_TOKEN

  if (!expected) {
    res.status(500).send("IG_WEBHOOK_VERIFY_TOKEN is not configured")
    return
  }

  if (mode === "subscribe" && token === expected && typeof challenge === "string") {
    res.status(200).send(challenge)
    return
  }

  res.sendStatus(403)
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const appSecret = process.env.META_APP_SECRET
  if (!appSecret) {
    req.scope.resolve("logger").error("META_APP_SECRET is not configured")
    res.sendStatus(500)
    return
  }

  const rawBody = (req as MedusaRequest & { rawBody?: Buffer | string }).rawBody
  if (!rawBody) {
    req.scope.resolve("logger").error(
      "Instagram webhook: rawBody missing — check middlewares.ts preserveRawBody config"
    )
    res.sendStatus(500)
    return
  }

  const signatureHeader = req.header("x-hub-signature-256") ?? ""
  if (!verifySignature(rawBody, signatureHeader, appSecret)) {
    res.sendStatus(403)
    return
  }

  res.sendStatus(200)

  const payload = req.body as InstagramWebhookPayload
  try {
    await handleInstagramEvent(payload, req.scope)
  } catch (err) {
    req.scope.resolve("logger").error("Instagram webhook handler failed", err as Error)
  }
}

function verifySignature(rawBody: Buffer | string, header: string, appSecret: string): boolean {
  if (!header.startsWith("sha256=")) return false
  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex")
  const received = header.slice("sha256=".length)

  const expectedBuf = Buffer.from(expected, "hex")
  const receivedBuf = Buffer.from(received, "hex")
  if (expectedBuf.length !== receivedBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}
