import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import Icon from "@modules/common/components/icon"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import Thumbnail from "@modules/products/components/thumbnail"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export const metadata: Metadata = {
  title: "Dla Salonów Kosmetycznych - Lunula Botanique",
  description:
    "Naturalne kosmetyki Lunula Botanique dla profesjonalnych salonów kosmetycznych. Biozgodna pielęgnacja, którą docenią Twoje klientki.",
}

const benefits = [
  {
    icon: "herb",
    title: "100% naturalnych składników",
    text: "Produkty Lunula oparte są wyłącznie na składnikach naturalnych i biozgodnych - bez silikonów, parabenów, sztucznych barwników. Twoje klientki docenią czysty skład.",
  },
  {
    icon: "sparkle",
    title: "Wyróżnij się na rynku",
    text: "Oferując kosmetyki Lunula Botanique, pozycjonujesz swój salon jako miejsce świadomej, naturalnej pielęgnacji - rosnący trend wśród klientek.",
  },
  {
    icon: "flower",
    title: "Rytuał, nie tylko zabieg",
    text: "Każdy produkt Lunula to doświadczenie sensoryczne - od aromaterapeutycznych mydeł po luksusowe serum. Zamień zwykły zabieg w rytuał.",
  },
  {
    icon: "lotion",
    title: "Edukacja i wsparcie",
    text: "Zapewniamy materiały edukacyjne o składnikach i pielęgnacji biozgodnej, abyś mogła dzielić się wiedzą ze swoimi klientkami.",
  },
]

// Salon price table data
const priceTable = [
  {
    category: "Pielęgnacja ciała / masaż - 250 ml",
    items: [
      { name: "Magnolia", retail: "139 zł", salon: "86 zł" },
      { name: "Poranna Rosa", retail: "139 zł", salon: "86 zł" },
      { name: "Księżyc w Nowiu", retail: "139 zł", salon: "96 zł" },
      { name: "Wschód Słońca", retail: "149 zł", salon: "99 zł" },
      { name: "Pełnia Księżyca", retail: "221 zł", salon: "190 zł" },
      { name: "Ragnar", retail: "149 zł", salon: "99 zł" },
      { name: "Green Witch Divine", retail: "149 zł", salon: "96 zł" },
    ],
  },
  {
    category: "JojobaCode Gold - 100 ml",
    items: [
      { name: "JojobaCode Gold", retail: "88 zł", salon: "68 zł" },
    ],
  },
  {
    category: "Pielęgnacja twarzy - 30 ml",
    items: [
      { name: "HyalCode Serum", retail: "69 zł", salon: "49 zł" },
      { name: "SqualaneCode Elixir", retail: "56 zł", salon: "36 zł" },
      { name: "JojobaCode Gold", retail: "59 zł", salon: "39 zł" },
    ],
  },
  {
    category: "Kremy rytualne - 60 ml",
    items: [
      { name: "Geranium Glow", retail: "129 zł", salon: "65 zł" },
      { name: "Golden Glow", retail: "139 zł", salon: "70 zł" },
      { name: "Rose Alchemy", retail: "149 zł", salon: "75 zł" },
      { name: "Clear Ritual", retail: "119 zł", salon: "65 zł" },
    ],
  },
  {
    category: "Mydła rytualne - 100 g",
    items: [
      { name: "Rusałka / Różyczka / Mokosza", retail: "33 zł", salon: "26 zł" },
    ],
  },
]

const salonProducts = [
  {
    handle: "hialcode",
    name: "HialCode",
    subtitle: "Serum z kwasem hialuronowym",
    useCase: "Idealne jako baza pod zabiegi nawilżające i anti-aging",
    fallbackPrice: "69 zł",
  },
  {
    handle: "squalanecode",
    name: "SqualaneCode",
    subtitle: "Serum ze skwalanem",
    useCase: "Doskonałe do zabiegów regenerujących i odbudowy bariery lipidowej",
    fallbackPrice: "56 zł",
  },
  {
    handle: "jojobacode",
    name: "JojobaCode",
    subtitle: "Serum z olejem jojoba",
    useCase: "Uniwersalne - reguluje sebum, nawilża, nie zatyka porów",
    fallbackPrice: "59 zł",
  },
  {
    handle: "rusalka-mydlo-rytualne",
    name: "Rusałka",
    subtitle: "Mydło rytualne z rumiankiem i lawendą",
    useCase: "Relaksujące oczyszczanie przed zabiegami - aromaterapia w salonie",
    fallbackPrice: "33 zł",
  },
  {
    handle: "mokosza-mydlo-rytualne",
    name: "Mokosza",
    subtitle: "Mydło rytualne z różą i glinką",
    useCase: "Delikatne złuszczanie z glinką różową i olejkiem różanym",
    fallbackPrice: "33 zł",
  },
]

const cooperationSteps = [
  {
    step: "01",
    title: "Skontaktuj się z nami",
    text: "Napisz lub zadzwoń - opowiedz nam o swoim salonie i potrzebach.",
  },
  {
    step: "02",
    title: "Dobierzemy ofertę",
    text: "Przygotujemy indywidualną ofertę produktową dopasowaną do profilu Twojego salonu.",
  },
  {
    step: "03",
    title: "Zamów i rozpocznij",
    text: "Realizujemy zamówienia hurtowe z atrakcyjnymi warunkami dla salonów.",
  },
]

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function SalonPage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  // Fetch salon-recommended products from Medusa
  const productMap: Record<string, any> = {}
  if (region) {
    try {
      const { response } = await listProducts({
        countryCode,
        queryParams: {
          handle: salonProducts.map((p) => p.handle),
          limit: salonProducts.length,
        },
      })
      for (const p of response.products) {
        if (p.handle) productMap[p.handle] = p
      }
    } catch {}
  }

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Lunula Botanique - Dla Salonów Kosmetycznych",
    description:
      "Naturalne kosmetyki Lunula Botanique dla profesjonalnych salonów kosmetycznych.",
    url: `${BASE_URL}/${countryCode}/dla-salonow`,
    publisher: {
      "@type": "Organization",
      name: "Lunula Botanique",
      url: BASE_URL,
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Beauty Salons",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <div className="bg-brand-background">
        {/* Hero */}
        <section className="py-20 small:py-32">
          <div className="content-container text-center max-w-3xl mx-auto">
            <AnimateIn variant="fade-in">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Dla Profesjonalistów
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={100}>
              <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-6">
                Naturalna pielęgnacja w&nbsp;Twoim salonie
              </h1>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={200}>
              <p className="text-brand-text-muted text-lg leading-relaxed mb-4">
                Wprowadź do swojego salonu kosmetyki, które naprawdę dbają o
                skórę. Lunula Botanique to biozgodna pielęgnacja oparta na
                naturalnych składnikach - bez kompromisów.
              </p>
              <p className="text-brand-text-muted text-base leading-relaxed">
                Twoje klientki szukają świadomej pielęgnacji. Daj im ją -
                z&nbsp;produktami, którym możesz zaufać.
              </p>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={300}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="mailto:kontakt@lunulaoil.pl?subject=Współpraca%20-%20salon%20kosmetyczny"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors duration-300 text-sm font-medium tracking-wide rounded-sm"
                >
                  Napisz do nas
                </a>
                <a
                  href="tel:+48509085064"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide rounded-sm"
                >
                  Zadzwoń: +48 509 085 064
                </a>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 small:py-24 bg-brand-surface">
          <div className="content-container">
            <AnimateIn variant="fade-in" className="text-center mb-16">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Dlaczego Lunula
              </span>
              <h2 className="text-2xl small:text-3xl font-heading text-brand-text mt-3">
                Co zyskuje Twój salon
              </h2>
            </AnimateIn>

            <div className="grid grid-cols-1 small:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((item, i) => (
                <AnimateIn
                  key={item.title}
                  variant="fade-up"
                  delay={i * 120}
                  duration={800}
                >
                  <div className="p-8 rounded-sm border border-brand-border">
                    <Icon
                      name={item.icon}
                      size={32}
                      className="mb-4 text-brand-accent"
                    />
                    <h3 className="text-brand-text text-lg font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-brand-text-muted text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Salon Price Table */}
        <section className="py-16 small:py-24">
          <div className="content-container">
            <AnimateIn variant="fade-in" className="text-center mb-12">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Cennik Salonowy
              </span>
              <h2 className="text-2xl small:text-3xl font-heading text-brand-text mt-3 mb-2">
                Specjalne ceny dla gabinetów
              </h2>
              <p className="text-brand-text-muted text-base max-w-2xl mx-auto">
                Atrakcyjne warunki cenowe dla profesjonalnych salonów
                kosmetycznych i SPA.
              </p>
            </AnimateIn>

            <AnimateIn variant="fade-up" delay={100}>
              <div className="max-w-3xl mx-auto">
                {priceTable.map((group) => (
                  <div key={group.category} className="mb-8 last:mb-0">
                    <h3 className="text-brand-accent text-xs tracking-[0.2em] uppercase font-medium mb-4 pb-2 border-b border-brand-border">
                      {group.category}
                    </h3>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between py-2 px-1"
                        >
                          <span className="text-brand-text text-sm">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-brand-text-muted/50 text-sm line-through">
                              {item.retail}
                            </span>
                            <span className="text-brand-accent text-sm font-semibold min-w-[60px] text-right">
                              {item.salon}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <p className="text-brand-text-muted/60 text-xs mt-8 text-center">
                  Ceny netto. Aby uzyskać dostęp do cen salonowych w&nbsp;sklepie
                  online, skontaktuj się z&nbsp;nami w&nbsp;celu założenia konta
                  B2B.
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Products for salons */}
        <section className="py-16 small:py-24 bg-brand-surface">
          <div className="content-container">
            <AnimateIn variant="fade-in" className="text-center mb-12">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Polecane Produkty
              </span>
              <h2 className="text-2xl small:text-3xl font-heading text-brand-text mt-3 mb-2">
                Idealne do zabiegów salonowych
              </h2>
              <p className="text-brand-text-muted text-base max-w-2xl mx-auto">
                Każdy produkt Lunula może być częścią profesjonalnego zabiegu.
                Oto nasze rekomendacje dla salonów.
              </p>
            </AnimateIn>

            <div className="space-y-6 max-w-4xl mx-auto">
              {salonProducts.map((config, i) => {
                const medusaProduct = productMap[config.handle]
                const variantId = medusaProduct?.variants?.[0]?.id || null
                let price = config.fallbackPrice
                if (medusaProduct) {
                  try {
                    const { cheapestPrice } = getProductPrice({
                      product: medusaProduct,
                    })
                    if (cheapestPrice?.calculated_price) {
                      price = cheapestPrice.calculated_price
                    }
                  } catch {}
                }
                const hasThumbnail = medusaProduct?.thumbnail

                return (
                  <AnimateIn
                    key={config.handle}
                    variant="fade-up"
                    delay={i * 100}
                  >
                    <div className="flex flex-col small:flex-row gap-6 p-6 border border-brand-border rounded-sm">
                      {/* Thumbnail */}
                      <div className="w-full small:w-32 h-32 shrink-0 rounded-sm overflow-hidden bg-brand-surface">
                        {hasThumbnail ? (
                          <Thumbnail
                            thumbnail={medusaProduct.thumbnail}
                            images={medusaProduct.images}
                            size="small"
                            className="!rounded-sm !shadow-none"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-brand-text-muted/30 text-xs">
                            ●
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col small:flex-row small:items-start small:justify-between gap-4">
                          <div>
                            <LocalizedClientLink
                              href={`/products/${config.handle}`}
                              className="text-brand-text text-lg font-heading font-semibold hover:text-brand-accent transition-colors"
                            >
                              {config.name}
                            </LocalizedClientLink>
                            <p className="text-brand-accent text-sm mt-0.5">
                              {config.subtitle}
                            </p>
                            <p className="text-brand-text-muted text-sm mt-2 leading-relaxed">
                              {config.useCase}
                            </p>
                          </div>
                          <div className="flex flex-col items-start small:items-end gap-2 shrink-0">
                            <span className="text-brand-primary text-lg font-semibold">
                              {price}
                            </span>
                            <AddToCartButton
                              variantId={variantId || ""}
                              disabled={!variantId}
                              className="px-5 py-2 rounded-sm text-xs font-medium transition-all duration-200 border inline-flex items-center justify-center gap-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                            <LocalizedClientLink
                              href={`/products/${config.handle}`}
                              className="text-brand-text-muted/60 text-xs hover:text-brand-accent transition-colors"
                            >
                              Zobacz w sklepie →
                            </LocalizedClientLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimateIn>
                )
              })}
            </div>
          </div>
        </section>

        {/* Cooperation steps */}
        <section className="py-16 small:py-24 bg-brand-surface">
          <div className="content-container">
            <AnimateIn variant="fade-in" className="text-center mb-16">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Współpraca
              </span>
              <h2 className="text-2xl small:text-3xl font-heading text-brand-text mt-3">
                Jak zacząć współpracę
              </h2>
            </AnimateIn>

            <div className="grid grid-cols-1 small:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {cooperationSteps.map((item, i) => (
                <AnimateIn
                  key={item.step}
                  variant="fade-up"
                  delay={i * 150}
                  duration={800}
                >
                  <div className="text-center p-8">
                    <span className="text-brand-accent text-4xl font-heading font-bold">
                      {item.step}
                    </span>
                    <h3 className="text-brand-text text-lg font-semibold mt-4 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-brand-text-muted text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="py-12">
          <div className="content-container">
            <AnimateIn variant="fade-up">
              <div className="flex flex-wrap items-center justify-center gap-8 text-brand-text-muted/70 text-xs tracking-wider uppercase">
                <span>100% Naturalnych Składników</span>
                <span className="w-px h-4 bg-brand-border" />
                <span>GMO Free</span>
                <span className="w-px h-4 bg-brand-border" />
                <span>Not Tested On Animals</span>
                <span className="w-px h-4 bg-brand-border" />
                <span>Vegan</span>
                <span className="w-px h-4 bg-brand-border" />
                <span>Handmade in Poland</span>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 small:py-24 bg-brand-surface">
          <div className="content-container text-center max-w-2xl mx-auto">
            <AnimateIn variant="fade-in">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Zacznijmy Razem
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={100}>
              <h2 className="text-2xl small:text-3xl font-heading text-brand-text mt-3 mb-4">
                Zainteresowana współpracą?
              </h2>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={200}>
              <p className="text-brand-text-muted text-base leading-relaxed mb-8">
                Napisz do nas - chętnie opowiemy o warunkach współpracy,
                przygotujemy próbki produktów i pomożemy dobrać asortyment
                idealny dla Twojego salonu.
              </p>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={300}>
              <div className="flex flex-col small:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:kontakt@lunulaoil.pl?subject=Współpraca%20-%20salon%20kosmetyczny"
                  className="inline-flex items-center gap-3 px-8 py-3 bg-brand-accent text-white hover:bg-brand-accent/90 transition-colors duration-300 text-sm font-medium tracking-wide rounded-sm"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  kontakt@lunulaoil.pl
                </a>
                <a
                  href="tel:+48509085064"
                  className="inline-flex items-center gap-3 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide rounded-sm"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +48 509 085 064
                </a>
              </div>
            </AnimateIn>
          </div>
        </section>
      </div>
    </>
  )
}
