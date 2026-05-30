"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useEffect, useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qtyInput, setQtyInput] = useState(String(item.quantity))

  // Keep the input in sync when the cart updates the line item quantity.
  useEffect(() => {
    setQtyInput(String(item.quantity))
  }, [item.quantity])

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // Commit the typed quantity (on blur / Enter). No artificial cap so wholesale
  // customers can order any amount; the backend enforces real inventory limits.
  const commitQuantity = () => {
    const next = parseInt(qtyInput, 10)
    if (Number.isNaN(next) || next < 1) {
      setQtyInput(String(item.quantity))
      return
    }
    if (next !== item.quantity) {
      changeQuantity(next)
    }
  }

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="p-4 w-24">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="font-heading txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center">
            <DeleteButton id={item.id} data-testid="product-delete-button" />
            <div className="flex items-center border border-ui-border-base rounded-md">
              <button
                type="button"
                onClick={() =>
                  item.quantity > 1 && changeQuantity(item.quantity - 1)
                }
                disabled={updating || item.quantity <= 1}
                aria-label="Zmniejsz ilość"
                className="w-9 h-10 flex items-center justify-center text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={qtyInput}
                disabled={updating}
                onChange={(e) => setQtyInput(e.target.value)}
                onBlur={commitQuantity}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur()
                }}
                aria-label="Ilość"
                className="w-12 h-10 text-center bg-transparent text-ui-fg-base outline-none disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                data-testid="product-select-button"
              />
              <button
                type="button"
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={updating}
                aria-label="Zwiększ ilość"
                className="w-9 h-10 flex items-center justify-center text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                +
              </button>
            </div>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell>
        <span
          className={clx({
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
