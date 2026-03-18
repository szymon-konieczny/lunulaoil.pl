import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CtaSamples = () => {
  return (
    <section className="py-16 small:py-24 bg-brand-surface">
      <div className="content-container flex flex-col small:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-white text-3xl small:text-4xl font-heading font-bold leading-tight">
            Wypróbuj nasze olejki
          </h2>
          <p className="text-white/80 text-base leading-relaxed max-w-lg">
            Nie wiesz, który olejek wybrać? Zamów zestaw próbek — sześć
            miniaturek naszych najpopularniejszych olejków, dzięki którym
            odkryjesz swój ulubiony zapach i formułę.
          </p>
          <div className="flex flex-wrap gap-4">
            <LocalizedClientLink
              href="/products/zestaw-probek"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-accent text-black hover:bg-brand-accent/80 transition-colors duration-300 text-sm font-medium tracking-wide w-fit"
            >
              Zamów zestaw próbek
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-colors duration-300 text-sm font-medium tracking-wide w-fit"
            >
              Więcej o marce
            </LocalizedClientLink>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image
            src="/zestaw-probek.png"
            alt="Zestaw próbek Lunula Oil"
            width={1024}
            height={598}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
}

export default CtaSamples
