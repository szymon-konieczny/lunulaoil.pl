import Image from "next/image"
import AnimateIn from "@modules/common/components/animate-in"

const HeroProduct = () => {
  return (
    <section className="py-20 small:py-32 bg-brand-background">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-20 items-center max-w-5xl mx-auto">
          <AnimateIn variant="fade-left">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src="/products/krem-rytualne-placeholder.svg"
                alt="Kremy Rytualne"
                fill
                className="object-cover"
              />
            </div>
          </AnimateIn>

          <AnimateIn variant="fade-right" delay={200}>
            <div>
              <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
                Lunula Botanique
              </span>
              <h2 className="text-brand-text text-3xl small:text-4xl font-heading font-normal mt-4 mb-8 leading-snug">
                Kremy Rytualne
              </h2>
              <p className="text-brand-text-muted text-base leading-[1.8] mb-8">
                Rytualna pielęgnacja w zgodzie z naturą skóry. Biozgodna
                formuła, która karmi skórę tym, co już zna — przywracając
                jej blask, zdrowie i harmonię.
              </p>
              <span className="text-brand-accent text-xs tracking-[0.2em] uppercase font-medium">
                Wkrótce w ofercie
              </span>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

export default HeroProduct
