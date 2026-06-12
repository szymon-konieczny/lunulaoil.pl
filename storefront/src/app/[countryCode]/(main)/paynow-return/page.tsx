"use client"

import { placeOrder } from "@lib/data/cart"
import { getPaynowStatus } from "@lib/data/paynow"
import { Button, Text } from "@medusajs/ui"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const TERMINAL_FAILURE = ["REJECTED", "ERROR", "EXPIRED", "ABANDONED"]

/**
 * Buyer return page after a Paynow redirect payment. Polls the payment status
 * and, once CONFIRMED, completes the cart (placeOrder redirects to the order
 * confirmation). The notification webhook is the backup completion path.
 */
export default function PaynowReturnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const countryCode = (params?.countryCode as string) || "pl"
  const cartId = searchParams.get("cart_id")

  const [message, setMessage] = useState("Weryfikujemy płatność…")
  const [error, setError] = useState<string | null>(null)
  // Payment CONFIRMED but Medusa refused to create the order — distinct from a
  // failed payment: the buyer must NOT pay again.
  const [paidButFailed, setPaidButFailed] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // No cart_id means we arrived via Paynow's default return URL (fallback),
    // not our per-payment continueUrl. We can't tie this back to a cart
    // client-side, but the notification webhook completes the order server-side.
    // Show a reassuring message instead of an error.
    if (!cartId) {
      setDone(true)
      setMessage(
        "Dziękujemy! Jeśli płatność się powiodła, potwierdzenie zamówienia wyślemy e-mailem."
      )
      return
    }

    let cancelled = false

    const run = async () => {
      for (let i = 0; i < 60 && !cancelled; i++) {
        let status = "PENDING"
        try {
          const res = await getPaynowStatus(cartId)
          status = res.status
        } catch {
          // transient error — keep polling
        }

        if (status === "CONFIRMED") {
          try {
            await placeOrder(cartId) // redirects to the confirmation page
            return
          } catch (e) {
            // Real completion failure (an already-completed cart returns the
            // existing order and redirects above). The backend sweeper retries
            // every few minutes; keep the reason in the console for support.
            console.error("paynow-return: completion failed after CONFIRMED", e)
            if (!cancelled) {
              setPaidButFailed(true)
            }
            return
          }
        }

        if (TERMINAL_FAILURE.includes(status)) {
          if (!cancelled) {
            setError("Płatność nie powiodła się lub została anulowana.")
          }
          return
        }

        await new Promise((r) => setTimeout(r, 2000))
      }

      if (!cancelled) {
        setDone(true)
        setMessage(
          "Płatność jest jeszcze przetwarzana. Sprawdź status zamówienia za chwilę."
        )
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [cartId])

  return (
    <div className="content-container flex flex-col items-center justify-center gap-y-4 py-24 text-center">
      {paidButFailed ? (
        <>
          <Text className="text-lg font-medium">
            Płatność została potwierdzona, ale nie udało się automatycznie
            utworzyć zamówienia.
          </Text>
          <Text className="max-w-prose text-ui-fg-subtle">
            Nie płać ponownie — dokończymy zamówienie automatycznie i wyślemy
            potwierdzenie e-mailem. Jeśli nie dotrze w ciągu godziny, napisz do
            nas: <a className="underline" href="mailto:kontakt@lunulaoil.pl">kontakt@lunulaoil.pl</a>.
          </Text>
          <a href={`/${countryCode}`}>
            <Button variant="secondary">Wróć do sklepu</Button>
          </a>
        </>
      ) : error ? (
        <>
          <Text className="text-lg font-medium">{error}</Text>
          <a href={`/${countryCode}/checkout?step=payment`}>
            <Button variant="secondary">Wróć do płatności</Button>
          </a>
        </>
      ) : (
        <>
          {!done && (
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-ui-border-base border-t-ui-fg-base" />
          )}
          <Text className="text-lg font-medium">{message}</Text>
          {done && (
            <a href={`/${countryCode}`}>
              <Button variant="secondary">Wróć do sklepu</Button>
            </a>
          )}
        </>
      )}
    </div>
  )
}
