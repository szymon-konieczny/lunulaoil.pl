import { createHmac } from "crypto"
import { verifySignature } from "../signature"

const secret = "test-secret"

const sign = (body: string): string =>
  "sha256=" + createHmac("sha256", secret).update(body).digest("hex")

describe("verifySignature", () => {
  it("accepts a correctly signed body", () => {
    const body = '{"hello":"world"}'
    expect(verifySignature(body, sign(body), secret)).toBe(true)
  })

  it("accepts a Buffer body equivalent to the string", () => {
    const body = '{"hello":"world"}'
    expect(verifySignature(Buffer.from(body, "utf8"), sign(body), secret)).toBe(
      true
    )
  })

  it("rejects a tampered body", () => {
    const goodSig = sign('{"hello":"world"}')
    expect(verifySignature('{"hello":"evil"}', goodSig, secret)).toBe(false)
  })

  it("rejects a missing header", () => {
    expect(verifySignature("body", undefined, secret)).toBe(false)
  })

  it("rejects an empty secret", () => {
    expect(verifySignature("body", sign("body"), "")).toBe(false)
  })

  it("rejects a wrong algorithm prefix", () => {
    const body = "body"
    const hex = createHmac("sha256", secret).update(body).digest("hex")
    expect(verifySignature(body, "sha1=" + hex, secret)).toBe(false)
  })

  it("rejects a malformed hex signature", () => {
    expect(verifySignature("body", "sha256=not-hex!!", secret)).toBe(false)
  })

  it("rejects a truncated signature", () => {
    const short = "sha256=" + "a".repeat(10)
    expect(verifySignature("body", short, secret)).toBe(false)
  })
})
