// Run the paynow-reconcile-orders sweep once, on demand — e.g. in production
// to recover a paid-but-uncompleted cart right away instead of waiting for the
// 10-minute schedule:
//   railway run npx medusa exec ./src/scripts/run-paynow-reconcile.ts
import { ExecArgs } from "@medusajs/framework/types"
import paynowReconcileOrdersJob from "../jobs/paynow-reconcile-orders"

export default async function runPaynowReconcile({ container }: ExecArgs) {
  await paynowReconcileOrdersJob(container)
}
