"use server"

export type Ingredient = {
  id: string
  name: string
  name_latin: string | null
  handle: string
  description: string
  benefits: string[]
  source: string | null
  category: string
  product_handles: string[]
  hide_in_lexicon: boolean
  metadata: Record<string, any> | null
}

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function getHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(PUBLISHABLE_KEY
      ? { "x-publishable-api-key": PUBLISHABLE_KEY }
      : {}),
  }
}

export async function listIngredients(
  category?: string
): Promise<Ingredient[]> {
  try {
    const params = category ? `?category=${category}` : ""
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/ingredients${params}`,
      { headers: getHeaders(), next: { revalidate: 300 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.ingredients || []
  } catch {
    return []
  }
}

export async function getIngredient(
  handle: string
): Promise<Ingredient | null> {
  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/ingredients/${handle}`,
      { headers: getHeaders(), next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.ingredient || null
  } catch {
    return null
  }
}
