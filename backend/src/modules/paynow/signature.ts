import crypto from "node:crypto"

export function calculateRequestSignature(params: {
  apiKey: string
  signatureKey: string
  idempotencyKey: string
  body: string
  queryParams?: Record<string, string>
}): string {
  const payload = JSON.stringify({
    headers: {
      "Api-Key": params.apiKey,
      "Idempotency-Key": params.idempotencyKey,
    },
    parameters: params.queryParams ?? {},
    body: params.body,
  })

  return crypto
    .createHmac("sha256", params.signatureKey)
    .update(payload)
    .digest("base64")
}

export function verifyWebhookSignature(params: {
  rawBody: string
  signatureHeader: string
  signatureKey: string
}): boolean {
  const expected = crypto
    .createHmac("sha256", params.signatureKey)
    .update(params.rawBody)
    .digest("base64")

  const expectedBuf = Buffer.from(expected)
  const receivedBuf = Buffer.from(params.signatureHeader)

  if (expectedBuf.length !== receivedBuf.length) {
    return false
  }
  return crypto.timingSafeEqual(expectedBuf, receivedBuf)
}
