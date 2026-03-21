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
  metadata: Record<string, any> | null
}

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function listIngredients(
  category?: string
): Promise<Ingredient[]> {
  try {
    const params = category ? `?category=${category}` : ""
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/ingredients${params}`,
      { next: { revalidate: 300 } }
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
      { next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.ingredient || null
  } catch {
    return null
  }
}
