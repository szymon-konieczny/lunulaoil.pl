import { randomUUID } from "crypto"
import {
  AbstractPaymentProvider,
  BigNumber,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  Logger,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import { PaynowClient } from "./lib/client"
import { verifyWebhookSignature } from "./lib/signature"
import type {
  PaynowNotification,
  PaynowOptions,
  PaynowPaymentStatus,
} from "./types"

type InjectedDependencies = {
  logger: Logger
}

/**
 * Paynow.pl payment provider for Medusa v2.
 *
 * Flow (async, redirect/BLIK):
 *  1. `initiatePayment` creates a Medusa payment session placeholder. The actual
 *     Paynow payment is created later by the `/store/paynow/charge` route, which
 *     has the cart/buyer context (and the BLIK code for inline BLIK). That route
 *     stores `{ paymentId, redirectUrl, status }` in the session's `data`.
 *  2. The buyer pays — redirected to Paynow (REDIRECT methods) or confirming in
 *     the bank app (BLIK). Paynow's `externalId` is set to the Medusa session id.
 *  3. Completion happens either via the storefront return page (which polls status
 *     then calls placeOrder → `authorizePayment`) or via the Paynow notification
 *     webhook (`getWebhookActionAndData`) as a safety net for buyers who don't
 *     return. Both map Paynow `CONFIRMED` → captured and complete the order.
 */
class PaynowProviderService extends AbstractPaymentProvider<PaynowOptions> {
  static identifier = "paynow"

  protected readonly logger_: Logger
  protected readonly options_: PaynowOptions
  protected readonly client_: PaynowClient
  protected readonly container_: Record<string, unknown>

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.apiKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Paynow: `apiKey` option is required."
      )
    }
    if (!options.signatureKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Paynow: `signatureKey` option is required."
      )
    }
  }

  constructor(container: InjectedDependencies, options: PaynowOptions) {
    super(container as unknown as Record<string, unknown>, options)
    this.logger_ = container.logger
    this.options_ = options
    this.container_ = container as unknown as Record<string, unknown>
    this.client_ = new PaynowClient(options)
  }

  /** Convert a Medusa amount (major units, e.g. 19.99) to grosze (minor units). */
  private toMinorUnits(amount: unknown): number {
    return Math.round(new BigNumber(amount as never).numeric * 100)
  }

  /** Map a Paynow status to a Medusa payment-session status. */
  private mapStatus(status: PaynowPaymentStatus): PaymentSessionStatus {
    switch (status) {
      case "CONFIRMED":
        return "captured"
      case "NEW":
      case "PENDING":
        return "pending"
      case "REJECTED":
      case "ERROR":
      case "EXPIRED":
      case "ABANDONED":
      default:
        return "error"
    }
  }

  private getPaymentId(data?: Record<string, unknown>): string | undefined {
    return (data?.paymentId as string) || undefined
  }

  async initiatePayment(
    _input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    // The Paynow payment is created later by the /store/paynow/charge route once
    // the buyer commits (and provides a BLIK code, if applicable). Here we only
    // create the session placeholder.
    return {
      id: `paynow_${randomUUID()}`,
      status: "pending",
      data: {},
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const paymentId = this.getPaymentId(input.data)
    if (!paymentId) {
      // No Paynow payment created yet — still awaiting charge.
      return { status: "pending", data: input.data ?? {} }
    }

    const { status } = await this.client_.getPaymentStatus(paymentId)
    return {
      status: this.mapStatus(status),
      data: { ...(input.data ?? {}), paynowStatus: status },
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const paymentId = this.getPaymentId(input.data)
    if (!paymentId) {
      return { status: "pending", data: input.data ?? {} }
    }

    const { status } = await this.client_.getPaymentStatus(paymentId)
    return {
      status: this.mapStatus(status),
      data: { ...(input.data ?? {}), paynowStatus: status },
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // Paynow captures funds automatically when a payment reaches CONFIRMED, so
    // there's no separate capture call — just acknowledge.
    return { data: input.data ?? {} }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const paymentId = this.getPaymentId(input.data)
    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Paynow: cannot refund — missing paymentId in payment data."
      )
    }

    const refund = await this.client_.refund(
      paymentId,
      this.toMinorUnits(input.amount)
    )

    return {
      data: {
        ...(input.data ?? {}),
        lastRefundId: refund.refundId,
        lastRefundStatus: refund.status,
      },
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    // Paynow has no cancel endpoint for an unpaid payment (it expires on its own).
    return { data: input.data ?? {} }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // Nothing to update on Paynow's side before the payment is created.
    return { data: input.data ?? {} }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const paymentId = this.getPaymentId(input.data)
    if (!paymentId) {
      return { data: input.data ?? {} }
    }

    const { status } = await this.client_.getPaymentStatus(paymentId)
    return { data: { ...(input.data ?? {}), paynowStatus: status } }
  }

  /**
   * Resolve the session's amount (major units) for the webhook action. Best-effort
   * via the remote query; the storefront return-page flow is the primary completion
   * path, so a failure here only affects buyers who close the browser after paying.
   */
  private async resolveSessionAmount(sessionId: string): Promise<number> {
    try {
      const query = this.container_[ContainerRegistrationKeys.QUERY] as
        | { graph: (config: unknown) => Promise<{ data: { amount?: unknown }[] }> }
        | undefined
      if (query) {
        const { data } = await query.graph({
          entity: "payment_session",
          fields: ["amount"],
          filters: { id: sessionId },
        })
        const amount = data?.[0]?.amount
        if (amount != null) {
          return new BigNumber(amount as never).numeric
        }
      }
    } catch (e) {
      this.logger_.warn(
        `Paynow: could not resolve amount for session ${sessionId}: ${
          (e as Error).message
        }`
      )
    }
    return 0
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const signatureHeader = (payload.headers?.["signature"] ??
      payload.headers?.["Signature"]) as string | undefined

    const isValid = verifyWebhookSignature({
      signatureKey: this.options_.signatureKey,
      rawBody: payload.rawData,
      signatureHeader,
    })

    if (!isValid) {
      this.logger_.warn("Paynow: webhook signature verification failed — ignoring.")
      return { action: "not_supported" }
    }

    const notification = payload.data as unknown as PaynowNotification
    const sessionId = notification.externalId

    switch (notification.status) {
      case "CONFIRMED": {
        const amount = await this.resolveSessionAmount(sessionId)
        return {
          action: "captured",
          data: { session_id: sessionId, amount },
        }
      }
      case "NEW":
      case "PENDING":
        return {
          action: "pending",
          data: { session_id: sessionId, amount: 0 },
        }
      case "REJECTED":
      case "ERROR":
      case "EXPIRED":
      case "ABANDONED":
        return {
          action: "failed",
          data: { session_id: sessionId, amount: 0 },
        }
      default:
        return { action: "not_supported" }
    }
  }
}

export default PaynowProviderService
