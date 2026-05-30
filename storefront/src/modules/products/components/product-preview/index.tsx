import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

// NOTE: not `async` — this component is also rendered inside the client
// <RelatedProductsCarousel>. An async component returns a promise, and rendering
// a promise as a child of a Client Component creates an uncached promise that
// React re-suspends on every render → infinite re-render loop + console flood.
export default function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  let cheapestPrice = null
  try {
    cheapestPrice = getProductPrice({ product }).cheapestPrice
  } catch {
    // Price calculation failed - render without price
  }

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex flex-col small:flex-row small:justify-between txt-compact-medium mt-4 gap-1">
          <Text className="font-heading text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
