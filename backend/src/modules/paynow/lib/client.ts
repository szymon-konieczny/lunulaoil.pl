import { randomUUID } from "crypto"
import { calculateRequestSignature } from "./signature"
import type {
  PaynowCreatePaymentRequest,
  PaynowCreatePaymentResponse,
  PaynowOptions,
  PaynowPaymentMethodGroup,
  PaynowPaymentStatusResponse,
} from "../types"

const DEFAULT_API_URL = "https://api.paynow.pl"

type RequestOptions = {
  method: "GET" | "POST"
  path: string
  body?: unknown
  /** Query parameters (GET). Used both for the URL and the signature. */
  parameters?: Record<string, string>
  /** Reuse a stable key to make create/refund retries idempotent. */
  idempotencyKey?: string
}

export type PaynowRefundResponse = {
  refundId: string
  status: string
}

/**
 * Thin HTTP client for the Paynow REST API (v3). Handles request signing,
 * idempotency keys and error surfacing. All amounts are in grosze (minor units).
 */
export class PaynowClient {
  private readonly apiKey: string
  private readonly signatureKey: string
  private readonly apiUrl: string

  constructor(options: PaynowOptions) {
    this.apiKey = options.apiKey
    this.signatureKey = options.signatureKey
    this.apiUrl = (options.apiUrl || DEFAULT_API_URL).replace(/\/+$/, "")
  }

  private async request<T>(opts: RequestOptions): Promise<T> {
    const { method, path, body, parameters, idempotencyKey } = opts
    const idem = idempotencyKey || randomUUID()
    // Serialize the body ONCE and reuse the exact string for both the signature
    // payload and the wire body, otherwise the signature won't match.
    const bodyString = body !== undefined ? JSON.stringify(body) : ""

    const signature = calculateRequestSignature({
      apiKey: this.apiKey,
      signatureKey: this.signatureKey,
      idempotencyKey: idem,
      body: bodyString,
      parameters,
    })

    let url = `${this.apiUrl}${path}`
    if (parameters && Object.keys(parameters).length) {
      url += `?${new URLSearchParams(parameters).toString()}`
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Api-Key": this.apiKey,
        Signature: signature,
        "Idempotency-Key": idem,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: method === "GET" ? undefined : bodyString,
    })

    const text = await response.text()

    if (!response.ok) {
      throw new Error(
        `Paynow API ${method} ${path} failed: ${response.status} ${response.statusText} — ${text}`
      )
    }

    return (text ? JSON.parse(text) : {}) as T
  }

  /** Create a payment. Pass authorizationCode + paymentMethodId for inline BLIK. */
  createPayment(
    payment: PaynowCreatePaymentRequest,
    idempotencyKey?: string
  ): Promise<PaynowCreatePaymentResponse> {
    return this.request<PaynowCreatePaymentResponse>({
      method: "POST",
      path: "/v3/payments",
      body: payment,
      idempotencyKey,
    })
  }

  /** List available payment methods (grouped by type) for a given amount/currency. */
  getPaymentMethods(
    amount: number,
    currency = "PLN"
  ): Promise<PaynowPaymentMethodGroup[]> {
    return this.request<PaynowPaymentMethodGroup[]>({
      method: "GET",
      path: "/v3/payments/paymentmethods",
      parameters: { amount: String(amount), currency },
    })
  }

  /** Current status of a payment. */
  getPaymentStatus(paymentId: string): Promise<PaynowPaymentStatusResponse> {
    return this.request<PaynowPaymentStatusResponse>({
      method: "GET",
      path: `/v3/payments/${paymentId}/status`,
    })
  }

  /** Refund a CONFIRMED payment (amount in grosze). */
  refund(
    paymentId: string,
    amount: number,
    idempotencyKey?: string
  ): Promise<PaynowRefundResponse> {
    return this.request<PaynowRefundResponse>({
      method: "POST",
      path: `/v3/payments/${paymentId}/refunds`,
      body: { amount },
      idempotencyKey,
    })
  }
}
