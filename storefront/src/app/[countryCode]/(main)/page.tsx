import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import WhyUs from "@modules/home/components/why-us"
import CtaSamples from "@modules/home/components/cta-samples"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

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

  return (
    <>
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
