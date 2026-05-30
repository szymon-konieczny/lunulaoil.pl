"use client"

import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"
import { usePriceMode } from "@lib/context/price-mode-context"
import { formatDisplayPrice } from "@lib/util/price-display"

export default function PreviewPrice({ price }: { price: VariantPrice }) {
  const mode = usePriceMode()

  if (!price) {
    return null
  }

  const calculated = formatDisplayPrice(
    price.calculated_price_number,
    price.currency_code,
    mode
  )
  const original = formatDisplayPrice(
    price.original_price_number,
    price.currency_code,
    mode
  )

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {original}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {calculated}
        {mode === "net" && <span className="text-xs"> netto</span>}
      </Text>
    </>
  )
}
