"use client"

import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { QuizAnswers } from "../data"

type Props = {
  products: HttpTypes.StoreProduct[]
  answers: QuizAnswers
  aiRecommendation: string | null
  loading: boolean
  onReset: () => void
}

export default function QuizResults({
  products,
  answers,
  aiRecommendation,
  loading,
  onReset,
}: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-white mb-3">
          Twoje rekomendacje
        </h2>
        <p className="text-brand-text-muted text-lg">
          Na podstawie Twoich odpowiedzi wybraliśmy produkty idealne dla Ciebie.
        </p>
      </div>

      {/* AI recommendation */}
      {(loading || aiRecommendation) && (
        <div className="mb-10 p-6 rounded-large border border-brand-primary/20 bg-brand-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-brand-primary text-lg">✨</span>
            <h3 className="text-lg font-semibold text-brand-primary-light">
              Porada eksperta
            </h3>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
            </div>
          ) : (
            <p className="text-brand-text-muted leading-relaxed whitespace-pre-line">
              {aiRecommendation}
            </p>
          )}
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6 mb-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mb-10">
          <p className="text-brand-text-muted text-lg mb-2">
            Nie znaleźliśmy idealnego dopasowania.
          </p>
          <p className="text-brand-text-muted">
            Sprawdź nasz{" "}
            <LocalizedClientLink
              href="/store"
              className="text-brand-primary underline"
            >
              pełen asortyment
            </LocalizedClientLink>
            .
          </p>
        </div>
      )}

      {/* Workshop CTA */}
      <div className="mb-10 p-6 rounded-large border border-brand-accent/20 bg-brand-surface text-center">
        <span className="text-2xl mb-3 block">🧖‍♀️</span>
        <h3 className="text-lg font-semibold text-white mb-2">
          Poznaj rytuały pielęgnacji na żywo
        </h3>
        <p className="text-brand-text-muted text-sm leading-relaxed mb-4 max-w-lg mx-auto">
          Weź udział w naszych warsztatach Slow Care — nauczysz się jak
          najlepiej wykorzystać naturalne olejki i stworzyć własną rutynę
          pielęgnacyjną dopasowaną do Twojej skóry.
        </p>
        <LocalizedClientLink
          href="/categories/warsztaty"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-large border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-colors text-sm font-medium"
        >
          Sprawdź warsztaty
        </LocalizedClientLink>
      </div>

      {/* Actions */}
      <div className="flex flex-col small:flex-row items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-large border border-white/20 text-white hover:border-brand-primary/40 transition-colors"
        >
          Wypełnij quiz ponownie
        </button>
        <LocalizedClientLink
          href="/store"
          className="px-6 py-3 rounded-large bg-brand-primary text-black font-semibold hover:bg-brand-primary-light transition-colors"
        >
          Zobacz cały sklep
        </LocalizedClientLink>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  let cheapestPrice: ReturnType<typeof getProductPrice>["cheapestPrice"] = null
  try {
    cheapestPrice = getProductPrice({ product }).cheapestPrice
  } catch {}

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group"
    >
      <div className="rounded-large overflow-hidden border border-white/5 bg-brand-surface hover:border-brand-primary/20 transition-all duration-200">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          className="!rounded-none !shadow-none"
        />
        <div className="p-4">
          <Text className="text-white font-medium text-sm line-clamp-2">
            {product.title}
          </Text>
          {cheapestPrice && (
            <Text className="text-brand-primary mt-1 text-sm">
              {cheapestPrice.calculated_price}
            </Text>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
