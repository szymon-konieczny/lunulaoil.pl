import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { PaynowClient } from "../../../../modules/paynow/lib/client"

/**
 * GET /store/paynow/payment-methods?amount=<major>&currency=PLN
 *
 * Lists Paynow payment methods (grouped by type) so the storefront can show the
 * available options — in particular the BLIK method id + its authorizationType.
 * `amount` is in MAJOR units (e.g. 19.99) and converted to grosze here.
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

  const amountMajor = Number(req.query.amount)
  if (!amountMajor || Number.isNaN(amountMajor)) {
    res.status(400).json({ error: "`amount` query param is required." })
    return
  }
  const currency = ((req.query.currency as string) || "PLN").toUpperCase()
  const amountGrosze = Math.round(amountMajor * 100)

  const client = new PaynowClient({
    apiKey,
    signatureKey,
    apiUrl: process.env.PAYNOW_API_URL,
  })

  try {
    const groups = await client.getPaymentMethods(amountGrosze, currency)
    res.json({ groups })
  } catch (e) {
    res
      .status(502)
      .json({ error: `Paynow payment methods error: ${(e as Error).message}` })
  }
}
