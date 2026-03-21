import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import IngredientsModuleService from "../../../../modules/ingredients/service"
import { INGREDIENTS_MODULE } from "../../../../modules/ingredients"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const ingredientsService: IngredientsModuleService = req.scope.resolve(
    INGREDIENTS_MODULE
  )

  const handle = req.params.handle

  const [ingredient] = await ingredientsService.listIngredients(
    { handle },
    { take: 1 }
  )

  if (!ingredient) {
    res.status(404).json({ message: "Ingredient not found" })
    return
  }

  res.json({ ingredient })
}
