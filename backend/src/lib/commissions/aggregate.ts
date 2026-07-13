/**
 * Distributor-commission aggregation.
 *
 * Groups placed orders by the promo code(s) they used and returns the raw
 * money aggregates per code. It deliberately does NOT compute the commission
 * amount: the commission rate and the value it applies to (basis) are business
 * decisions supplied at display time (see the admin page / CLI args), so the
 * aggregation stays answer-independent and always reflects real sales.
 *
 * Money fields come back from query.graph as BigNumber instances; they are
 * coerced with `num()` before any arithmetic (a raw `+=` on a BigNumber would
 * corrupt the sum). Amounts are in currency major units (PLN, not grosze).
 */

export type CommissionBasis = "net" | "gross" | "discount" | "total"

export type CommissionRow = {
  code: string
  /** placed (non-draft, non-canceled) orders that used this code */
  orders: number
  /** subset of `orders` whose payment was captured */
  paidOrders: number
  /** sum of item_total — products after discount, excl. shipping/VAT */
  net: number
  /** sum of original_item_total — products before discount */
  gross: number
  /** sum of this code's line-item adjustments — the discount it granted */
  discount: number
  /** sum of order total — incl. shipping and VAT */
  total: number
}

export type CommissionReport = {
  from: string
  to: string
  onlyPaid: boolean
  currency: string
  ordersScanned: number
  ordersWithCode: number
  /** true when the order count hit the hard cap and results are partial */
  capped: boolean
  rows: CommissionRow[]
}

type QueryLike = {
  graph: (config: {
    entity: string
    fields: string[]
    filters?: Record<string, unknown>
    pagination?: { take?: number; skip?: number }
  }) => Promise<{ data: any[]; metadata?: { count?: number } }>
}

const PAID_STATUSES = new Set(["captured", "partially_captured"])

const ORDER_FIELDS = [
  "id",
  "display_id",
  "created_at",
  "status",
  "payment_status",
  "currency_code",
  "total",
  "item_total",
  "original_item_total",
  "discount_total",
  "promotions.id",
  "promotions.code",
  "items.id",
  "items.adjustments.code",
  "items.adjustments.amount",
]

/** Coerce a BigNumber | number | string | null into a finite JS number. */
export const num = (v: unknown): number => {
  if (v == null) return 0
  if (typeof v === "number") return Number.isFinite(v) ? v : 0
  if (typeof v === "object") {
    const a = v as { numeric?: unknown; valueOf?: () => unknown }
    const raw = a.numeric ?? (typeof a.valueOf === "function" ? a.valueOf() : NaN)
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export async function aggregateCommissions(
  query: QueryLike,
  opts: { from: Date; to: Date; onlyPaid?: boolean; maxOrders?: number }
): Promise<CommissionReport> {
  const { from, to, onlyPaid = false, maxOrders = 20_000 } = opts

  const take = 200
  let skip = 0
  let ordersScanned = 0
  let ordersWithCode = 0
  let capped = false
  const rows = new Map<string, CommissionRow>()
  const currencies = new Map<string, number>()

  for (;;) {
    const { data, metadata } = await query.graph({
      entity: "order",
      fields: ORDER_FIELDS,
      filters: { created_at: { $gte: from, $lte: to } },
      pagination: { take, skip },
    })
    if (!data.length) break

    for (const o of data) {
      // Only placed orders count. Draft orders never reached the customer;
      // canceled orders are reversed sales.
      if (o.status === "draft" || o.status === "canceled") continue
      const paid = PAID_STATUSES.has(o.payment_status)
      if (onlyPaid && !paid) continue

      ordersScanned++
      if (o.currency_code) {
        currencies.set(o.currency_code, (currencies.get(o.currency_code) ?? 0) + 1)
      }

      const codes = new Set<string>()
      const discountByCode = new Map<string, number>()
      for (const item of o.items ?? []) {
        for (const adj of item.adjustments ?? []) {
          if (!adj.code) continue
          codes.add(adj.code)
          discountByCode.set(
            adj.code,
            (discountByCode.get(adj.code) ?? 0) + num(adj.amount)
          )
        }
      }
      // Fallback / cross-check via the order↔promotion link (covers promos that
      // only touched shipping, which leave no line-item adjustment).
      for (const p of o.promotions ?? []) {
        if (p?.code) codes.add(p.code)
      }

      if (!codes.size) continue
      ordersWithCode++

      const net = num(o.item_total)
      const gross = num(o.original_item_total)
      const total = num(o.total)

      // If two codes stack on one order the full order value is attributed to
      // each — an intentional over-count for the rare stacking case, since
      // distributor codes normally don't combine.
      for (const code of codes) {
        const r =
          rows.get(code) ??
          {
            code,
            orders: 0,
            paidOrders: 0,
            net: 0,
            gross: 0,
            discount: 0,
            total: 0,
          }
        r.orders++
        if (paid) r.paidOrders++
        r.net += net
        r.gross += gross
        r.total += total
        r.discount += discountByCode.get(code) ?? 0
        rows.set(code, r)
      }
    }

    skip += take
    if (skip >= maxOrders) {
      capped = true
      break
    }
    if (skip >= (metadata?.count ?? 0)) break
  }

  const currency =
    [...currencies.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]?.toUpperCase() ??
    "PLN"

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    onlyPaid,
    currency,
    ordersScanned,
    ordersWithCode,
    capped,
    rows: [...rows.values()].sort((a, b) => b.net - a.net),
  }
}
