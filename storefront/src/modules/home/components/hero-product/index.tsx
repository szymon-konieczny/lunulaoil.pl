import AnimateIn from "@modules/common/components/animate-in"

const HeroProduct = () => {
  return (
    <section className="py-16 small:py-24 bg-brand-background">
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-12 items-center">
          <AnimateIn variant="fade-left">
            {/* Placeholder for product image */}
            <div className="relative aspect-square bg-brand-surface rounded-sm flex items-center justify-center border border-brand-border">
              <div className="text-center">
                <span className="text-5xl block mb-4">🌿</span>
                <p className="text-brand-text-muted/60 text-sm tracking-wider uppercase">
                  Zdjęcie wkrótce
                </p>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn variant="fade-right" delay={200}>
            <div>
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Lunula Botanique
              </span>
              <h2 className="text-brand-text text-3xl small:text-4xl font-heading font-bold mt-3 mb-6">
                Kremy Rytualne
              </h2>
              <p className="text-brand-text-muted text-base leading-relaxed mb-6">
                Rytualna pielęgnacja w zgodzie z naturą skóry. Biozgodna
                formuła, która karmi skórę tym, co już zna — przywracając
                jej blask, zdrowie i harmonię.
              </p>
              <p className="text-brand-primary text-sm font-medium tracking-wider uppercase">
                Wkrótce w ofercie
              </p>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}

export default HeroProduct
