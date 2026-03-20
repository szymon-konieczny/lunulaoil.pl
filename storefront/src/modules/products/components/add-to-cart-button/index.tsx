"use client"

import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { useState } from "react"

type AddToCartButtonProps = {
  variantId: string
  disabled?: boolean
  className?: string
}

export default function AddToCartButton({
  variantId,
  disabled,
  className,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const countryCode = useParams().countryCode as string

  const handleClick = async () => {
    if (!variantId || disabled) return
    setIsAdding(true)
    try {
      await addToCart({ variantId, quantity: 1, countryCode })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {}
    setIsAdding(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isAdding}
      className={
        className ||
        "px-6 py-2.5 rounded-large text-sm font-medium transition-all duration-200 border inline-flex items-center justify-center gap-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
      }
    >
      {isAdding ? (
        <>
          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          Dodaję...
        </>
      ) : added ? (
        <>&#10003; Dodano</>
      ) : disabled ? (
        "Wkrótce dostępne"
      ) : (
        "Dodaj do koszyka"
      )}
    </button>
  )
}
