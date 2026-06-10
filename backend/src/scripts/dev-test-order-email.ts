// Temporary dev-only script: re-runs the order-placed subscriber for a given
// order so the confirmation email can be inspected in a local SMTP catcher.
// Usage: npx medusa exec ./src/scripts/dev-test-order-email.ts <order_id>
import { ExecArgs } from "@medusajs/framework/types"
import orderPlacedHandler from "../subscribers/order-placed"

export default async function devTestOrderEmail({ container, args }: ExecArgs) {
  const orderId = args?.[0]
  if (!orderId) {
    throw new Error("Pass an order id, e.g. order_01...")
  }
  await orderPlacedHandler({
    event: { data: { id: orderId } },
    container,
  } as any)
}
