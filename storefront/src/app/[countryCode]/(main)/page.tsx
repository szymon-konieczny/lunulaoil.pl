import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Manifest from "@modules/home/components/manifest"
import HeroProduct from "@modules/home/components/hero-product"
import BiocareSection from "@modules/home/components/biocare-section"
import SlavicSoap from "@modules/home/components/slavic-soap"
import OilsSection from "@modules/home/components/oils-section"
import CtaQuiz from "@modules/home/components/cta-quiz"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lunulaoil.pl"

export const metadata: Metadata = {
  title: "Lunula Botanique — biozgodna pielęgnacja",
  description:
    "Biozgodna pielęgnacja twarzy i ciała. Składniki rozpoznawalne przez skórę, w harmonii z jej naturalnymi procesami.",
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
    name: "Lunula Botanique",
    url: BASE_URL,
    logo: `${BASE_URL}/logo-botanique.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+48-509-085-064",
      email: "kontakt@lunulaoil.pl",
      contactType: "customer service",
      availableLanguage: "Polish",
    },
    sameAs: ["https://www.instagram.com/lunula_slow_care"],
  }

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Lunula Botanique",
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
      <Manifest />
      <HeroProduct />
      <BiocareSection />
      <SlavicSoap />
      <OilsSection products={products} region={region} />
      <CtaQuiz />
    </>
  )
}
