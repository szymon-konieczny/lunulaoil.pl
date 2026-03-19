"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error("Product page error:", error)

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-16 content-container text-center">
      <h1 className="text-2xl font-serif text-brand-text mb-4">
        Ups, coś poszło nie tak
      </h1>
      <p className="text-brand-text-muted mb-8 max-w-md">
        Nie udało się załadować strony produktu. Spróbuj ponownie lub wróć do
        sklepu.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-2 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-colors text-sm font-medium"
        >
          Spróbuj ponownie
        </button>
        <LocalizedClientLink
          href="/store"
          className="px-6 py-2 bg-brand-accent text-white hover:bg-brand-accent/80 transition-colors text-sm font-medium"
        >
          Wróć do sklepu
        </LocalizedClientLink>
      </div>
    </div>
  )
}
