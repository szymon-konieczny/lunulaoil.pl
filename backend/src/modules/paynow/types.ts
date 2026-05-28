/**
 * Options passed to the Paynow payment provider in medusa-config.ts.
 */
export type PaynowOptions = {
  /** Paynow Api-Key (per shop, from panel.paynow.pl). */
  apiKey: string
  /** Paynow Signature Key (per shop) used to sign requests / verify webhooks. */
  signatureKey: string
  /**
   * API base URL. Production: https://api.paynow.pl,
   * Sandbox: https://api.sandbox.paynow.pl. Defaults to production.
   */
  apiUrl?: string
  /**
   * Storefront base URL used to build the buyer return (continueUrl), e.g.
   * https://www.lunulaoil.pl. The payment id / cart id is appended by the client.
   */
  storefrontUrl?: string
}

/**
 * Lifecycle statuses of a Paynow payment.
 * - NEW: created, not yet paid
 * - PENDING: awaiting confirmation (e.g. BLIK confirmation in the bank app)
 * - CONFIRMED: paid successfully
 * - REJECTED: payment failed / declined
 * - ERROR: processing error
 * - EXPIRED: validity time elapsed without payment
 * - ABANDONED: buyer abandoned the payment
 */
export type PaynowPaymentStatus =
  | "NEW"
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "ERROR"
  | "EXPIRED"
  | "ABANDONED"

export type PaynowBuyerPhone = {
  prefix?: string
  number?: string
}

export type PaynowBuyer = {
  email: string
  firstName?: string
  lastName?: string
  /** Defaults to pl-PL on Paynow side. */
  locale?: string
  phone?: PaynowBuyerPhone
  externalId?: string
}

export type PaynowCreatePaymentRequest = {
  /** Amount in the smallest currency unit (grosze). 100 = 1,00 PLN. */
  amount: number
  /** PLN (default), EUR, USD, GBP. Foreign currencies are card-only. */
  currency?: string
  /** Merchant-unique id (<=100 chars). We use the Medusa payment session id. */
  externalId: string
  /** Payment description (<=255 chars). */
  description: string
  /** Where Paynow redirects the buyer after payment (<=1000 chars). */
  continueUrl?: string
  buyer: PaynowBuyer
  /** Optional: target a specific payment method (e.g. BLIK) instead of the hosted page. */
  paymentMethodId?: number
  /** Optional: 6-digit BLIK code for inline (CODE) authorization. */
  authorizationCode?: string
  /** Transaction timeout in seconds (60..864000). */
  validityTime?: number
}

export type PaynowCreatePaymentResponse = {
  paymentId: string
  status: PaynowPaymentStatus
  /** Present when the buyer must authorize on the Paynow site (REDIRECT methods). */
  redirectUrl?: string
}

export type PaynowPaymentStatusResponse = {
  paymentId: string
  status: PaynowPaymentStatus
}

export type PaynowAuthorizationType = "REDIRECT" | "CODE"

export type PaynowPaymentMethodType =
  | "APPLE_PAY"
  | "BLIK"
  | "CARD"
  | "ECOMMERCE"
  | "GOOGLE_PAY"
  | "PAYPO"
  | "PBL"

export type PaynowPaymentMethod = {
  id: number
  name: string
  description: string
  image: string
  status: "ENABLED" | "DISABLED"
  authorizationType: PaynowAuthorizationType
}

export type PaynowPaymentMethodGroup = {
  type: PaynowPaymentMethodType
  paymentMethods: PaynowPaymentMethod[]
}

/**
 * Body of an incoming Paynow notification (webhook).
 */
export type PaynowNotification = {
  paymentId: string
  externalId: string
  status: PaynowPaymentStatus
  modifiedAt: string
}
