import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import WhyUs from "@modules/home/components/why-us"
import CtaSamples from "@modules/home/components/cta-samples"
import CtaQuiz from "@modules/home/components/cta-quiz"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export const metadata: Metadata = {
  title: "Lunula Oil & More — BIO olejki i naturalna pielęgnacja",
  description:
    "Linia luksusowych olejków do masażu i pielęgnacji twarzy, ciała i włosów. Naturalne rytuały dla Twojej skóry.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Fetch latest products directly (no dependency on collections)
  let products: any[] = []
  try {
    const result = await listProducts({
      countryCode,
      queryParams: { limit: 8, order: "-created_at" },
    })
    products = result.response.products
  } catch {}

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lunula Oil & More",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+48-509-085-064",
      email: "kontakt@lunulaoil.pl",
      contactType: "customer service",
      availableLanguage: "Polish",
    },
    sameAs: ["https://www.instagram.com/lunulaoil/"],
  }

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lunula Oil & More",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/${countryCode}/store?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <Hero />
      <WhyUs />
      <CtaQuiz />
      <CtaSamples />
      {products.length > 0 && (
        <div className="py-16 small:py-24 bg-brand-background">
          <div className="content-container">
            <AnimateIn variant="fade-in" className="mb-12 text-center">
              <h2 className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium mb-4">
                Nasze produkty
              </h2>
              <p className="text-white/60 text-base">
                Odkryj pełną gamę kosmetyków Lunula Botanique
              </p>
            </AnimateIn>
            <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
              {products.map((product, i) => (
                <AnimateIn
                  key={product.id}
                  as="li"
                  variant="fade-up"
                  delay={i * 80}
                  duration={600}
                >
                  <ProductPreview product={product} region={region} />
                </AnimateIn>
              ))}
            </ul>
            <AnimateIn variant="fade-up" delay={400} className="mt-12 text-center">
              <LocalizedClientLink
                href="/store"
                className="inline-block px-8 py-3 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-black rounded-full text-sm font-medium transition-all duration-300"
              >
                Zobacz wszystkie produkty →
              </LocalizedClientLink>
            </AnimateIn>
          </div>
        </div>
      )}
    </>
  )
}
