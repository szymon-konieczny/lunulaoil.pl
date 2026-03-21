import { MedusaService } from "@medusajs/framework/utils"
import Ingredient from "./models/ingredient"

class IngredientsModuleService extends MedusaService({
  Ingredient,
}) {}

export default IngredientsModuleService
