import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countryCodes = await listRegions().then((regions) =>
    regions
      ?.map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
      .filter(Boolean) as string[]
  )

  const defaultCountry = countryCodes?.[0] || "pl"

  // Static pages
  const staticPages = countryCodes.flatMap((country) => [
    {
      url: `${BASE_URL}/${country}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/${country}/store`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ])

  // Product pages
  let productPages: MetadataRoute.Sitemap = []
  try {
    const { response } = await listProducts({
      countryCode: defaultCountry,
      queryParams: { limit: 1000, fields: "handle,updated_at" },
    })

    productPages = countryCodes.flatMap((country) =>
      response.products.map((product) => ({
        url: `${BASE_URL}/${country}/products/${product.handle}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }))
    )
  } catch (e) {
    console.error("Sitemap: failed to fetch products", e)
  }

  // Category pages
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await listCategories()

    categoryPages = countryCodes.flatMap((country) =>
      (categories || []).map((category) => ({
        url: `${BASE_URL}/${country}/categories/${category.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    )
  } catch (e) {
    console.error("Sitemap: failed to fetch categories", e)
  }

  // Collection pages
  let collectionPages: MetadataRoute.Sitemap = []
  try {
    const { collections } = await listCollections()

    collectionPages = countryCodes.flatMap((country) =>
      collections.map((collection) => ({
        url: `${BASE_URL}/${country}/collections/${collection.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    )
  } catch (e) {
    console.error("Sitemap: failed to fetch collections", e)
  }

  return [...staticPages, ...productPages, ...categoryPages, ...collectionPages]
}
