"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Icon from "@modules/common/components/icon"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"
import { QuizAnswers } from "../data"

function highlightProductNames(
  text: string,
  products: HttpTypes.StoreProduct[]
): string {
  let result = text

  // Build keyword phrases from product titles — both full titles and distinctive fragments
  const phrases: string[] = []
  for (const p of products) {
    if (!p.title) continue
    // Add full title
    phrases.push(p.title)
    // Extract distinctive subphrases (e.g. "Green Witch Divine", "PEŁNIA KSIĘŻYCA", "LipidCode")
    const words = p.title.split(/\s+/)
    // Multi-word uppercase sequences (e.g. "PEŁNIA KSIĘŻYCA", "KSIĘŻYC W NOWIU")
    const upperMatch = p.title.match(/(?:[A-ZĄĆĘŁŃÓŚŹŻ]{2,}\s*){2,}/g)
    if (upperMatch) phrases.push(...upperMatch.map((m) => m.trim()))
    // CamelCase/brand words (e.g. "LipidCode", "HialCode", "SqualaneCode", "JojobaCode")
    for (const w of words) {
      if (/^[A-Z][a-z]+[A-Z]/.test(w) || /Code$/.test(w)) phrases.push(w)
    }
    // Distinctive multi-word names (3+ char words excluding common Polish words)
    const skipWords = new Set(["olej", "olejek", "krem", "mydło", "nutą", "250ml", "50ml", "30ml", "warsztaty", "tworzenia", "kremu"])
    const distinctive = words.filter((w) => w.length > 3 && !skipWords.has(w.toLowerCase()))
    if (distinctive.length >= 2) {
      phrases.push(distinctive.join(" "))
    }
  }

  // Sort longest first to avoid partial matches
  const unique = [...new Set(phrases)].sort((a, b) => b.length - a.length)

  for (const phrase of unique) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    result = result.replace(
      new RegExp(`(?<!<[^>]*)${escaped}(?![^<]*>)`, "g"),
      `<strong class="text-brand-text font-semibold">${phrase}</strong>`
    )
  }
  return result
}

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
        <h2 className="text-3xl font-semibold text-brand-text mb-3">
          Twoje rekomendacje
        </h2>
        <p className="text-brand-text-muted text-lg">
          Na podstawie Twoich odpowiedzi wybraliśmy produkty idealne dla Ciebie.
        </p>
      </div>

      {/* AI recommendation */}
      {(loading || aiRecommendation) && (
        <div className="mb-10 p-6 rounded-large border border-brand-accent/20 bg-brand-accent/5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="sparkle" size={20} />
            <h3 className="text-lg font-semibold text-brand-accent-light">
              Porada eksperta
            </h3>
          </div>
          {loading ? (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-5 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin" />
                <p className="text-brand-text-muted text-sm">
                  Analizuję Twoje odpowiedzi i dobieram najlepsze produkty...
                </p>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-brand-surface rounded animate-pulse w-full" />
                <div className="h-3 bg-brand-surface rounded animate-pulse w-3/4" />
                <div className="h-3 bg-brand-surface rounded animate-pulse w-5/6" />
              </div>
            </div>
          ) : (
            <p
              className="text-brand-text-muted leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: highlightProductNames(
                  aiRecommendation || "",
                  products
                ),
              }}
            />
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
              className="text-brand-accent underline"
            >
              pełen asortyment
            </LocalizedClientLink>
            .
          </p>
        </div>
      )}

      {/* Workshop CTA */}
      <div className="mb-10 p-6 rounded-large border border-brand-accent/20 bg-brand-surface text-center">
        <Icon name="spa" size={32} className="mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-brand-text mb-2">
          Poznaj rytuały pielęgnacji na żywo
        </h3>
        <p className="text-brand-text-muted text-sm leading-relaxed mb-4 max-w-lg mx-auto">
          Weź udział w naszych warsztatach Slow Care — nauczysz się jak
          najlepiej wykorzystać naturalne olejki i stworzyć własną rutynę
          pielęgnacyjną dopasowaną do Twojej skóry.
        </p>
        <LocalizedClientLink
          href="/categories/warsztaty"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-large border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors text-sm font-medium"
        >
          Sprawdź warsztaty
        </LocalizedClientLink>
      </div>

      {/* Actions */}
      <div className="flex flex-col small:flex-row items-center justify-center gap-4">
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-large border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors"
        >
          Wypełnij quiz ponownie
        </button>
        <LocalizedClientLink
          href="/store"
          className="px-6 py-3 rounded-large bg-brand-accent text-white font-semibold hover:bg-brand-accent-light transition-colors"
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
      <div className="rounded-large overflow-hidden border border-brand-border bg-brand-surface hover:border-brand-accent/20 transition-all duration-200">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          className="!rounded-none !shadow-none"
        />
        <div className="p-4">
          <Text className="text-brand-text font-medium text-sm line-clamp-2">
            {product.title}
          </Text>
          {cheapestPrice && (
            <Text className="text-brand-accent mt-1 text-sm">
              {cheapestPrice.calculated_price}
            </Text>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
