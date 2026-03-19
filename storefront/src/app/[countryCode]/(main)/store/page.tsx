import { Metadata } from "next"

import { listCategories, normalizeHandle } from "@lib/data/categories"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export const metadata: Metadata = {
  title: "Sklep",
  description: "Przeglądaj wszystkie nasze produkty.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q } = searchParams

  // Fetch categories for filter chips
  let categories: { id: string; name: string; handle: string }[] = []
  try {
    const cats = await listCategories()
    categories = (cats || []).map((c) => ({
      id: c.id,
      name: c.name,
      handle: normalizeHandle(c.handle),
    }))
  } catch {}

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sklep — Lunula Botanique",
    description: "Przeglądaj wszystkie nasze produkty.",
    url: `${BASE_URL}/${params.countryCode}/store`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        categories={categories}
        q={q}
      />
    </>
  )
}
