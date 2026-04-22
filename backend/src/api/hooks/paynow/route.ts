import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type { IPaymentModuleService, Logger } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

// The payment module resolves the provider via `pp_${provider}`.
// Our registered key is `pp_paynow_paynow` (identifier="paynow" + id="paynow"),
// so we pass "paynow_paynow" here.
const PROVIDER_NAME = "paynow_paynow"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve<Logger>(ContainerRegistrationKeys.LOGGER)

  try {
    const paymentModule = req.scope.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const rawBody =
      typeof req.rawBody === "string"
        ? req.rawBody
        : Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString("utf8")
        : JSON.stringify(req.body)

    await paymentModule.getWebhookActionAndData({
      provider: PROVIDER_NAME,
      payload: {
        data: req.body as Record<string, unknown>,
        rawData: rawBody,
        headers: req.headers as Record<string, unknown>,
      },
    })
  } catch (err) {
    logger.error(
      `PayNow webhook processing failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    )
  }

  // Always ack with 200 — PayNow retries up to 15x over 48h otherwise.
  res.status(200).send()
}
