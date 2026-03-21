import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import IngredientsModuleService from "../../../modules/ingredients/service"
import { INGREDIENTS_MODULE } from "../../../modules/ingredients"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const ingredientsService: IngredientsModuleService = req.scope.resolve(
    INGREDIENTS_MODULE
  )

  const category = req.query.category as string | undefined

  const filters: Record<string, any> = {}
  if (category) {
    filters.category = category
  }

  const ingredients = await ingredientsService.listIngredients(filters, {
    order: { name: "ASC" },
  })

  res.json({ ingredients })
}
