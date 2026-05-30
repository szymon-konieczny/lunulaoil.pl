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
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const mode = usePriceMode()

  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  // B2C (gross): subtotal incl. VAT; B2B (net): subtotal excl. VAT.
  const itemsAmount =
    mode === "net"
      ? order.item_subtotal ?? order.subtotal
      : order.item_total ?? order.subtotal
  const shippingAmount =
    mode === "net"
      ? order.shipping_subtotal ?? order.shipping_total
      : order.shipping_total

  return (
    <div>
      <h2 className="text-base-semi">Podsumowanie zamówienia</h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>{subtotalLabel(mode)}</span>
          <span>{getAmount(itemsAmount)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Rabat</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>Rabat</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>{shippingLabel(mode)}</span>
            <span>{getAmount(shippingAmount)}</span>
          </div>
          {order.tax_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{taxLabel(mode)}</span>
              <span>{getAmount(order.tax_total)}</span>
            </div>
          )}
        </div>
        <div className="h-px w-full border-b border-brand-border border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>{totalLabel(mode)}</span>
          <span>{getAmount(order.total)}</span>
        </div>
        <p className="text-xs text-ui-fg-muted mt-1">{priceNoteFooter(mode)}</p>
      </div>
    </div>
  )
}

export default OrderSummary
