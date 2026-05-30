import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const B2B_GROUP_NAME = "Salon / B2B"

/**
 * GET /store/customer-group
 *
 * Returns whether the authenticated customer belongs to the "Salon / B2B"
 * group, so the storefront can switch between gross (B2C) and net (B2B) price
 * presentation. Guests (no auth context) get `{ isB2B: false }`.
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    res.json({ isB2B: false })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "groups.name"],
    filters: { id: customerId },
  })

  const groups = (customers[0] as any)?.groups ?? []
  const isB2B = groups.some((g: any) => g?.name === B2B_GROUP_NAME)

  res.json({ isB2B })
}
