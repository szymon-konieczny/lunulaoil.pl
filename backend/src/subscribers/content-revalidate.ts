import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function contentRevalidateHandler({
  event,
  container,
}: SubscriberArgs<unknown>): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const storefrontUrl = process.env.STOREFRONT_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!storefrontUrl || !secret) {
    logger.warn(
      `content-revalidate: skipping (${event.name}), STOREFRONT_URL or REVALIDATE_SECRET not set`
    )
    return
  }

  try {
    const res = await fetch(`${storefrontUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ all: true }),
    })

    if (!res.ok) {
      logger.error(
        `content-revalidate: ${event.name} failed, storefront responded ${res.status}`
      )
      return
    }

    logger.info(`content-revalidate: ${event.name} → storefront cache invalidated`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logger.error(`content-revalidate: ${event.name} fetch failed: ${msg}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "product-category.created",
    "product-category.updated",
    "product-category.deleted",
    "product-collection.created",
    "product-collection.updated",
    "product-collection.deleted",
    "product-type.created",
    "product-type.updated",
    "product-type.deleted",
    "product-tag.created",
    "product-tag.updated",
    "product-tag.deleted",
    "price-list.created",
    "price-list.updated",
    "price-list.deleted",
    "region.created",
    "region.updated",
    "region.deleted",
  ],
}
