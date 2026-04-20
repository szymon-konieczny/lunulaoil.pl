import { Metadata } from "next"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import Icon from "@modules/common/components/icon"
import ScrollDownButton from "@modules/common/components/scroll-down-button"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.about")
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default async function AboutPage() {
  const t = await getTranslations("pages.about")

  const values = [
    {
      icon: "herb",
      title: t("values.biocompatibility.title"),
      text: t("values.biocompatibility.text"),
    },
    {
      icon: "sparkle",
      title: t("values.purity.title"),
      text: t("values.purity.text"),
    },
    {
      icon: "flower",
      title: t("values.ritual.title"),
      text: t("values.ritual.text"),
    },
  ]

  const productLines = [
    {
      icon: "lotion",
      href: "/biozgodna-pielegnacja",
      title: t("productLines.biocare.title"),
      text: t("productLines.biocare.text"),
    },
    {
      icon: "herb",
      href: "/mydla-rytualne",
      title: t("productLines.soaps.title"),
      text: t("productLines.soaps.text"),
    },
    {
      icon: "sparkle",
      href: "/store",
      title: t("productLines.oils.title"),
      text: t("productLines.oils.text"),
    },
  ]

  return (
    <div className="bg-brand-background">
      {/* Hero */}
      <section className="relative h-[calc(100dvh-4rem)] small:h-[calc(100dvh-5rem)] flex items-center overflow-hidden">
        <Image
          src="/about-hero.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="content-container text-center relative z-10">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm font-medium uppercase tracking-wider">
              {t("hero.subtitle")}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h1 className="text-3xl small:text-5xl font-serif font-semibold text-white mt-3 mb-6">
              Lunula Botanique
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-white/80 text-lg small:text-xl max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
              <br />
              {t("hero.descriptionLine2")}
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={300}>
            <ScrollDownButton />
          </AnimateIn>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 small:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16 items-center">
            <AnimateIn variant="fade-left">
              <div>
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  {t("story.subtitle")}
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3 mb-6">
                  {t("story.title")}
                </h2>
                <div className="space-y-4 text-brand-text-muted text-base leading-relaxed">
                  <p>{t("story.p1")}</p>
                  <p>{t("story.p2")}</p>
                  <p>{t("story.p3")}</p>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" delay={200}>
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/lunula-lab-1.jpeg"
                  alt={t("story.imageAlt")}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <AnimateIn variant="fade-in" className="text-center mb-16">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              {t("values.subtitle")}
            </span>
            <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3">
              {t("values.title")}
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-3 gap-10">
            {values.map((item, i) => (
              <AnimateIn
                key={item.title}
                variant="fade-up"
                delay={i * 150}
                duration={800}
              >
                <div className="text-center p-6 rounded-large border border-brand-border">
                  <Icon name={item.icon} size={36} className="mx-auto mb-4" />
                  <h3 className="text-brand-text text-lg font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-brand-text-muted text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Biocare explanation */}
      <section className="py-16 small:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16 items-center">
            <AnimateIn
              variant="fade-left"
              delay={200}
              className="order-2 small:order-1"
            >
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/lunula-lab-2.jpeg"
                  alt={t("biocare.imageAlt")}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" className="order-1 small:order-2">
              <div>
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  {t("biocare.subtitle")}
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3 mb-6">
                  {t("biocare.title")}
                </h2>
                <div className="space-y-4 text-brand-text-muted text-base leading-relaxed">
                  <p>{t("biocare.p1")}</p>
                  <p>{t("biocare.p2")}</p>
                  <p>{t("biocare.p3")}</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Philosophy - Lunula symbol */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16 items-center">
            <AnimateIn variant="fade-left">
              <div>
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  {t("philosophy.subtitle")}
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3 mb-6">
                  {t("philosophy.title")}
                </h2>
                <div className="space-y-4 text-brand-text-muted text-base leading-relaxed">
                  <p>{t("philosophy.p1")}</p>
                  <p>{t("philosophy.p2")}</p>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" delay={200}>
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/lunula-lab-3.jpeg"
                  alt={t("philosophy.imageAlt")}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Product lines */}
      <section className="py-16 small:py-24">
        <div className="content-container">
          <AnimateIn variant="fade-in" className="text-center mb-12">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              {t("productLines.subtitle")}
            </span>
            <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3">
              {t("productLines.title")}
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {productLines.map((item, i) => (
              <AnimateIn
                key={item.href}
                variant="fade-up"
                delay={i * 150}
                duration={800}
              >
                <LocalizedClientLink
                  href={item.href}
                  className="block p-8 rounded-large border border-brand-border text-center hover:border-brand-accent/20 transition-colors"
                >
                  <Icon name={item.icon} size={36} className="mx-auto mb-4" />
                  <h3 className="text-brand-text text-lg font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-brand-text-muted text-sm leading-relaxed">
                    {item.text}
                  </p>
                </LocalizedClientLink>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn variant="fade-up" delay={300} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-brand-text-muted/70 text-xs tracking-wider uppercase">
              <span>GMO Free</span>
              <span className="w-px h-4 bg-brand-border" />
              <span>Vegan</span>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Workshops CTA */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container text-center">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              {t("workshops.subtitle")}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3 mb-4">
              {t("workshops.title")}
            </h2>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-brand-text-muted text-base leading-relaxed max-w-xl mx-auto mb-8">
              {t("workshops.description")}
            </p>
          </AnimateIn>
          <AnimateIn variant="scale" delay={300}>
            <LocalizedClientLink
              href="/categories/warsztaty"
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              {t("workshops.cta")}
            </LocalizedClientLink>
          </AnimateIn>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 small:py-24">
        <div className="content-container text-center">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              {t("contact.subtitle")}
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h2 className="text-2xl small:text-3xl font-serif text-brand-text mt-3 mb-8">
              {t("contact.title")}
            </h2>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <div className="flex flex-col small:flex-row items-center justify-center gap-8">
              <a
                href="mailto:kontakt@lunulaoil.pl"
                className="flex items-center gap-3 text-brand-text-muted hover:text-brand-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                kontakt@lunulaoil.pl
              </a>
              <a
                href="tel:+48509085064"
                className="flex items-center gap-3 text-brand-text-muted hover:text-brand-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +48 509 085 064
              </a>
              <a
                href="https://www.instagram.com/lunula_slow_care"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brand-text-muted hover:text-brand-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @lunulaoil
              </a>
              <a
                href="https://www.tiktok.com/@lunulaslowcare"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-brand-text-muted hover:text-brand-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.17v-3.45a4.85 4.85 0 01-3.77-1.46V6.69h3.77z"/></svg>
                @lunulaslowcare
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
