import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CtaQuiz = () => {
  return (
    <section className="py-16 small:py-24 bg-brand-background">
      <div className="content-container text-center">
        <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
          Asystent doboru
        </span>
        <h2 className="text-white text-3xl small:text-4xl font-heading font-bold leading-tight mt-4 mb-4">
          Nie wiesz, który olejek wybrać?
        </h2>
        <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto mb-8">
          Odpowiedz na kilka pytań o swoją skórę i potrzeby, a nasz asystent
          dobierze idealne produkty specjalnie dla Ciebie.
        </p>
        <LocalizedClientLink
          href="/quiz"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-black hover:bg-brand-accent-light transition-colors duration-300 text-sm font-semibold tracking-wide"
        >
          Rozpocznij quiz
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default CtaQuiz
