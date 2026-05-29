"use client"

import FastDelivery from "@modules/common/icons/fast-delivery"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const isWorkshopProduct = (product: HttpTypes.StoreProduct) =>
  product.categories?.some(
    (c) => c.handle === "warsztaty" || /warsztat/i.test(c.name ?? "")
  ) ?? false

// Compute the product-info fields once so both the tab visibility check and the
// rendered tab use the exact same data.
const getProductInfo = (product: HttpTypes.StoreProduct) => {
  // Extract INCI from description (pattern: "INCI: ...")
  const description = product.description || ""
  const inciMatch = description.match(/INCI:\s*(.+?)(?:\.|Pojemność|$)/i)
  const inci = inciMatch?.[1]?.trim() || (product.metadata?.inci as string) || null

  // Extract volume/capacity from description
  const volumeMatch = description.match(/Pojemność:\s*(.+?)\.?$/i)
  const volume = volumeMatch?.[1]?.trim() || null

  const fields: { label: string; value: string | null | undefined }[] = [
    { label: "Pojemność", value: volume },
    // Treat weight of 0 (or unset) as "no data" — "0 g" is not meaningful info.
    { label: "Waga", value: Number(product.weight) > 0 ? `${product.weight} g` : null },
    { label: "Typ", value: product.type?.value },
    { label: "Materiał", value: product.material },
    { label: "Kraj pochodzenia", value: product.origin_country },
    {
      label: "Wymiary",
      value:
        product.length && product.width && product.height
          ? `${product.length}L x ${product.width}W x ${product.height}H`
          : null,
    },
  ]

  const visibleFields = fields.filter((f) => f.value)

  return { visibleFields, inci, hasContent: visibleFields.length > 0 || !!inci }
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const isWorkshop = isWorkshopProduct(product)
  // Hide "Informacje o produkcie" when there's nothing meaningful to show, and
  // always hide it for warsztaty. Warsztaty also have no physical shipping.
  const showInfoTab = !isWorkshop && getProductInfo(product).hasContent

  const tabs = [
    ...(showInfoTab
      ? [
          {
            label: "Informacje o produkcie",
            component: <ProductInfoTab product={product} />,
          },
        ]
      : []),
    ...(isWorkshop
      ? []
      : [
          {
            label: "Wysyłka i zwroty",
            component: <ShippingInfoTab />,
          },
        ]),
  ]

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const { visibleFields, inci } = getProductInfo(product)

  return (
    <div className="text-small-regular py-8">
      {visibleFields.length > 0 && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {visibleFields.map((field) => (
            <div key={field.label}>
              <span className="font-semibold">{field.label}</span>
              <p>{field.value}</p>
            </div>
          ))}
        </div>
      )}
      {inci && (
        <div className={visibleFields.length > 0 ? "mt-6 pt-6 border-t border-ui-border-base" : ""}>
          <span className="font-semibold">Skład (INCI)</span>
          <p className="mt-1 text-ui-fg-subtle">{inci}</p>
        </div>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Szybka dostawa</span>
            <p className="max-w-sm">
              Twoja paczka dotrze w ciągu 2-4 dni roboczych do punktu odbioru
              lub pod wskazany adres.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
