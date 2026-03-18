import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { CategoryItem } from "@modules/store/components/refinement-list"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  categories,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categories?: CategoryItem[]
  q?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="py-6 content-container" data-testid="category-container">
      <div className="mb-6 text-2xl-semi">
        <h1 data-testid="store-page-title">Wszystkie produkty</h1>
      </div>
      <RefinementList sortBy={sort} categories={categories} />
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          q={q}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
