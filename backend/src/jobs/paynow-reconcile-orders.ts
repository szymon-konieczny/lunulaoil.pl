import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { completeCartWorkflow } from "@medusajs/core-flows"
import { PaynowClient } from "../modules/paynow/lib/client"

const PROVIDER_ID = "pp_paynow_paynow"

// How far back to sweep. Paynow payments expire well within this window, and
// older carts have already been seen by previous runs. Override via env for a
// one-off deeper sweep (e.g. recovering an old paid cart with the exec script).
const LOOKBACK_HOURS =
  Number(process.env.PAYNOW_RECONCILE_LOOKBACK_HOURS) || 72

// Leave fresh sessions to the live checkout paths (return-page polling, inline
// BLIK) before the sweeper touches them.
const MIN_AGE_MINUTES = 10

// Bound a single run; the rest rolls over to the next run.
const MAX_CARTS_PER_RUN = 20

type PaynowSessionRow = {
  id: string
  provider_id: string
  data: Record<string, unknown> | null
  updated_at: string | Date
}

type CartRow = {
  id: string
  completed_at: string | Date | null
  payment_collection?: {
    payment_sessions?: (PaynowSessionRow | null)[] | null
  } | null
}

/**
 * Safety net for "payment taken, no order": finds recent carts that were never
 * completed but do have a Paynow payment created, asks Paynow for the payment
 * status, and completes the cart when the payment is CONFIRMED.
 *
 * Covers buyers who never came back from the redirect, notifications that were
 * lost (in-memory event bus, restart during a deploy) or not configured in the
 * Paynow panel, and transient completion failures. completeCartWorkflow locks
 * the cart and returns the existing order if one was already created, so
 * racing the storefront/webhook completion paths is safe.
 */
export default async function paynowReconcileOrdersJob(
  container: MedusaContainer
): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const apiKey = process.env.PAYNOW_API_KEY
  const signatureKey = process.env.PAYNOW_SIGNATURE_KEY
  if (!apiKey || !signatureKey) {
    // Paynow not configured (local dev) — the provider isn't registered either.
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const lookback = new Date(Date.now() - LOOKBACK_HOURS * 3600 * 1000)
  const { data: carts } = (await query.graph({
    entity: "cart",
    fields: [
      "id",
      "completed_at",
      "payment_collection.payment_sessions.id",
      "payment_collection.payment_sessions.provider_id",
      "payment_collection.payment_sessions.data",
      "payment_collection.payment_sessions.updated_at",
    ],
    filters: { created_at: { $gte: lookback } },
    pagination: { skip: 0, take: 500 },
  })) as { data: CartRow[] }

  const minAgeCutoff = Date.now() - MIN_AGE_MINUTES * 60 * 1000

  const candidates = carts
    .filter((cart) => !cart.completed_at)
    .map((cart) => {
      const sessions = (
        cart.payment_collection?.payment_sessions ?? []
      ).filter(
        (s): s is PaynowSessionRow =>
          !!s &&
          s.provider_id === PROVIDER_ID &&
          !!s.data?.paymentId &&
          new Date(s.updated_at).getTime() < minAgeCutoff
      )
      return { cart, sessions }
    })
    .filter(({ sessions }) => sessions.length > 0)

  if (!candidates.length) {
    return
  }

  const client = new PaynowClient({
    apiKey,
    signatureKey,
    apiUrl: process.env.PAYNOW_API_URL,
  })

  const batch = candidates.slice(0, MAX_CARTS_PER_RUN)
  if (candidates.length > batch.length) {
    logger.warn(
      `paynow-reconcile: ${
        candidates.length - batch.length
      } candidate cart(s) deferred to the next run`
    )
  }

  for (const { cart, sessions } of batch) {
    for (const session of sessions) {
      const paymentId = session.data!.paymentId as string

      let status: string
      try {
        ;({ status } = await client.getPaymentStatus(paymentId))
      } catch (e) {
        logger.warn(
          `paynow-reconcile: status check failed for payment ${paymentId} (cart ${cart.id}): ${(e as Error).message}`
        )
        continue
      }

      if (status !== "CONFIRMED") {
        // Pending payments stay with the live paths; failed/expired ones are
        // not ours to complete.
        continue
      }

      try {
        const { result } = await completeCartWorkflow(container).run({
          input: { id: cart.id },
        })
        logger.warn(
          `paynow-reconcile: recovered order ${result.id} for paid cart ${cart.id} (Paynow payment ${paymentId})`
        )
      } catch (e) {
        // Loud on purpose: money was taken and the order STILL cannot be
        // created — a human needs to look (inventory? shipping validation?).
        logger.error(
          `paynow-reconcile: cart ${cart.id} has CONFIRMED Paynow payment ${paymentId} but completion failed: ${(e as Error).message}`
        )
      }
      break // one confirmed payment per cart is all we need
    }
  }
}

export const config = {
  name: "paynow-reconcile-orders",
  // Every 10 minutes
  schedule: "*/10 * * * *",
}
