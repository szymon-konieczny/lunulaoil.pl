import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

const COMMISSION_RATE_KEY = "commission_rate"

/**
 * POST /admin/commissions/rate  { promotion_id, rate }
 *
 * Persists a per-distributor commission rate on the promotion's metadata
 * (rate is a percentage). Pass rate=null to clear it. Uses read-merge-write so
 * other metadata keys are preserved (the promotion module replaces the whole
 * metadata object on update).
 */
export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const body = (req.body ?? {}) as { promotion_id?: string; rate?: unknown }
  const promotionId = body.promotion_id

  if (!promotionId || typeof promotionId !== "string") {
    res.status(400).json({ message: "promotion_id is required" })
    return
  }

  let rate: number | null
  if (body.rate === null || body.rate === "" || body.rate === undefined) {
    rate = null
  } else {
    const n = Number(body.rate)
    if (!Number.isFinite(n) || n < 0 || n > 100_000) {
      res.status(400).json({ message: "rate must be a number >= 0 (or null)" })
      return
    }
    rate = n
  }

  const promotionModule = req.scope.resolve(Modules.PROMOTION)

  const existing = await promotionModule.retrievePromotion(promotionId, {
    select: ["id", "metadata"],
  })

  // `metadata` exists on the model but isn't typed on PromotionDTO.
  const currentMetadata =
    ((existing as { metadata?: Record<string, unknown> | null }).metadata) ?? {}
  const nextMetadata: Record<string, unknown> = { ...currentMetadata }
  if (rate === null) {
    delete nextMetadata[COMMISSION_RATE_KEY]
  } else {
    nextMetadata[COMMISSION_RATE_KEY] = rate
  }

  // `metadata` is a valid model field but omitted from UpdatePromotionDTO's
  // types; the module persists it at runtime (verified).
  await promotionModule.updatePromotions({
    id: promotionId,
    metadata: nextMetadata,
  } as Parameters<typeof promotionModule.updatePromotions>[0])

  res.json({ promotion_id: promotionId, rate })
}
