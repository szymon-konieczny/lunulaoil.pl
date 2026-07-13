import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { aggregateCommissions } from "../../../lib/commissions/aggregate"

const parseDate = (value: unknown, fallback: Date): Date => {
  if (typeof value === "string" && value) {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return fallback
}

/**
 * GET /admin/commissions?from=YYYY-MM-DD&to=YYYY-MM-DD&only_paid=true
 *
 * Raw per-promo-code sales aggregates for distributor-commission settlement.
 * The commission rate and basis are applied client-side (see the admin page),
 * so this endpoint only returns real, answer-independent sales figures.
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const now = new Date()
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  )

  const from = parseDate(req.query.from, monthStart)
  const to = parseDate(req.query.to, now)
  // Make the `to` bound inclusive of the whole selected day.
  to.setUTCHours(23, 59, 59, 999)

  const onlyPaid =
    req.query.only_paid === "true" || req.query.onlyPaid === "true"

  const report = await aggregateCommissions(query, { from, to, onlyPaid })

  res.json(report)
}
