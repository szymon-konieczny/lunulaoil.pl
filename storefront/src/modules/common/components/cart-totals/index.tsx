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
    currency_code: string
    item_total?: number | null
    item_subtotal?: number | null
    shipping_total?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const mode = usePriceMode()
  const {
    currency_code,
    total,
    tax_total,
    item_total,
    item_subtotal,
    shipping_total,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  // B2C (gross): subtotals shown incl. VAT to match the line items and the law.
  // B2B (net): subtotals shown excl. VAT, with VAT listed separately.
  const itemsAmount =
    mode === "net" ? item_subtotal ?? 0 : item_total ?? item_subtotal ?? 0
  const shippingAmount =
    mode === "net"
      ? shipping_subtotal ?? 0
      : shipping_total ?? shipping_subtotal ?? 0

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
          <span data-testid="cart-shipping" data-value={shippingAmount}>
            {convertToLocale({ amount: shippingAmount, currency_code })}
          </span>
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
        {!!tax_total && (
          <div className="flex justify-between">
            <span className="flex gap-x-1 items-center ">{taxLabel(mode)}</span>
            <span data-testid="cart-taxes" data-value={tax_total}>
              {convertToLocale({ amount: tax_total, currency_code })}
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
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      <div className="h-px w-full border-b border-brand-border mt-4" />
      <p className="text-xs text-ui-fg-muted mt-3">{priceNoteFooter(mode)}</p>
    </div>
  )
}

export default CartTotals
