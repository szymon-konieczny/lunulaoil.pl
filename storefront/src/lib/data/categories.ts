import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

/**
 * Normalize a string to ASCII-friendly handle format.
 * Replaces Polish diacritics and other special chars with ASCII equivalents.
 */
export const normalizeHandle = (handle: string): string => {
  const polishMap: Record<string, string> = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
    Ą: "a",
    Ć: "c",
    Ę: "e",
    Ł: "l",
    Ń: "n",
    Ó: "o",
    Ś: "s",
    Ź: "z",
    Ż: "z",
  }
  return handle.replace(
    /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
    (char) => polishMap[char] || char
  )
}

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  // First try exact handle match
  const result = await sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])

  if (result) {
    return result
  }

  // If not found, fetch all categories and match by normalized handle
  // This handles Polish diacritics in DB handles vs ASCII URLs
  const allCategories = await listCategories()
  const normalizedHandle = normalizeHandle(handle)

  return allCategories?.find(
    (c) => normalizeHandle(c.handle) === normalizedHandle
  )
}
