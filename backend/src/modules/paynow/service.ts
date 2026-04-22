import {
  AbstractPaymentProvider,
  BigNumber,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import type {
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
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

import { PaynowClient } from "./client"
import { verifyWebhookSignature } from "./signature"
import type {
  PaynowModuleOptions,
  PaynowStatus,
  WebhookNotification,
} from "./types"

type InjectedDependencies = {
  logger: Logger
}

class PaynowProviderService extends AbstractPaymentProvider<PaynowModuleOptions> {
  static identifier = "paynow"

  protected logger_: Logger
  protected options_: PaynowModuleOptions
  protected client_: PaynowClient

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.apiKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayNow: apiKey is required"
      )
    }
    if (!options.signatureKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayNow: signatureKey is required"
      )
    }
  }

  constructor(
    container: InjectedDependencies,
    options: PaynowModuleOptions
  ) {
    super(container, options)
    this.logger_ = container.logger
    this.options_ = options
    this.client_ = new PaynowClient(options)
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, data, context } = input

    if (currency_code?.toLowerCase() !== "pln") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PayNow only supports PLN; got ${currency_code}`
      )
    }

    const sessionId = (data?.session_id as string) ?? ""
    const customer = context?.customer
    if (!customer?.email) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayNow requires a customer email on the payment context"
      )
    }

    // Medusa BigNumberInput -> plain number (grosze for PLN = minor units, no conversion)
    const amountNumber =
      typeof amount === "number"
        ? Math.round(amount)
        : Math.round(new BigNumber(amount).numeric)

    const description =
      ((data?.description as string) || `Order ${sessionId || "new"}`).slice(
        0,
        255
      )

    const response = await this.client_.createPayment({
      amount: amountNumber,
      currency: "PLN",
      externalId: sessionId,
      description,
      buyer: {
        email: customer.email,
        firstName: customer.first_name ?? undefined,
        lastName: customer.last_name ?? undefined,
        phone: customer.phone ?? undefined,
      },
      continueUrl: this.options_.continueUrl,
    })

    return {
      id: response.paymentId,
      data: {
        paymentId: response.paymentId,
        redirectUrl: response.redirectUrl,
        status: response.status,
        session_id: sessionId,
      },
      status: mapToSessionStatus(response.status),
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const paymentId = input.data?.paymentId as string | undefined
    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayNow: missing paymentId in payment data"
      )
    }
    const statusResp = await this.client_.getPaymentStatus(paymentId)
    return {
      data: { ...input.data, status: statusResp.status },
      status: mapToSessionStatus(statusResp.status),
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const paymentId = input.data?.paymentId as string | undefined
    if (!paymentId) {
      return { status: PaymentSessionStatus.PENDING }
    }
    const statusResp = await this.client_.getPaymentStatus(paymentId)
    return {
      data: { ...input.data, status: statusResp.status },
      status: mapToSessionStatus(statusResp.status),
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // PayNow auto-captures on CONFIRMED — nothing to do here.
    return { data: input.data ?? {} }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    // PayNow's API does not expose cancellation for most states.
    return { data: input.data ?? {} }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    const paymentId = input.data?.paymentId as string | undefined
    if (!paymentId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "PayNow: missing paymentId in payment data for refund"
      )
    }
    const amountNumber =
      typeof input.amount === "number"
        ? Math.round(input.amount)
        : Math.round(new BigNumber(input.amount).numeric)

    const refund = await this.client_.createRefund({
      paymentId,
      amount: amountNumber,
      reason: "Refund",
    })

    return {
      data: { ...input.data, lastRefund: refund },
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const paymentId = input.data?.paymentId as string | undefined
    if (!paymentId) {
      return { data: input.data ?? {} }
    }
    const statusResp = await this.client_.getPaymentStatus(paymentId)
    return { data: { ...input.data, ...statusResp } }
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    // PayNow payments are immutable once created. If the cart amount
    // has changed, Medusa should create a new session via initiatePayment.
    return { data: input.data ?? {} }
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const signatureHeader =
      (payload.headers?.["signature"] as string | undefined) ??
      (payload.headers?.["Signature"] as string | undefined)

    const rawData =
      typeof payload.rawData === "string"
        ? payload.rawData
        : Buffer.isBuffer(payload.rawData)
        ? payload.rawData.toString("utf8")
        : JSON.stringify(payload.data)

    if (
      !signatureHeader ||
      !verifyWebhookSignature({
        rawBody: rawData,
        signatureHeader,
        signatureKey: this.options_.signatureKey,
      })
    ) {
      this.logger_.warn("PayNow webhook signature verification failed")
      return {
        action: PaymentActions.NOT_SUPPORTED,
        data: { session_id: "", amount: new BigNumber(0) },
      }
    }

    const notification = payload.data as unknown as WebhookNotification
    const sessionId = notification.externalId

    switch (notification.status) {
      case "CONFIRMED":
        return {
          action: PaymentActions.SUCCESSFUL,
          data: { session_id: sessionId, amount: new BigNumber(0) },
        }
      case "NEW":
      case "PENDING":
        return {
          action: PaymentActions.PENDING,
          data: { session_id: sessionId, amount: new BigNumber(0) },
        }
      case "REJECTED":
      case "EXPIRED":
        return {
          action: PaymentActions.CANCELED,
          data: { session_id: sessionId, amount: new BigNumber(0) },
        }
      case "ERROR":
        return {
          action: PaymentActions.FAILED,
          data: { session_id: sessionId, amount: new BigNumber(0) },
        }
      default:
        return {
          action: PaymentActions.NOT_SUPPORTED,
          data: { session_id: sessionId, amount: new BigNumber(0) },
        }
    }
  }
}

function mapToSessionStatus(status: PaynowStatus): PaymentSessionStatus {
  switch (status) {
    case "CONFIRMED":
      return PaymentSessionStatus.CAPTURED
    case "NEW":
    case "PENDING":
      return PaymentSessionStatus.PENDING
    case "REJECTED":
    case "EXPIRED":
      return PaymentSessionStatus.CANCELED
    case "ERROR":
      return PaymentSessionStatus.ERROR
    default:
      return PaymentSessionStatus.PENDING
  }
}

export default PaynowProviderService
