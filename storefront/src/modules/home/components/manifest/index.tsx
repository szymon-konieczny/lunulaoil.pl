import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const Manifest = () => {
  return (
    <section className="py-24 small:py-40 bg-[#0A0A0A] scroll-mt-24">
      <div className="content-container max-w-2xl mx-auto text-center">
        <AnimateIn variant="fade-in">
          <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
            Manifest
          </span>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={100}>
          <h2 className="text-white text-2xl small:text-3xl font-heading font-normal mt-8 mb-10 leading-relaxed">
            Nie tworzę kolejnej marki, której produkty różnią się jedynie
            opakowaniem i marketingiem.
          </h2>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={200}>
          <div className="space-y-5 mb-10">
            <p className="text-white/60 text-lg leading-relaxed">
              Buduję koncepcję — coś, co ma sens.
            </p>
            <p className="text-white/60 text-lg leading-relaxed">
              Coś, co zmienia sposób myślenia o pielęgnacji.
            </p>
          </div>
          <p className="text-white/60 text-base italic leading-relaxed mb-12">
            Bo kiedyś wiedzieliśmy więcej, niż wiemy dziś.
            Rozumieliśmy moc natury — i żyliśmy z nią w zgodzie.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={300}>
          <blockquote className="text-brand-accent text-lg small:text-xl font-heading italic mb-10 px-4">
            „Minimalizm to nie brak — to wybór tego, co najważniejsze."
          </blockquote>
        </AnimateIn>

        <AnimateIn variant="fade-in" delay={400}>
          <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-10">
            By Lunula
          </p>
        </AnimateIn>

        <AnimateIn variant="scale" delay={500}>
          <LocalizedClientLink
            href="/manifest"
            className="inline-flex items-center gap-2 px-10 py-3.5 border border-white/30 text-white/80 hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all duration-300 text-xs tracking-[0.15em] uppercase"
          >
            Czytaj cały manifest
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default Manifest
