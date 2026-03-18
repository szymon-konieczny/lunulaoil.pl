import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import WhyUs from "@modules/home/components/why-us"
import CtaSamples from "@modules/home/components/cta-samples"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

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

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

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
      <CtaSamples />
      <div className="py-16 small:py-24 bg-brand-background">
        <div className="content-container mb-12">
          <h2 className="text-center text-brand-accent text-sm tracking-[0.3em] uppercase font-medium mb-4">
            Nasze produkty
          </h2>
          <p className="text-center text-white/60 text-base">
            Odkryj pełną gamę olejków Lunula Oil
          </p>
        </div>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
