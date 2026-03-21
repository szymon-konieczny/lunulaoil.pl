import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import Thumbnail from "@modules/products/components/thumbnail"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export const metadata: Metadata = {
  title: "Biozgodna Pielęgnacja — Lunula Botanique",
  description:
    "Biozgodna pielęgnacja to filozofia, w której składniki kosmetyku są rozpoznawalne przez skórę i wspierają jej naturalne procesy. Odkryj podejście Lunula Botanique.",
  openGraph: {
    title: "Biozgodna Pielęgnacja — Lunula Botanique",
    description:
      "Składniki rozpoznawalne przez skórę. Pielęgnacja, która wspiera naturalne procesy zamiast je zaburzać.",
    url: `${BASE_URL}/biozgodna-pielegnacja`,
  },
}

const principles = [
  {
    title: "Rozpoznawalność przez skórę",
    text: "Składniki biozgodne to takie, które skóra rozpoznaje jako własne. Skwalan, kwas hialuronowy, olej jojoba — to substancje, które naturalnie występują w naszej skórze lub są do nich strukturalnie zbliżone.",
  },
  {
    title: "Ochrona bariery hydrolipidowej",
    text: "Bariera hydrolipidowa to naturalna tarcza skóry. Biozgodna pielęgnacja ją wzmacnia, nie narusza. Dlatego unikamy agresywnych detergentów, alkoholi i syntetycznych emulgatorów.",
  },
  {
    title: "Współpraca z mikrobiomem",
    text: "Na naszej skórze żyje ekosystem pożytecznych mikroorganizmów. Biozgodne kosmetyki wspierają ten naturalny mikrobiom, zamiast go niszczyć antybakteryjnymi dodatkami.",
  },
  {
    title: "Szacunek dla pH skóry",
    text: "Zdrowa skóra ma pH w zakresie 4,5–5,5. Nasze produkty są formulowane z poszanowaniem tego naturalnego pH, aby nie zaburzać kwasowego płaszcza ochronnego.",
  },
]

const whatWeAvoid = [
  { name: "Silikony", reason: "tworzą nieprzepuszczalną warstwę, która blokuje naturalne procesy skóry" },
  { name: "Parabeny", reason: "syntetyczne konserwanty, które mogą zaburzać mikrobiom skóry" },
  { name: "SLS / SLES", reason: "agresywne detergenty niszczące barierę hydrolipidową" },
  { name: "Sztuczne barwniki", reason: "niepotrzebne substancje, które nie wnoszą nic do pielęgnacji" },
  { name: "Mineralne oleje", reason: "ropopochodne składniki, które nie współpracują z naturalnym sebum" },
  { name: "Sztuczne zapachy", reason: "syntetyczne kompozycje, które mogą podrażniać wrażliwą skórę" },
]

const featuredProducts = [
  { handle: "hialcode", why: "Kwas hialuronowy — naturalny humektant występujący w naszej skórze" },
  { handle: "squalanecode", why: "Skwalan — identyczny z lipidem produkowanym przez gruczoły łojowe" },
  { handle: "jojobacode", why: "Olej jojoba — woskowy ester najbliższy ludzkiemu sebum" },
  { handle: "geranium-glow-60ml", why: "Krem z geranium — biozgodna formuła z naturalnymi emolientami" },
]

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function BiozgodnaPielegnacjaPage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  // Fetch featured products
  const productMap: Record<string, any> = {}
  if (region) {
    try {
      const { response } = await listProducts({
        countryCode,
        queryParams: {
          handle: featuredProducts.map((p) => p.handle),
          limit: featuredProducts.length,
        },
      })
      for (const p of response.products) {
        if (p.handle) productMap[p.handle] = p
      }
    } catch {}
  }

  return (
    <div className="bg-brand-background">
      {/* Hero */}
      <section className="py-20 small:py-32">
        <div className="content-container text-center max-w-3xl mx-auto">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Filozofia Lunula Botanique
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-6">
              Biozgodna Pielęgnacja
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-brand-text-muted text-lg leading-relaxed">
              Biozgodna pielęgnacja to podejście, w którym składniki kosmetyku
              są rozpoznawalne przez skórę — wspierają jej naturalne procesy,
              zamiast je zaburzać. To pielęgnacja oparta na szacunku do
              fizjologii skóry.
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={300}>
            <p className="text-brand-text-muted/70 text-base italic mt-6">
              Karmienie skóry tym, co ona już zna.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* What is biocompatible care */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container max-w-4xl mx-auto">
          <AnimateIn variant="fade-up">
            <h2 className="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium text-center mb-3">
              Czym jest biozgodność?
            </h2>
            <p className="text-2xl small:text-3xl font-heading font-bold text-brand-text text-center mb-12">
              Składniki, które skóra rozpoznaje jako własne
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-2 gap-8">
            {principles.map((principle, i) => (
              <AnimateIn key={principle.title} variant="fade-up" delay={i * 100}>
                <div className="p-6 border border-brand-border rounded-sm">
                  <h3 className="text-brand-text font-heading font-semibold text-lg mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-brand-text-muted text-sm leading-relaxed">
                    {principle.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Production photo */}
      <section className="py-16 small:py-24">
        <div className="content-container max-w-5xl mx-auto">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 items-center">
            <AnimateIn variant="fade-up">
              <div className="aspect-[4/5] rounded-sm overflow-hidden">
                <img
                  src="/lunula-lab-1.jpeg"
                  alt="Ręczna produkcja kosmetyków Lunula Botanique"
                  className="w-full h-full object-cover"
                />
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={150}>
              <h2 className="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">
                Rzemiosło
              </h2>
              <p className="text-2xl small:text-3xl font-heading font-bold text-brand-text mb-6">
                Tworzone ręcznie, z intencją
              </p>
              <p className="text-brand-text-muted leading-relaxed mb-4">
                Każdy produkt Lunula Botanique powstaje w małych seriach,
                z ręcznie dobranymi składnikami. Nie stosujemy masowej produkcji
                — każda butelka przechodzi przez nasze ręce.
              </p>
              <p className="text-brand-text-muted leading-relaxed">
                Dobieramy surowce od sprawdzonych dostawców, kontrolujemy każdy
                etap produkcji i dbamy o to, by finalny produkt był dokładnie
                taki, jaki powinien być — czysty, skuteczny i biozgodny.
              </p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* What we avoid */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container max-w-4xl mx-auto">
          <AnimateIn variant="fade-up">
            <h2 className="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium text-center mb-3">
              Czyste składy
            </h2>
            <p className="text-2xl small:text-3xl font-heading font-bold text-brand-text text-center mb-12">
              Czego nie znajdziesz w naszych produktach
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-4">
            {whatWeAvoid.map((item, i) => (
              <AnimateIn key={item.name} variant="fade-up" delay={i * 80}>
                <div className="p-5 border border-brand-border rounded-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-lg mt-0.5 shrink-0">✕</span>
                    <div>
                      <p className="text-brand-text font-medium text-sm">
                        {item.name}
                      </p>
                      <p className="text-brand-text-muted/70 text-xs mt-1 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured biozgodne products */}
      <section className="py-16 small:py-24">
        <div className="content-container max-w-5xl mx-auto">
          <AnimateIn variant="fade-up">
            <h2 className="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium text-center mb-3">
              Biozgodne produkty
            </h2>
            <p className="text-2xl small:text-3xl font-heading font-bold text-brand-text text-center mb-4">
              Składniki, które Twoja skóra rozpoznaje
            </p>
            <p className="text-brand-text-muted text-center max-w-2xl mx-auto mb-12">
              Każdy produkt z linii biozgodnej zawiera kluczowy składnik
              naturalnie obecny w ludzkiej skórze.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
            {featuredProducts.map((config, i) => {
              const product = productMap[config.handle]
              if (!product) return null

              const variantId = product.variants?.[0]?.id || null
              let price = ""
              try {
                const { cheapestPrice } = getProductPrice({ product })
                if (cheapestPrice?.calculated_price) {
                  price = cheapestPrice.calculated_price
                }
              } catch {}

              return (
                <AnimateIn key={config.handle} variant="fade-up" delay={i * 100}>
                  <div className="flex gap-5 p-5 border border-brand-border rounded-sm hover:border-brand-accent/30 transition-colors">
                    {product.thumbnail && (
                      <LocalizedClientLink
                        href={`/products/${config.handle}`}
                        className="w-28 h-28 shrink-0 rounded-sm overflow-hidden bg-brand-surface block"
                      >
                        <Thumbnail
                          thumbnail={product.thumbnail}
                          images={product.images}
                          size="small"
                          className="!rounded-sm !shadow-none"
                        />
                      </LocalizedClientLink>
                    )}
                    <div className="flex-1 min-w-0">
                      <LocalizedClientLink
                        href={`/products/${config.handle}`}
                        className="hover:text-brand-accent transition-colors"
                      >
                        <h3 className="text-brand-text font-heading font-semibold text-base">
                          {product.title}
                        </h3>
                      </LocalizedClientLink>
                      <p className="text-brand-text-muted text-xs mt-1 leading-relaxed">
                        {config.why}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        {price && (
                          <span className="text-brand-text font-semibold text-sm">
                            {price}
                          </span>
                        )}
                        <AddToCartButton
                          variantId={variantId || ""}
                          disabled={!variantId}
                        />
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>

          <AnimateIn variant="fade-up" delay={400}>
            <div className="text-center mt-10">
              <LocalizedClientLink
                href="/store"
                className="inline-block px-8 py-3 border border-brand-accent text-brand-accent text-sm tracking-wider uppercase hover:bg-brand-accent hover:text-white transition-colors rounded-sm"
              >
                Zobacz wszystkie produkty
              </LocalizedClientLink>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Lexicon CTA */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container max-w-3xl mx-auto text-center">
          <AnimateIn variant="fade-up">
            <h2 className="text-brand-accent text-xs tracking-[0.3em] uppercase font-medium mb-3">
              Leksykon składników
            </h2>
            <p className="text-2xl small:text-3xl font-heading font-bold text-brand-text mb-4">
              Poznaj składniki, które stosujemy
            </p>
            <p className="text-brand-text-muted leading-relaxed mb-8">
              W naszym leksykonie znajdziesz szczegółowe opisy składników
              aktywnych — ich pochodzenie, właściwości i zastosowanie
              w pielęgnacji biozgodnej.
            </p>
            <LocalizedClientLink
              href="/leksykon"
              className="inline-block px-8 py-3 bg-brand-accent text-white text-sm tracking-wider uppercase hover:bg-brand-accent/90 transition-colors rounded-sm"
            >
              Przeglądaj leksykon
            </LocalizedClientLink>
          </AnimateIn>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Biozgodna Pielęgnacja — Lunula Botanique",
            description:
              "Biozgodna pielęgnacja to filozofia, w której składniki kosmetyku są rozpoznawalne przez skórę i wspierają jej naturalne procesy.",
            url: `${BASE_URL}/biozgodna-pielegnacja`,
            publisher: {
              "@type": "Organization",
              name: "Lunula Botanique",
              url: BASE_URL,
            },
          }),
        }}
      />
    </div>
  )
}
