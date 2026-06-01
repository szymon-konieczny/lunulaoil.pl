"use client"

import { convertToLocale } from "@lib/util/money"
import { usePriceMode } from "@lib/context/price-mode-context"
import {
  priceNoteFooter,
  shippingLabel,
  subtotalLabel,
  taxLabel,
  totalLabel,
} from "@lib/util/price-display"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    item_tax_total?: number | null
    currency_code: string
    item_total?: number | null
    item_subtotal?: number | null
    original_item_total?: number | null
    original_item_subtotal?: number | null
    shipping_total?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
  /**
   * "cart" (pre-checkout): shipping is chosen at checkout, so it is not charged
   * here — the row reads "obliczana w kasie" and the total covers items only.
   * "checkout" (default): shows the real selected shipping and grand total.
   */
  variant?: "cart" | "checkout"
}

const CartTotals: React.FC<CartTotalsProps> = ({
  totals,
  variant = "checkout",
}) => {
  const mode = usePriceMode()
  const {
    currency_code,
    total,
    tax_total,
    item_tax_total,
    item_total,
    item_subtotal,
    original_item_total,
    original_item_subtotal,
    shipping_total,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  const isCart = variant === "cart"

  // B2C (gross): subtotals shown incl. VAT to match the line items and the law.
  // B2B (net): subtotals shown excl. VAT, with VAT listed separately.
  // Use the pre-discount (original_*) amount so that, with a promo applied,
  // "subtotal − Rabat = total" reads correctly; the Rabat row subtracts the
  // discount below. Falls back to the post-discount field when unavailable.
  const itemsAmount =
    mode === "net"
      ? original_item_subtotal ?? item_subtotal ?? 0
      : original_item_total ?? item_total ?? item_subtotal ?? 0
  const shippingAmount =
    mode === "net"
      ? shipping_subtotal ?? 0
      : shipping_total ?? shipping_subtotal ?? 0
  // On the cart page exclude shipping entirely: tax of items only, and a grand
  // total that covers merchandise (gross) without any shipping method.
  const taxAmount = isCart ? item_tax_total ?? 0 : tax_total ?? 0
  const totalAmount = isCart ? item_total ?? 0 : total ?? 0

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-ui-fg-subtle ">
        <div className="flex items-center justify-between">
          <span>{subtotalLabel(mode)}</span>
          <span data-testid="cart-subtotal" data-value={itemsAmount}>
            {convertToLocale({ amount: itemsAmount, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>{shippingLabel(mode)}</span>
          {isCart ? (
            <span className="text-ui-fg-muted" data-testid="cart-shipping">
              Obliczana w kasie
            </span>
          ) : (
            <span data-testid="cart-shipping" data-value={shippingAmount}>
              {convertToLocale({ amount: shippingAmount, currency_code })}
            </span>
          )}
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span>Rabat</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        {!!taxAmount && (
          <div className="flex justify-between">
            <span className="flex gap-x-1 items-center ">{taxLabel(mode)}</span>
            <span data-testid="cart-taxes" data-value={taxAmount}>
              {convertToLocale({ amount: taxAmount, currency_code })}
            </span>
          </div>
        )}
      </div>
      <div className="h-px w-full border-b border-brand-border my-4" />
      <div className="flex items-center justify-between text-ui-fg-base mb-2 txt-medium ">
        <span>{totalLabel(mode)}</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={totalAmount}
        >
          {convertToLocale({ amount: totalAmount, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-brand-border mt-4" />
      <p className="text-xs text-ui-fg-muted mt-3">{priceNoteFooter(mode)}</p>
    </div>
  )
}

export default CartTotals
