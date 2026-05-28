import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { PaynowClient } from "../../../../modules/paynow/lib/client"

const PROVIDER_ID = "pp_paynow_paynow"

/**
 * GET /store/paynow/status?cart_id=<id>
 *
 * Returns the current Paynow status of the cart's Paynow payment, so the
 * storefront can poll while a BLIK confirmation is pending or after a redirect.
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const apiKey = process.env.PAYNOW_API_KEY
  const signatureKey = process.env.PAYNOW_SIGNATURE_KEY

  if (!apiKey || !signatureKey) {
    res.status(500).json({ error: "Paynow is not configured." })
    return
  }

  const cartId = req.query.cart_id as string
  if (!cartId) {
    res.status(400).json({ error: "`cart_id` query param is required." })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: carts } = await query.graph({
    entity: "cart",
    fields: [
      "id",
      "payment_collection.payment_sessions.provider_id",
      "payment_collection.payment_sessions.data",
    ],
    filters: { id: cartId },
  })

  const cart = carts?.[0]
  const session = cart?.payment_collection?.payment_sessions?.find(
    (s) => s?.provider_id === PROVIDER_ID
  )
  const paymentId = (session?.data?.paymentId as string) || null

  if (!paymentId) {
    res.json({ status: "NEW", paymentId: null })
    return
  }

  const client = new PaynowClient({
    apiKey,
    signatureKey,
    apiUrl: process.env.PAYNOW_API_URL,
  })

  try {
    const { status } = await client.getPaymentStatus(paymentId)
    res.json({ status, paymentId })
  } catch (e) {
    res
      .status(502)
      .json({ error: `Paynow status error: ${(e as Error).message}` })
  }
}
