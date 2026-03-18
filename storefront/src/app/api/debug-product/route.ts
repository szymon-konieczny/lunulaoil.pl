import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL ? "SET" : "NOT_SET",
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ? "SET" : "NOT_SET",
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ? "SET" : "NOT_SET",
      NODE_ENV: process.env.NODE_ENV,
    },
  }

  // Test 1: Check if backend is reachable
  const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  results.backendUrl = backendUrl

  try {
    const regionsRes = await fetch(`${backendUrl}/store/regions`, {
      headers: {
        "x-publishable-api-key": publishableKey || "",
      },
      cache: "no-store",
    })
    const regionsData = await regionsRes.json()
    results.regions = {
      status: regionsRes.status,
      count: regionsData.regions?.length ?? 0,
      countryCodes: regionsData.regions?.flatMap((r: any) =>
        r.countries?.map((c: any) => c.iso_2)
      ),
    }
  } catch (e: any) {
    results.regions = { error: e.message }
  }

  // Test 2: Fetch a product
  try {
    const productsRes = await fetch(
      `${backendUrl}/store/products?handle=magnolia-250ml&fields=handle,title,id`,
      {
        headers: {
          "x-publishable-api-key": publishableKey || "",
        },
        cache: "no-store",
      }
    )
    const productsData = await productsRes.json()
    results.product = {
      status: productsRes.status,
      found: productsData.products?.length > 0,
      data: productsData.products?.[0] ?? productsData,
    }
  } catch (e: any) {
    results.product = { error: e.message }
  }

  // Test 3: Fetch categories
  try {
    const catsRes = await fetch(
      `${backendUrl}/store/product-categories?fields=handle,name,id`,
      {
        headers: {
          "x-publishable-api-key": publishableKey || "",
        },
        cache: "no-store",
      }
    )
    const catsData = await catsRes.json()
    results.categories = {
      status: catsRes.status,
      count: catsData.product_categories?.length ?? 0,
      handles: catsData.product_categories?.map((c: any) => c.handle),
    }
  } catch (e: any) {
    results.categories = { error: e.message }
  }

  // Test 4: Try using the SDK like the product page does
  try {
    const { getRegion } = await import("@lib/data/regions")
    const region = await getRegion("pl")
    results.getRegion = region ? { id: region.id, name: region.name } : null
  } catch (e: any) {
    results.getRegion = { error: e.message, stack: e.stack?.split("\n").slice(0, 5) }
  }

  // Test 5: Try fetching product via SDK
  try {
    const { listProducts } = await import("@lib/data/products")
    const result = await listProducts({
      countryCode: "pl",
      queryParams: { handle: "magnolia-250ml" },
    })
    results.listProducts = {
      count: result.response.products.length,
      firstProduct: result.response.products[0]?.title,
    }
  } catch (e: any) {
    results.listProducts = { error: e.message, stack: e.stack?.split("\n").slice(0, 5) }
  }

  return NextResponse.json(results, { status: 200 })
}
