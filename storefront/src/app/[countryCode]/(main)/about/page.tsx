import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

export const metadata: Metadata = {
  title: "O marce",
  description:
    "Lunula Oil & More — naturalne olejki BIO z Maroka, Hiszpanii i Francji. Poznaj naszą historię, filozofię i wartości.",
}

export default function AboutPage() {
  return (
    <div className="bg-brand-background">
      {/* Hero */}
      <section className="relative py-20 small:py-32">
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
            <span className="text-brand-primary text-sm font-medium uppercase tracking-wider">
              O marce
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h1 className="text-3xl small:text-5xl font-serif font-semibold text-white mt-3 mb-6">
              Lunula Oil & More
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-brand-text-muted text-lg small:text-xl max-w-2xl mx-auto leading-relaxed">
              Naturalna pielęgnacja tworzona z pasją.
              <br />
              Slow care dla Twojej skóry.
            </p>
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
                  Nasza historia
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-6">
                  Z miłości do natury
                </h2>
                <div className="space-y-4 text-white/80 text-base leading-relaxed">
                  <p>
                    Lunula Oil powstała z przekonania, że najlepsza pielęgnacja
                    pochodzi prosto z natury. Starannie dobieramy surowce
                    kosmetyczne z Maroka, Hiszpanii i Francji — krajów słynących
                    z wielowiekowej tradycji wytwarzania olejków roślinnych.
                  </p>
                  <p>
                    Każdy produkt Lunula Oil to efekt długich poszukiwań idealnych
                    składników i perfekcyjnych proporcji. Łączymy wiedzę o
                    naturalnych metodach pielęgnacji z nowoczesnymi standardami
                    bezpieczeństwa i jakości.
                  </p>
                  <p>
                    Wszystkie nasze produkty spełniają surowe normy
                    mikrobiologiczne i dermatologiczne. Są zarejestrowane w bazie
                    CPNP oraz w farmaceutycznej Bazie Leków i Środków Ochrony
                    Zdrowia.
                  </p>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" delay={200}>
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/olejki-1.jpg"
                  alt="Olejki Lunula Oil"
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
              Nasze wartości
            </span>
            <h2 className="text-2xl small:text-3xl font-serif text-white mt-3">
              Filozofia Slow Care
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-3 gap-10">
            {[
              {
                icon: "🌿",
                title: "Naturalność",
                text: "Używamy wyłącznie naturalnych, starannie wyselekcjonowanych składników. Bez alkoholu, parabenów, parafiny i silikonów. Każdy olejek to czysta moc natury.",
              },
              {
                icon: "✨",
                title: "Jakość",
                text: "Olejki tłoczone na zimno zachowują pełnię składników odżywczych. Witaminy A, E, B i D, nienasycone kwasy tłuszczowe i antyoksydanty w każdej kropli.",
              },
              {
                icon: "🌸",
                title: "Rytuał",
                text: "Pielęgnacja to nie obowiązek — to chwila dla siebie. Nasze kompozycje zapachowe z naturalnych olejków eterycznych zamieniają codzienny rytuał w aromaterapię.",
              },
            ].map((item, i) => (
              <AnimateIn
                key={item.title}
                variant="fade-up"
                delay={i * 150}
                duration={800}
              >
                <div className="text-center p-6 rounded-large border border-white/5">
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="text-white text-lg font-semibold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients origin */}
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
                  src="/olejki-3.jpg"
                  alt="Składniki z Maroka, Hiszpanii i Francji"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" className="order-1 small:order-2">
              <div>
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  Pochodzenie
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-6">
                  Maroko, Hiszpania, Francja
                </h2>
                <div className="space-y-4 text-white/80 text-base leading-relaxed">
                  <p>
                    Nasze surowce pochodzą z regionów słynących z najwyższej
                    jakości olejków roślinnych. Olej arganowy z Maroka, oliwa z
                    Hiszpanii, olejki eteryczne z Prowansji — każdy składnik ma
                    swoją historię i wielowiekową tradycję.
                  </p>
                  <p>
                    Współpracujemy bezpośrednio z lokalnymi producentami, dbając
                    o etyczne pozyskiwanie surowców i wspieranie społeczności
                    lokalnych. Dzięki temu gwarantujemy autentyczność i najwyższą
                    jakość każdego produktu.
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Philosophy — Lunula symbol */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16 items-center">
            <AnimateIn variant="fade-left">
              <div>
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  Filozofia
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-6">
                  Symbol Lunuli
                </h2>
                <div className="space-y-4 text-white/80 text-base leading-relaxed">
                  <p>
                    Lunula to symbol energii, jaką niesie ze sobą Księżyc — jego
                    majestat, słowiańskie korzenie i pełnia kobiecości. To właśnie
                    ta idea przyświeca każdemu naszemu produktowi.
                  </p>
                  <p>
                    Oferujemy najwyższej jakości naturalne olejki i starannie
                    wyselekcjonowane surowce kosmetyczne z Maroka, Hiszpanii i
                    Francji. Unikalne aromaty, konsystencje i działanie składników
                    aktywnych towarzyszą codziennej pielęgnacji.
                  </p>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" delay={200}>
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/olejki-2.jpg"
                  alt="Filozofia Lunula Oil"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Product formats */}
      <section className="py-16 small:py-24">
        <div className="content-container">
          <AnimateIn variant="fade-in" className="text-center mb-12">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Nasze produkty
            </span>
            <h2 className="text-2xl small:text-3xl font-serif text-white mt-3">
              Dwa formaty, jeden standard
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <AnimateIn variant="fade-up" delay={0} duration={800}>
              <div className="p-8 rounded-large border border-white/5 text-center">
                <span className="text-4xl block mb-4">250 ml</span>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Pielęgnacja ciała
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Format idealny do masażu, pielęgnacji ciała i włosów.
                  Doskonałe właściwości poślizgowe, lekka konsystencja i
                  piękny zapach towarzyszący codziennym rytuałom.
                </p>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={150} duration={800}>
              <div className="p-8 rounded-large border border-white/5 text-center">
                <span className="text-4xl block mb-4">30 ml</span>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Luksusowa pielęgnacja twarzy
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Wyższa zawartość polifenoli zapewnia silne działanie
                  antyoksydacyjne i anti-aging. Skoncentrowana formuła
                  stworzona specjalnie do pielęgnacji skóry twarzy.
                </p>
              </div>
            </AnimateIn>
          </div>

          <AnimateIn variant="fade-up" delay={300} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/50 text-xs tracking-wider uppercase">
              <span>GMO Free</span>
              <span className="w-px h-4 bg-white/20" />
              <span>Organic Certified</span>
              <span className="w-px h-4 bg-white/20" />
              <span>Not Tested On Animals</span>
              <span className="w-px h-4 bg-white/20" />
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
              Warsztaty
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-4">
              Slow Care na żywo
            </h2>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto mb-8">
              Dołącz do naszych warsztatów i poznaj tajniki naturalnej
              pielęgnacji. Nauczysz się tworzyć własne rytuały z olejkami
              Lunula Oil, dopasowane do potrzeb Twojej skóry.
            </p>
          </AnimateIn>
          <AnimateIn variant="scale" delay={300}>
            <LocalizedClientLink
              href="/categories/warsztaty"
              className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              Sprawdź warsztaty
            </LocalizedClientLink>
          </AnimateIn>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 small:py-24">
        <div className="content-container text-center">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Kontakt
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-8">
              Porozmawiajmy
            </h2>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <div className="flex flex-col small:flex-row items-center justify-center gap-8">
              <a
                href="mailto:kontakt@lunulaoil.pl"
                className="flex items-center gap-3 text-white/80 hover:text-brand-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                kontakt@lunulaoil.pl
              </a>
              <a
                href="tel:+48509085064"
                className="flex items-center gap-3 text-white/80 hover:text-brand-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +48 509 085 064
              </a>
              <a
                href="https://www.instagram.com/lunulaoil/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-brand-primary transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @lunulaoil
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
