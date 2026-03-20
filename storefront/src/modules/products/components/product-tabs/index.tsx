"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Informacje o produkcie",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Wysyłka i zwroty",
      component: <ShippingInfoTab />,
    },
  ]

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
  const fields: { label: string; value: string | null | undefined }[] = [
    { label: "Materiał", value: product.material },
    { label: "Kraj pochodzenia", value: product.origin_country },
    { label: "Typ", value: product.type?.value },
    { label: "Waga", value: product.weight ? `${product.weight} g` : null },
    {
      label: "Wymiary",
      value:
        product.length && product.width && product.height
          ? `${product.length}L x ${product.width}W x ${product.height}H`
          : null,
    },
  ]

  const visibleFields = fields.filter((f) => f.value)

  if (visibleFields.length === 0) {
    return (
      <div className="text-small-regular py-8 text-ui-fg-subtle">
        Brak dodatkowych informacji.
      </div>
    )
  }

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {visibleFields.map((field) => (
          <div key={field.label}>
            <span className="font-semibold">{field.label}</span>
            <p>{field.value}</p>
          </div>
        ))}
      </div>
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
              Twoja paczka dotrze w ciągu 3-5 dni roboczych do punktu odbioru
              lub pod wskazany adres.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Prosta wymiana</span>
            <p className="max-w-sm">
              Produkt nie spełnia oczekiwań? Bez obaw — wymienimy go na
              nowy.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Łatwe zwroty</span>
            <p className="max-w-sm">
              Wystarczy zwrócić produkt, a my zwrócimy pieniądze. Bez zbędnych
              pytań — dołożymy wszelkich starań, aby zwrot był bezproblemowy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
