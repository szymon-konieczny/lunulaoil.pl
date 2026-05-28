import crypto from "crypto"

/**
 * Calculate the `Signature` header for an outgoing Paynow API request (v3).
 *
 * Paynow builds a JSON payload from the request's headers, query parameters and
 * body (in that exact order), serializes it COMPACTLY (no whitespace), then takes
 * the Base64 of HMAC-SHA256(payload, signatureKey).
 *
 *   payload = {"headers":{"Api-Key":<apiKey>,"Idempotency-Key":<idempotencyKey>},
 *              "parameters":<query params, alphabetical>,
 *              "body":<exact request body string, or "">}
 *
 * `body` MUST be the exact string sent as the request body (byte-for-byte), and
 * `parameters` the exact query params. Header keys are alphabetical (Api-Key,
 * Idempotency-Key); parameter keys are alphabetical too.
 *
 * Verified against the documented worked example:
 *   apiKey        = 97a55694-5478-43b5-b406-fb49ebfdd2b5
 *   idempotencyKey= d243fdb3-c287-484a-bb9c-58536f2794c1
 *   signatureKey  = b305b996-bca5-4404-a0b7-2ccea3d2b64b
 *   parameters={}  body=""
 *   => fXwLZRwo0WiGll90PPl5oULX9VKA0gpFA/3+E+NRp5E=
 */
export function calculateRequestSignature(params: {
  apiKey: string
  signatureKey: string
  idempotencyKey: string
  /** Exact request body string. Empty string for GET / no body. */
  body: string
  /** Query parameters (for GET). Will be alphabetically ordered. */
  parameters?: Record<string, string>
}): string {
  const { apiKey, signatureKey, idempotencyKey, body, parameters = {} } = params

  const orderedParameters = Object.keys(parameters)
    .sort()
    .reduce<Record<string, string>>((acc, key) => {
      acc[key] = parameters[key]
      return acc
    }, {})

  const payload = JSON.stringify({
    headers: {
      "Api-Key": apiKey,
      "Idempotency-Key": idempotencyKey,
    },
    parameters: orderedParameters,
    body,
  })

  return crypto
    .createHmac("sha256", signatureKey)
    .update(payload, "utf8")
    .digest("base64")
}

/**
 * Verify the `Signature` header of an incoming Paynow notification (webhook).
 *
 * Unlike outgoing requests, the notification signature is computed directly over
 * the RAW request body string: Base64(HMAC-SHA256(rawBody, signatureKey)).
 *
 * Returns false (never throws) on any mismatch so callers can reject with 401.
 */
export function verifyWebhookSignature(params: {
  signatureKey: string
  rawBody: string | Buffer
  signatureHeader: string | undefined
}): boolean {
  const { signatureKey, rawBody, signatureHeader } = params

  if (!signatureHeader) {
    return false
  }

  const computed = crypto
    .createHmac("sha256", signatureKey)
    .update(rawBody)
    .digest("base64")

  const expected = Buffer.from(computed)
  const received = Buffer.from(signatureHeader)

  if (expected.length !== received.length) {
    return false
  }

  return crypto.timingSafeEqual(expected, received)
}
