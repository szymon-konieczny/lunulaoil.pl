"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

export const retrieveCollection = async (id: string) => {
  const isProd = process.env.NODE_ENV === "production"
  const next = isProd ? { tags: ["collections"] } : undefined

  return sdk.client
    .fetch<{ collection: HttpTypes.StoreCollection }>(
      `/store/collections/${id}`,
      {
        next,
        cache: isProd ? "force-cache" : "no-store",
      }
    )
    .then(({ collection }) => collection)
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: HttpTypes.StoreCollection[]; count: number }> => {
  const isProd = process.env.NODE_ENV === "production"
  const next = isProd ? { tags: ["collections"] } : undefined

  queryParams.limit = queryParams.limit || "100"
  queryParams.offset = queryParams.offset || "0"

  return sdk.client
    .fetch<{ collections: HttpTypes.StoreCollection[]; count: number }>(
      "/store/collections",
      {
        query: queryParams,
        next,
        cache: isProd ? "force-cache" : "no-store",
      }
    )
    .then(({ collections }) => ({ collections, count: collections.length }))
}

export const getCollectionByHandle = async (
  handle: string
): Promise<HttpTypes.StoreCollection> => {
  const isProd = process.env.NODE_ENV === "production"
  const next = isProd ? { tags: ["collections"] } : undefined

  return sdk.client
    .fetch<HttpTypes.StoreCollectionListResponse>(`/store/collections`, {
      query: { handle, fields: "*products" },
      next,
      cache: isProd ? "force-cache" : "no-store",
    })
    .then(({ collections }) => collections[0])
}
