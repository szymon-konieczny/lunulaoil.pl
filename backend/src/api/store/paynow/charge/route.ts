import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import {
  BigNumber,
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { PaynowClient } from "../../../../modules/paynow/lib/client"

const PROVIDER_ID = "pp_paynow_paynow"

type ChargeBody = {
  cart_id?: string
  /** 6-digit BLIK code for inline (CODE) authorization. */
  blik_code?: string
  /** Specific Paynow method id (e.g. the BLIK method). Optional for hosted page. */
  payment_method_id?: number
  /** Storefront URL Paynow redirects the buyer back to after payment. */
  continue_url?: string
}

/**
 * POST /store/paynow/charge
 *
 * Creates the Paynow payment for the cart's pending Paynow payment session.
 * Sets Paynow `externalId` to the Medusa payment session id (so the notification
 * webhook can map back), then stores `{ paymentId, redirectUrl, status }` on the
 * session. Returns the redirectUrl (REDIRECT methods) or the status (inline BLIK).
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const apiKey = process.env.PAYNOW_API_KEY
  const signatureKey = process.env.PAYNOW_SIGNATURE_KEY

  if (!apiKey || !signatureKey) {
    res.status(500).json({ error: "Paynow is not configured." })
    return
  }

  const { cart_id, blik_code, payment_method_id, continue_url } =
    (req.body ?? {}) as ChargeBody

  if (!cart_id) {
    res.status(400).json({ error: "`cart_id` is required." })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "email",
      "currency_code",
      "billing_address.first_name",
      "billing_address.last_name",
      "billing_address.phone",
      "payment_collection.payment_sessions.id",
      "payment_collection.payment_sessions.provider_id",
      "payment_collection.payment_sessions.status",
      "payment_collection.payment_sessions.amount",
      "payment_collection.payment_sessions.currency_code",
      "payment_collection.payment_sessions.data",
    ],
    filters: { id: cart_id },
  })

  const cart = carts?.[0]
  if (!cart) {
    res.status(404).json({ error: "Cart not found." })
    return
  }

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s?.provider_id === PROVIDER_ID
  )
  if (!session) {
    res
      .status(400)
      .json({ error: "Cart has no Paynow payment session. Initiate one first." })
    return
  }

  if (!cart.email) {
    res.status(400).json({ error: "Cart is missing a buyer email." })
    return
  }

  // Medusa stores amounts in minor units (grosze) in this instance — same unit
  // Paynow expects — so pass it through directly without multiplying by 100.
  const amountGrosze = Math.round(new BigNumber(session.amount).numeric)
  const currency = (session.currency_code || cart.currency_code || "pln").toUpperCase()

  const client = new PaynowClient({
    apiKey,
    signatureKey,
    apiUrl: process.env.PAYNOW_API_URL,
  })

  try {
    const payment = await client.createPayment({
      amount: amountGrosze,
      currency,
      externalId: session.id,
      description: `Lunula — zamówienie ${cart_id}`,
      continueUrl: continue_url,
      buyer: {
        email: cart.email,
        firstName: cart.billing_address?.first_name ?? undefined,
        lastName: cart.billing_address?.last_name ?? undefined,
      },
      paymentMethodId: payment_method_id,
      authorizationCode: blik_code,
    })

    const paymentModule = req.scope.resolve(Modules.PAYMENT)
    await paymentModule.updatePaymentSession({
      id: session.id,
      data: {
        ...(session.data ?? {}),
        paymentId: payment.paymentId,
        redirectUrl: payment.redirectUrl ?? null,
        paynowStatus: payment.status,
      },
      currency_code: session.currency_code,
      amount: session.amount,
    })

    res.json({
      paymentId: payment.paymentId,
      status: payment.status,
      redirectUrl: payment.redirectUrl ?? null,
    })
  } catch (e) {
    res
      .status(502)
      .json({ error: `Paynow charge error: ${(e as Error).message}` })
  }
}
