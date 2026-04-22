export type PaynowStatus =
  | "NEW"
  | "PENDING"
  | "CONFIRMED"
  | "ERROR"
  | "EXPIRED"
  | "REJECTED"

export type PaynowModuleOptions = {
  apiKey: string
  signatureKey: string
  sandbox?: boolean
  continueUrl?: string
}

export type CreatePaymentRequest = {
  amount: number
  currency: "PLN"
  externalId: string
  description: string
  buyer: {
    email: string
    firstName?: string
    lastName?: string
    phone?: string
  }
  continueUrl?: string
  paymentMethodId?: number
}

export type CreatePaymentResponse = {
  paymentId: string
  status: PaynowStatus
  redirectUrl: string
}

export type PaymentStatusResponse = {
  paymentId: string
  status: PaynowStatus
  modifiedAt?: string
}

export type CreateRefundRequest = {
  paymentId: string
  amount: number
  reason?: string
}

export type CreateRefundResponse = {
  refundId: string
  status: "NEW" | "SUCCESSFUL" | "FAILED" | "CANCELLED"
}

export type WebhookNotification = {
  paymentId: string
  externalId: string
  status: PaynowStatus
  modifiedAt: string
}
