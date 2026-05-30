import { convertToLocale } from "./money"

/**
 * How prices are presented to the current customer:
 * - "gross" — B2C: prices include VAT (legal requirement for consumers in PL/EU)
 * - "net"   — B2B (Salon group): prices shown without VAT, VAT listed separately
 */
export type PriceMode = "gross" | "net"

/**
 * VAT rate used ONLY to derive a net price for product/listing views, where the
 * backend exposes just the tax-inclusive (gross) amount and no tax breakdown.
 * All Lunula products are cosmetics taxed at 23% in PL, and B2B prices exist
 * only in PLN. In cart/checkout/order views we use Medusa's exact net + tax
 * fields instead, so this constant is not involved there.
 */
export const VAT_RATE = 0.23

export const toNet = (grossAmount: number): number =>
  Math.round(grossAmount / (1 + VAT_RATE))

/** Format a gross amount for display, converting to net when in B2B mode. */
export const formatDisplayPrice = (
  grossAmount: number,
  currency_code: string,
  mode: PriceMode
): string =>
  convertToLocale({
    amount: mode === "net" ? toNet(grossAmount) : grossAmount,
    currency_code,
  })

// ── Labels (cart/checkout/order summaries) ──

export const subtotalLabel = (mode: PriceMode): string =>
  mode === "net" ? "Suma częściowa (netto)" : "Suma częściowa (bez wysyłki)"

export const shippingLabel = (mode: PriceMode): string =>
  mode === "net" ? "Wysyłka (netto)" : "Wysyłka"

export const taxLabel = (mode: PriceMode): string =>
  mode === "net" ? `VAT (${Math.round(VAT_RATE * 100)}%)` : "w tym VAT"

export const totalLabel = (mode: PriceMode): string =>
  mode === "net" ? "Razem do zapłaty (brutto)" : "Suma"

export const priceNoteFooter = (mode: PriceMode): string =>
  mode === "net"
    ? "Ceny netto. Do zapłaty doliczany jest VAT."
    : "Ceny zawierają podatek VAT."
