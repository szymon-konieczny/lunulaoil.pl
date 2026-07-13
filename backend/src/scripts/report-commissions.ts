import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  aggregateCommissions,
  type CommissionBasis,
} from "../lib/commissions/aggregate"

/**
 * Distributor-commission report for the terminal.
 *
 * Usage:
 *   npx medusa exec ./src/scripts/report-commissions.ts [from] [to] [rate] [basis]
 *
 *   from   YYYY-MM-DD  (default: first day of current month)
 *   to     YYYY-MM-DD  (default: today)
 *   rate   commission % (default: 10)
 *   basis  net | gross | discount | total (default: net = obrót po rabacie)
 *
 * Example: npx medusa exec ./src/scripts/report-commissions.ts 2026-07-01 2026-07-31 12 net
 */
const BASES: Record<CommissionBasis, string> = {
  net: "obrót po rabacie (produkty)",
  gross: "obrót przed rabatem (produkty)",
  discount: "kwota rabatu",
  total: "wartość zamówień (z wysyłką/VAT)",
}

export default async function reportCommissions({ container, args }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const now = new Date()
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  )
  const from = args?.[0] ? new Date(args[0]) : monthStart
  const to = args?.[1] ? new Date(args[1]) : now
  to.setUTCHours(23, 59, 59, 999)
  const rate = args?.[2] ? Number(args[2]) : 10
  const basis = ((args?.[3] as CommissionBasis) || "net") as CommissionBasis

  const report = await aggregateCommissions(query, { from, to })
  const cur = report.currency
  const money = (n: number) => `${n.toFixed(2)} ${cur}`

  logger.info(
    `Prowizje dystrybutorów | ${report.from.slice(0, 10)} .. ${report.to.slice(0, 10)}`
  )
  logger.info(
    `Podstawa: ${BASES[basis] ?? basis} | stawka: ${rate}% | zamówień w okresie: ${report.ordersScanned} (z kodem: ${report.ordersWithCode})${report.capped ? " | UWAGA: przekroczono limit, wyniki częściowe" : ""}`
  )

  if (!report.rows.length) {
    logger.info("Brak zamówień z kodami promocyjnymi w wybranym okresie.")
    return
  }

  let totCommission = 0
  for (const r of report.rows) {
    const base = r[basis]
    const commission = (base * rate) / 100
    totCommission += commission
    logger.info(
      `  ${r.code.padEnd(14)} | zamówień: ${String(r.orders).padStart(4)} (opłac. ${r.paidOrders}) | ` +
        `po rabacie: ${money(r.net).padStart(14)} | przed: ${money(r.gross).padStart(14)} | ` +
        `rabat: ${money(r.discount).padStart(12)} | PROWIZJA: ${money(commission)}`
    )
  }
  logger.info(`RAZEM prowizja do wypłaty: ${money(totCommission)}`)
}
