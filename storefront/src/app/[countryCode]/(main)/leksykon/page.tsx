import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import { listIngredients, Ingredient } from "@lib/data/ingredients"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export const metadata: Metadata = {
  title: "Leksykon Składników - Lunula Botanique",
  description:
    "Encyklopedia naturalnych składników kosmetycznych. Poznaj właściwości składników używanych w produktach Lunula.",
}

const categoryLabels: Record<string, string> = {
  hydrating: "Nawilżanie",
  oil: "Oleje",
  herb: "Zioła i kwiaty",
  clay: "Glinki",
  active: "Substancje aktywne",
  exfoliant: "Eksfolianty",
  butter: "Masła",
  other: "Inne",
}

const categoryOrder = [
  "hydrating",
  "oil",
  "butter",
  "herb",
  "clay",
  "active",
  "exfoliant",
  "other",
]

export default async function LexiconPage() {
  const ingredients = await listIngredients()

  // Group by category
  const grouped = new Map<string, Ingredient[]>()
  for (const cat of categoryOrder) {
    const items = ingredients.filter((i) => i.category === cat)
    if (items.length) grouped.set(cat, items)
  }

  const lexiconJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Leksykon Składników - Lunula Botanique",
    description:
      "Encyklopedia naturalnych składników kosmetycznych używanych w produktach Lunula Botanique.",
    url: `${BASE_URL}/pl/leksykon`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lexiconJsonLd) }}
      />
      <div className="bg-brand-background">
        {/* Hero */}
        <section className="py-20 small:py-32">
          <div className="content-container text-center max-w-3xl mx-auto">
            <AnimateIn variant="fade-in">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Encyklopedia
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={100}>
              <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-6">
                Leksykon Składników
              </h1>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={200}>
              <p className="text-brand-text-muted text-lg leading-relaxed mb-4">
                Poznaj składniki, które stosujemy w produktach Lunula. Każdy z
                nich został wybrany ze względu na biozgodność - zgodność z
                naturalną fizjologią skóry.
              </p>
              <p className="text-brand-text-muted/70 text-base italic">
                Składniki, które skóra rozumie i rozpoznaje.
              </p>
            </AnimateIn>
          </div>
        </section>

        {/* Ingredients by category */}
        {Array.from(grouped.entries()).map(([cat, items], gi) => (
          <section
            key={cat}
            className={`py-16 small:py-20 ${gi % 2 === 0 ? "bg-brand-surface" : "bg-brand-background"}`}
          >
            <div className="content-container">
              <AnimateIn variant="fade-in">
                <h2 className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium mb-8 text-center">
                  {categoryLabels[cat] || cat}
                </h2>
              </AnimateIn>

              <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {items.map((ingredient, i) => (
                  <AnimateIn
                    key={ingredient.id}
                    variant="fade-up"
                    delay={i * 100}
                    duration={600}
                  >
                    <LocalizedClientLink
                      href={`/leksykon/${ingredient.handle}`}
                      className="block group"
                    >
                      <div className="p-6 rounded-sm border border-brand-border hover:border-brand-accent/30 transition-colors duration-300 h-full">
                        <h3 className="text-brand-text text-lg font-heading font-semibold mb-1 group-hover:text-brand-accent transition-colors">
                          {ingredient.name}
                        </h3>
                        {ingredient.name_latin && (
                          <p className="text-brand-accent text-xs tracking-wider italic mb-3">
                            {ingredient.name_latin}
                          </p>
                        )}
                        <p className="text-brand-text-muted text-sm leading-relaxed line-clamp-3">
                          {ingredient.description}
                        </p>
                        <p className="text-brand-text-muted/50 text-xs mt-4 group-hover:text-brand-accent transition-colors">
                          Dowiedz się więcej →
                        </p>
                      </div>
                    </LocalizedClientLink>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Empty state */}
        {ingredients.length === 0 && (
          <section className="py-20 bg-brand-surface">
            <div className="content-container text-center">
              <p className="text-brand-text-muted text-base">
                Leksykon składników jest w przygotowaniu.
              </p>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
