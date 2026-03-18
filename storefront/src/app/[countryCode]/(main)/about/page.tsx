import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
        <div className="content-container text-center">
          <span className="text-brand-primary text-sm font-medium uppercase tracking-wider">
            O marce
          </span>
          <h1 className="text-3xl small:text-5xl font-serif font-semibold text-white mt-3 mb-6">
            Lunula Oil & More
          </h1>
          <p className="text-brand-text-muted text-lg small:text-xl max-w-2xl mx-auto leading-relaxed">
            Naturalna pielęgnacja tworzona z pasją.
            <br />
            Slow care dla Twojej skóry.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 small:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16 items-center">
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
            <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
              <Image
                src="/olejki-1.jpg"
                alt="Olejki Lunula Oil"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <div className="text-center mb-16">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Nasze wartości
            </span>
            <h2 className="text-2xl small:text-3xl font-serif text-white mt-3">
              Filozofia Slow Care
            </h2>
          </div>

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
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-large border border-white/5"
              >
                <span className="text-3xl block mb-4">{item.icon}</span>
                <h3 className="text-white text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients origin */}
      <section className="py-16 small:py-24">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 small:gap-16 items-center">
            <div className="order-2 small:order-1 relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
              <Image
                src="/olejki-3.jpg"
                alt="Składniki z Maroka, Hiszpanii i Francji"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 small:order-2">
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
          </div>
        </div>
      </section>

      {/* Workshops CTA */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container text-center">
          <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
            Warsztaty
          </span>
          <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-4">
            Slow Care na żywo
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto mb-8">
            Dołącz do naszych warsztatów i poznaj tajniki naturalnej
            pielęgnacji. Nauczysz się tworzyć własne rytuały z olejkami
            Lunula Oil, dopasowane do potrzeb Twojej skóry.
          </p>
          <LocalizedClientLink
            href="/categories/warsztaty"
            className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            Sprawdź warsztaty
          </LocalizedClientLink>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 small:py-24">
        <div className="content-container text-center">
          <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
            Kontakt
          </span>
          <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-8">
            Porozmawiajmy
          </h2>
          <div className="flex flex-col small:flex-row items-center justify-center gap-8">
            <a
              href="mailto:kontakt@lunulaoil.pl"
              className="flex items-center gap-3 text-white/80 hover:text-brand-primary transition-colors"
            >
              <span className="text-xl">📧</span>
              kontakt@lunulaoil.pl
            </a>
            <a
              href="tel:+48509085064"
              className="flex items-center gap-3 text-white/80 hover:text-brand-primary transition-colors"
            >
              <span className="text-xl">📞</span>
              +48 509 085 064
            </a>
            <a
              href="https://www.instagram.com/lunulaoil/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-brand-primary transition-colors"
            >
              <span className="text-xl">📸</span>
              @lunulaoil
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
