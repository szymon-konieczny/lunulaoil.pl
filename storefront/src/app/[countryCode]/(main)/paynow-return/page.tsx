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
          } catch {
            // Likely already completed by the webhook.
            if (!cancelled) {
              setDone(true)
              setMessage(
                "Płatność potwierdzona. Twoje zamówienie jest przetwarzane — potwierdzenie wyślemy e-mailem."
              )
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
      {error ? (
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
