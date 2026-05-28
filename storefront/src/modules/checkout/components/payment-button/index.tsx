"use client"

import { isManual, isPaynow, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import {
  chargePaynow,
  getPaynowStatus,
  listPaynowMethods,
} from "@lib/data/paynow"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Text, clx } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isPaynow(paymentSession?.provider_id):
      return (
        <PaynowPaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Wybierz metodę płatności</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Złóż zamówienie
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Złóż zamówienie
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

const PaynowPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "pl"

  const [mode, setMode] = useState<"blik" | "redirect">("blik")
  const [blikCode, setBlikCode] = useState("")
  const [blikMethodId, setBlikMethodId] = useState<number | undefined>(undefined)
  const [blikAvailable, setBlikAvailable] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    listPaynowMethods(cart.total ?? 0, cart.currency_code)
      .then((groups) => {
        if (!active) {
          return
        }
        const blik = groups
          .find((g) => g.type === "BLIK")
          ?.paymentMethods.find((m) => m.status === "ENABLED")
        if (blik) {
          setBlikMethodId(blik.id)
        } else {
          setBlikAvailable(false)
          setMode("redirect")
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [cart.total, cart.currency_code])

  const continueUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${countryCode}/paynow-return?cart_id=${cart.id}`
      : undefined

  // Poll Paynow status (~90s) until a terminal state is reached.
  const pollStatus = async (): Promise<string> => {
    for (let i = 0; i < 45; i++) {
      const { status } = await getPaynowStatus(cart.id)
      if (status === "CONFIRMED") {
        return "CONFIRMED"
      }
      if (["REJECTED", "ERROR", "EXPIRED", "ABANDONED"].includes(status)) {
        return status
      }
      await new Promise((r) => setTimeout(r, 2000))
    }
    return "PENDING"
  }

  const handleBlik = async () => {
    setErrorMessage(null)
    if (!/^\d{6}$/.test(blikCode)) {
      setErrorMessage("Wpisz 6-cyfrowy kod BLIK.")
      return
    }
    setSubmitting(true)
    try {
      const res = await chargePaynow({
        cart_id: cart.id,
        blik_code: blikCode,
        payment_method_id: blikMethodId,
        continue_url: continueUrl,
      })
      if (["REJECTED", "ERROR"].includes(res.status)) {
        setErrorMessage("Płatność odrzucona. Spróbuj ponownie.")
        setSubmitting(false)
        return
      }
      setAwaitingConfirmation(true)
      const final = await pollStatus()
      if (final === "CONFIRMED") {
        await placeOrder(cart.id)
        return // placeOrder redirects to the confirmation page
      }
      setErrorMessage(
        final === "PENDING"
          ? "Nie potwierdzono płatności w czasie. Spróbuj ponownie."
          : "Płatność nie powiodła się. Spróbuj ponownie."
      )
    } catch (e: any) {
      setErrorMessage(e?.message || "Wystąpił błąd płatności.")
    } finally {
      setAwaitingConfirmation(false)
      setSubmitting(false)
    }
  }

  const handleRedirect = async () => {
    setErrorMessage(null)
    setSubmitting(true)
    try {
      const res = await chargePaynow({
        cart_id: cart.id,
        continue_url: continueUrl,
      })
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl
        return
      }
      setErrorMessage("Brak adresu przekierowania z Paynow.")
      setSubmitting(false)
    } catch (e: any) {
      setErrorMessage(e?.message || "Wystąpił błąd płatności.")
      setSubmitting(false)
    }
  }

  if (awaitingConfirmation) {
    return (
      <div className="flex flex-col gap-y-2">
        <Text className="txt-medium">
          Potwierdź płatność w aplikacji bankowej (BLIK). Czekamy na
          potwierdzenie…
        </Text>
        <Button isLoading size="large" disabled>
          Oczekiwanie na potwierdzenie
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {blikAvailable && (
        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={() => setMode("blik")}
            className={clx(
              "px-4 py-2 border rounded-rounded txt-medium",
              { "border-ui-border-interactive": mode === "blik" }
            )}
          >
            BLIK
          </button>
          <button
            type="button"
            onClick={() => setMode("redirect")}
            className={clx(
              "px-4 py-2 border rounded-rounded txt-medium",
              { "border-ui-border-interactive": mode === "redirect" }
            )}
          >
            Przelew / karta / Google Pay
          </button>
        </div>
      )}

      {mode === "blik" && blikAvailable ? (
        <div className="flex flex-col gap-y-2">
          <Input
            inputMode="numeric"
            maxLength={6}
            placeholder="Kod BLIK (6 cyfr)"
            value={blikCode}
            onChange={(e) =>
              setBlikCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
          <Button
            size="large"
            onClick={handleBlik}
            isLoading={submitting}
            disabled={notReady || blikCode.length !== 6}
            data-testid={dataTestId}
          >
            Zapłać BLIK
          </Button>
        </div>
      ) : (
        <Button
          size="large"
          onClick={handleRedirect}
          isLoading={submitting}
          disabled={notReady}
          data-testid={dataTestId}
        >
          Zapłać przez Paynow
        </Button>
      )}

      <ErrorMessage
        error={errorMessage}
        data-testid="paynow-payment-error-message"
      />
    </div>
  )
}

export default PaymentButton
