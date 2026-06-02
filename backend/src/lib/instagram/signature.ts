import { createHmac, timingSafeEqual } from "crypto"

const PREFIX = "sha256="

export const verifySignature = (
  rawBody: Buffer | string,
  signatureHeader: string | undefined,
  appSecret: string
): boolean => {
  if (!signatureHeader || !appSecret) return false
  if (!signatureHeader.startsWith(PREFIX)) return false

  const providedHex = signatureHeader.slice(PREFIX.length)
  const body =
    typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : rawBody
  const expectedHex = createHmac("sha256", appSecret).update(body).digest("hex")

  try {
    const a = Buffer.from(providedHex, "hex")
    const b = Buffer.from(expectedHex, "hex")
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

const base64UrlToBuffer = (input: string): Buffer =>
  Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64")

/**
 * Verifies and decodes a Meta `signed_request` (used by the Data Deletion and
 * Deauthorize callbacks). Format: `base64url(HMAC-SHA256(payload)).base64url(payload)`,
 * keyed by the app secret. Returns the decoded payload (with `user_id`) or null
 * if the signature is missing/invalid.
 */
export const parseSignedRequest = (
  signedRequest: string | undefined,
  appSecret: string
): Record<string, unknown> | null => {
  if (!signedRequest || !appSecret) return null
  const [encodedSig, encodedPayload] = signedRequest.split(".")
  if (!encodedSig || !encodedPayload) return null

  const expected = createHmac("sha256", appSecret)
    .update(encodedPayload)
    .digest()
  let provided: Buffer
  try {
    provided = base64UrlToBuffer(encodedSig)
  } catch {
    return null
  }
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return null
  }

  try {
    return JSON.parse(base64UrlToBuffer(encodedPayload).toString("utf8"))
  } catch {
    return null
  }
}
