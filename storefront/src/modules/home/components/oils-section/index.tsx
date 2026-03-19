import AnimateIn from "@modules/common/components/animate-in"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { StoreRegion } from "@medusajs/types"

type OilsSectionProps = {
  products: any[]
  region: StoreRegion
}

const OilsSection = ({ products, region }: OilsSectionProps) => {
  if (!products || products.length === 0) return null

  return (
    <section className="py-16 small:py-24 bg-brand-surface">
      <div className="content-container">
        <AnimateIn variant="fade-in" className="text-center mb-4">
          <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
            Oleje Lunula Oil
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} className="text-center mb-12">
          <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
            Linia olejków do pielęgnacji twarzy, ciała i włosów. Naturalne
            składniki aktywne wspierają regenerację i przywracają zdrowy blask.
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

        <AnimateIn variant="fade-up" delay={400} className="mt-10 text-center">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-8 py-3 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-black rounded-full text-sm font-medium transition-all duration-300"
          >
            Zobacz wszystkie produkty →
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default OilsSection
