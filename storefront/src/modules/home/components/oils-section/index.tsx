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
    <section className="py-20 small:py-32 bg-brand-surface">
      <div className="content-container">
        <AnimateIn variant="fade-in" className="text-center mb-4">
          <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
            Oleje Lunula Oil
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} className="text-center mb-16">
          <p className="text-brand-text-muted text-base max-w-xl mx-auto leading-[1.8]">
            Linia olejków do pielęgnacji twarzy, ciała i włosów. Naturalne
            składniki aktywne wspierają regenerację i przywracają zdrowy blask.
          </p>
        </AnimateIn>

        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-8 gap-y-10">
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

        <AnimateIn variant="fade-up" delay={400} className="mt-14 text-center">
          <LocalizedClientLink
            href="/store"
            className="inline-flex items-center gap-2 px-10 py-3.5 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white text-xs tracking-[0.15em] uppercase transition-colors duration-300"
          >
            Zobacz wszystkie produkty
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default OilsSection
