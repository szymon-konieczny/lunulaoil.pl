"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export type PaynowMethod = {
  id: number
  name: string
  description: string
  image: string
  status: "ENABLED" | "DISABLED"
  authorizationType: "REDIRECT" | "CODE"
}

export type PaynowMethodGroup = {
  type: "APPLE_PAY" | "BLIK" | "CARD" | "ECOMMERCE" | "GOOGLE_PAY" | "PAYPO" | "PBL"
  paymentMethods: PaynowMethod[]
}

/** List Paynow payment methods for a cart amount (major units). */
export async function listPaynowMethods(
  amount: number,
  currency = "PLN"
): Promise<PaynowMethodGroup[]> {
  const headers = { ...(await getAuthHeaders()) }
  return sdk.client
    .fetch<{ groups: PaynowMethodGroup[] }>(`/store/paynow/payment-methods`, {
      method: "GET",
      query: { amount, currency },
      headers,
      cache: "no-store",
    })
    .then((r) => r.groups ?? [])
    .catch(() => [])
}

/** Create the Paynow payment for the cart's pending Paynow session. */
export async function chargePaynow(input: {
  cart_id: string
  blik_code?: string
  payment_method_id?: number
  continue_url?: string
}): Promise<{ paymentId: string; status: string; redirectUrl: string | null }> {
  const headers = { ...(await getAuthHeaders()) }
  return sdk.client.fetch(`/store/paynow/charge`, {
    method: "POST",
    body: input,
    headers,
  })
}

/** Current Paynow status for the cart's payment (for polling). */
export async function getPaynowStatus(
  cartId: string
): Promise<{ status: string; paymentId: string | null }> {
  const headers = { ...(await getAuthHeaders()) }
  return sdk.client.fetch(`/store/paynow/status`, {
    method: "GET",
    query: { cart_id: cartId },
    headers,
    cache: "no-store",
  })
}
