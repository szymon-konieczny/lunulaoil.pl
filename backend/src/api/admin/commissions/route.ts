import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  aggregateCommissions,
  buildReportRows,
  rateFromMetadata,
} from "../../../lib/commissions/aggregate"

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

  // Attach each code's stored commission rate, and surface every eligible promo
  // code (active, rate-configured, or seen in orders) so rates are assignable
  // even before the first sale.
  const salesCodes = new Set(report.rows.map((r) => r.code))
  const { data: promos } = await query.graph({
    entity: "promotion",
    fields: ["id", "code", "status", "metadata"],
    pagination: { take: 1000 },
  })
  const promotionRates = (promos as any[])
    .filter(
      (p) =>
        p.code &&
        (p.status === "active" ||
          rateFromMetadata(p.metadata) !== null ||
          salesCodes.has(p.code))
    )
    .map((p) => ({
      id: p.id,
      code: p.code,
      status: p.status,
      ratePct: rateFromMetadata(p.metadata),
    }))

  const rows = buildReportRows(report.rows, promotionRates)

  res.json({ ...report, rows })
}
