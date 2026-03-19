import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const CtaQuiz = () => {
  return (
    <section className="py-24 small:py-36 bg-[#0A0A0A]">
      <div className="content-container text-center max-w-2xl mx-auto">
        <AnimateIn variant="fade-in">
          <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
            Asystent doboru
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100}>
          <h2 className="text-white text-3xl small:text-4xl font-heading font-normal leading-snug mt-6 mb-6">
            Nie wiesz, który produkt wybrać?
          </h2>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={200}>
          <p className="text-white/50 text-base leading-[1.8] max-w-lg mx-auto mb-10">
            Odpowiedz na kilka pytań o swoją skórę i potrzeby, a nasz asystent
            dobierze idealne produkty Lunula Botanique specjalnie dla Ciebie.
          </p>
        </AnimateIn>
        <AnimateIn variant="scale" delay={300}>
          <LocalizedClientLink
            href="/quiz?reset=1"
            className="inline-flex items-center gap-2 px-10 py-3.5 bg-brand-accent text-white hover:bg-brand-accent-light transition-colors duration-300 text-xs tracking-[0.15em] uppercase font-medium"
          >
            Rozpocznij quiz
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default CtaQuiz
