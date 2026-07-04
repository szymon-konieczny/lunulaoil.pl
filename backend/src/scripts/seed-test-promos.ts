import { ExecArgs } from "@medusajs/framework/types"
import { Modules, PromotionStatus } from "@medusajs/framework/utils"

/**
 * Dev-only: seeds two promotions to test the storefront discount-code UX:
 *  - JOWITA: active, 10% off order  -> should apply
 *  - JESIEN: draft, 10% off order   -> exists but silently skipped by Medusa
 *
 * Run: npx medusa exec ./src/scripts/seed-test-promos.ts
 */
export default async function seedTestPromos({ container }: ExecArgs) {
  const promotionModule = container.resolve(Modules.PROMOTION)

  const existing = await promotionModule.listPromotions(
    { code: ["JOWITA", "JESIEN"] },
    { select: ["id", "code"] }
  )
  const have = new Set(existing.map((p) => p.code))

  const toCreate = [
    { code: "JOWITA", status: PromotionStatus.ACTIVE },
    { code: "JESIEN", status: PromotionStatus.DRAFT },
  ].filter((p) => !have.has(p.code))

  for (const { code, status } of toCreate) {
    await promotionModule.createPromotions({
      code,
      type: "standard",
      status,
      application_method: {
        type: "percentage",
        target_type: "order",
        allocation: "across",
        value: 10,
        currency_code: "pln",
      },
    })
    console.log(`created promotion ${code} (${status})`)
  }

  if (!toCreate.length) {
    console.log("promotions already present:", [...have].join(", "))
  }
}
