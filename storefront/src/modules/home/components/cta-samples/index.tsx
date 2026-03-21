import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const CtaSamples = () => {
  return (
    <section className="py-20 small:py-32 bg-brand-background">
      <div className="content-container flex flex-col small:flex-row items-center gap-16 small:gap-20 max-w-5xl mx-auto">
        <AnimateIn variant="fade-left" className="flex-1 flex flex-col gap-6">
          <h2 className="text-brand-text text-3xl small:text-4xl font-heading font-normal leading-snug">
            Wypróbuj nasze olejki
          </h2>
          <p className="text-brand-text-muted text-base leading-[1.8] max-w-md">
            Nie wiesz, który olejek wybrać? Zamów zestaw próbek - sześć
            miniaturek naszych najpopularniejszych olejków, dzięki którym
            odkryjesz swój ulubiony zapach i formułę.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <LocalizedClientLink
              href="/products/zestaw-probek"
              className="inline-flex items-center gap-2 px-10 py-3.5 bg-brand-accent text-white hover:bg-brand-accent/85 transition-colors duration-300 text-xs tracking-[0.15em] uppercase font-medium w-fit"
            >
              Zamów zestaw próbek
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/about"
              className="inline-flex items-center gap-2 px-10 py-3.5 border border-brand-border text-brand-text-muted hover:border-brand-accent hover:text-brand-accent transition-all duration-300 text-xs tracking-[0.15em] uppercase w-fit"
            >
              Więcej o marce
            </LocalizedClientLink>
          </div>
        </AnimateIn>

        <AnimateIn variant="fade-right" delay={200} className="flex-1 relative">
          <Image
            src="/zestaw-probek.png"
            alt="Zestaw próbek Lunula Oil"
            width={1024}
            height={598}
            className="w-full h-auto"
          />
        </AnimateIn>
      </div>
    </section>
  )
}

export default CtaSamples
