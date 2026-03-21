import { Metadata } from "next"
import { notFound } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import { getIngredient } from "@lib/data/ingredients"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import Image from "next/image"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle } = await props.params
  const ingredient = await getIngredient(handle)

  if (!ingredient) {
    return { title: "Składnik nie znaleziony" }
  }

  return {
    title: `${ingredient.name} - Leksykon Składników | Lunula Botanique`,
    description: ingredient.description.substring(0, 160),
  }
}

export default async function IngredientDetailPage(props: Props) {
  const { countryCode, handle } = await props.params
  const ingredient = await getIngredient(handle)

  if (!ingredient) {
    notFound()
  }

  // Fetch linked products
  const region = await getRegion(countryCode)
  let linkedProducts: any[] = []
  if (region && ingredient.product_handles.length > 0) {
    try {
      const { response } = await listProducts({
        countryCode,
        queryParams: {
          handle: ingredient.product_handles,
          limit: ingredient.product_handles.length,
        },
      })
      linkedProducts = response.products
    } catch {}
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ingredient.name} - Leksykon Składników`,
    description: ingredient.description,
    url: `${BASE_URL}/${countryCode}/leksykon/${handle}`,
    author: {
      "@type": "Organization",
      name: "Lunula Botanique",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Lunula Botanique",
      url: BASE_URL,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="bg-brand-background">
        <section className="py-20 small:py-28">
          <div className="content-container max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <AnimateIn variant="fade-in">
              <div className="mb-8">
                <LocalizedClientLink
                  href="/leksykon"
                  className="text-brand-text-muted/60 text-sm hover:text-brand-accent transition-colors"
                >
                  ← Leksykon Składników
                </LocalizedClientLink>
              </div>
            </AnimateIn>

            {/* Header */}
            <AnimateIn variant="fade-up" delay={100}>
              <div className="text-center mb-12">
                <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
                  Składnik
                </span>
                <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-2">
                  {ingredient.name}
                </h1>
                {ingredient.name_latin && (
                  <p className="text-brand-text-muted italic text-lg">
                    {ingredient.name_latin}
                  </p>
                )}
              </div>
            </AnimateIn>

            {/* Description */}
            <AnimateIn variant="fade-up" delay={200}>
              <div className="mb-10">
                <p className="text-brand-text-muted text-base leading-relaxed whitespace-pre-line">
                  {ingredient.description}
                </p>
              </div>
            </AnimateIn>

            {/* Benefits */}
            {ingredient.benefits.length > 0 && (
              <AnimateIn variant="fade-up" delay={300}>
                <div className="mb-10">
                  <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                    Właściwości
                  </h2>
                  <ul className="space-y-2">
                    {ingredient.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="text-brand-text-muted text-base leading-relaxed flex items-start gap-2"
                      >
                        <svg className="w-4 h-4 text-brand-accent mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            )}

            {/* Source */}
            {ingredient.source && (
              <AnimateIn variant="fade-up" delay={350}>
                <div className="p-6 border border-brand-border rounded-sm mb-10">
                  <h3 className="text-brand-text text-base font-semibold mb-2">
                    Pochodzenie
                  </h3>
                  <p className="text-brand-text-muted text-sm leading-relaxed">
                    {ingredient.source}
                  </p>
                </div>
              </AnimateIn>
            )}

            {/* Linked products */}
            {linkedProducts.length > 0 && (
              <AnimateIn variant="fade-up" delay={400}>
                <div className="mt-14">
                  <h2 className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium mb-6 text-center">
                    Znajdziesz w naszych produktach
                  </h2>
                  <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
                    {linkedProducts.map((product) => {
                      const variantId = product.variants?.[0]?.id || null
                      let price = ""
                      try {
                        const { cheapestPrice } = getProductPrice({ product })
                        price = cheapestPrice?.calculated_price || ""
                      } catch {}

                      return (
                        <div
                          key={product.id}
                          className="p-5 border border-brand-border rounded-sm flex gap-4 items-start"
                        >
                          {/* Thumbnail */}
                          <div className="w-20 h-20 shrink-0 rounded-sm overflow-hidden bg-brand-surface relative">
                            {product.thumbnail ? (
                              <Image
                                src={product.thumbnail}
                                alt={product.title || ""}
                                fill
                                sizes="80px"
                                className="object-contain object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-text-muted/30 text-xs">
                                ●
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <LocalizedClientLink
                              href={`/products/${product.handle}`}
                              className="text-brand-text text-sm font-semibold hover:text-brand-accent transition-colors line-clamp-2"
                            >
                              {product.title}
                            </LocalizedClientLink>
                            {price && (
                              <p className="text-brand-primary text-sm font-semibold mt-1">
                                {price}
                              </p>
                            )}
                            <div className="mt-2">
                              <AddToCartButton
                                variantId={variantId || ""}
                                disabled={!variantId}
                                className="px-4 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 border inline-flex items-center justify-center gap-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </AnimateIn>
            )}

            {/* Back link */}
            <AnimateIn variant="fade-up" delay={500}>
              <div className="mt-14 text-center">
                <LocalizedClientLink
                  href="/leksykon"
                  className="inline-flex items-center gap-2 text-brand-text-muted/60 text-sm hover:text-brand-accent transition-colors"
                >
                  ← Wróć do leksykonu
                </LocalizedClientLink>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </>
  )
}
