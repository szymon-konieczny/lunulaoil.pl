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
