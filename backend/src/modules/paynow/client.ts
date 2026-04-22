import crypto from "node:crypto"
import { calculateRequestSignature } from "./signature"
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  CreateRefundRequest,
  CreateRefundResponse,
  PaymentStatusResponse,
  PaynowModuleOptions,
} from "./types"

const SANDBOX_BASE = "https://api.sandbox.paynow.pl"
const PRODUCTION_BASE = "https://api.paynow.pl"

export class PaynowApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body: string
  ) {
    super(message)
    this.name = "PaynowApiError"
  }
}

export class PaynowClient {
  private readonly apiKey: string
  private readonly signatureKey: string
  private readonly baseUrl: string

  constructor(options: PaynowModuleOptions) {
    this.apiKey = options.apiKey
    this.signatureKey = options.signatureKey
    this.baseUrl = options.sandbox ? SANDBOX_BASE : PRODUCTION_BASE
  }

  async createPayment(
    data: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> {
    return this.request<CreatePaymentResponse>("POST", "/v1/payments", data)
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    return this.request<PaymentStatusResponse>(
      "GET",
      `/v1/payments/${encodeURIComponent(paymentId)}/status`
    )
  }

  async createRefund(
    data: CreateRefundRequest
  ): Promise<CreateRefundResponse> {
    const { paymentId, amount, reason } = data
    return this.request<CreateRefundResponse>(
      "POST",
      `/v1/payments/${encodeURIComponent(paymentId)}/refunds`,
      { amount, reason: reason ?? "Refund" }
    )
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    body?: Record<string, unknown>
  ): Promise<T> {
    const idempotencyKey = crypto.randomUUID()
    const bodyString = body ? JSON.stringify(body) : ""

    const signature = calculateRequestSignature({
      apiKey: this.apiKey,
      signatureKey: this.signatureKey,
      idempotencyKey,
      body: bodyString,
      queryParams: {},
    })

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Api-Key": this.apiKey,
        "Idempotency-Key": idempotencyKey,
        "Signature": signature,
        "Api-Version": "3",
      },
      body: body ? bodyString : undefined,
    })

    const text = await response.text()

    if (!response.ok) {
      throw new PaynowApiError(
        `PayNow API ${method} ${path} failed (${response.status})`,
        response.status,
        text
      )
    }

    return text ? (JSON.parse(text) as T) : ({} as T)
  }
}
