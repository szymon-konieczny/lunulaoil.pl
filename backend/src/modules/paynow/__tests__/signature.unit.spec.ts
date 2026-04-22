import crypto from "node:crypto"
import {
  calculateRequestSignature,
  verifyWebhookSignature,
} from "../signature"

describe("PayNow signature", () => {
  describe("calculateRequestSignature (V3)", () => {
    it("produces the documented JSON payload structure and HMAC matches manual calculation", () => {
      const apiKey = "97a55694-5478-43b5-b406-fb49ebfdd2b5"
      const signatureKey = "b305b996-bca5-4404-a0b7-2ccea3d2b64b"
      const idempotencyKey = "a7f6a3d3-dc13-41f5-8d01-7aaddfe17c65"
      const body = '{"amount":1000,"currency":"PLN"}'
      const queryParams = {}

      const expectedPayload = JSON.stringify({
        headers: {
          "Api-Key": apiKey,
          "Idempotency-Key": idempotencyKey,
        },
        parameters: queryParams,
        body,
      })
      const manualSignature = crypto
        .createHmac("sha256", signatureKey)
        .update(expectedPayload)
        .digest("base64")

      const actual = calculateRequestSignature({
        apiKey,
        signatureKey,
        idempotencyKey,
        body,
        queryParams,
      })

      expect(actual).toBe(manualSignature)
    })

    it("changes when the body changes", () => {
      const base = {
        apiKey: "api",
        signatureKey: "secret",
        idempotencyKey: "key",
        queryParams: {},
      }
      const a = calculateRequestSignature({ ...base, body: "" })
      const b = calculateRequestSignature({ ...base, body: '{"amount":100}' })
      expect(a).not.toBe(b)
    })

    it("changes when the idempotency key changes", () => {
      const base = {
        apiKey: "api",
        signatureKey: "secret",
        body: '{"x":1}',
        queryParams: {},
      }
      const a = calculateRequestSignature({ ...base, idempotencyKey: "k1" })
      const b = calculateRequestSignature({ ...base, idempotencyKey: "k2" })
      expect(a).not.toBe(b)
    })
  })

  describe("verifyWebhookSignature (V1)", () => {
    it("matches PayNow SDK's documented V1 vector", () => {
      // From PayNow paynow-php-sdk V1 signature calculator tests.
      const signatureKey = "a621a1fb-b4d8-48ba-a6a3-2a28ed61f605"
      const rawBody = '{"key1":"value1","key2":"value2"}'
      const documentedSignature = "rFAkhfbUFRn4bTR82qb742Mwy34g/CSi8frEHciZhCU="

      expect(
        verifyWebhookSignature({
          rawBody,
          signatureHeader: documentedSignature,
          signatureKey,
        })
      ).toBe(true)
    })

    it("rejects a tampered body", () => {
      const signatureKey = "secret"
      const rawBody = '{"paymentId":"A","status":"CONFIRMED"}'
      const valid = crypto
        .createHmac("sha256", signatureKey)
        .update(rawBody)
        .digest("base64")

      expect(
        verifyWebhookSignature({
          rawBody: rawBody.replace("CONFIRMED", "REJECTED"),
          signatureHeader: valid,
          signatureKey,
        })
      ).toBe(false)
    })

    it("rejects an unrelated signature", () => {
      expect(
        verifyWebhookSignature({
          rawBody: '{"x":1}',
          signatureHeader: "not-a-real-signature",
          signatureKey: "secret",
        })
      ).toBe(false)
    })
  })
})
