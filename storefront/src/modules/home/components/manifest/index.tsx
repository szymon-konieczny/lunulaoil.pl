import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const Manifest = () => {
  return (
    <section className="py-20 small:py-32 bg-[#0A0A0A]">
      <div className="content-container max-w-3xl mx-auto text-center">
        <AnimateIn variant="fade-in">
          <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
            Manifest
          </span>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={100}>
          <h2 className="text-white text-2xl small:text-3xl font-heading font-semibold mt-6 mb-8 leading-relaxed">
            Nie tworzę kolejnej marki, której produkty różnią się jedynie
            opakowaniem i marketingiem.
          </h2>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={200}>
          <p className="text-white/70 text-lg leading-relaxed mb-4">
            Buduję koncepcję — coś, co ma sens.
          </p>
          <p className="text-white/70 text-lg leading-relaxed mb-4">
            Coś, co zmienia sposób myślenia o pielęgnacji.
          </p>
          <p className="text-white/50 text-base italic leading-relaxed mb-8">
            Bo kiedyś wiedzieliśmy więcej, niż wiemy dziś.
            Rozumieliśmy moc natury — i żyliśmy z nią w zgodzie.
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-up" delay={300}>
          <p className="text-brand-accent text-lg font-heading italic mb-8">
            „Minimalizm to nie brak — to wybór tego, co najważniejsze."
          </p>
        </AnimateIn>

        <AnimateIn variant="fade-in" delay={400}>
          <p className="text-white/40 text-sm tracking-wider uppercase mb-8">
            By Lunula
          </p>
        </AnimateIn>

        <AnimateIn variant="scale" delay={500}>
          <LocalizedClientLink
            href="/manifest"
            className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            Czytaj cały manifest →
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default Manifest
