import { Metadata } from "next"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

export const metadata: Metadata = {
  title: "O marce",
  description:
    "Lunula Botanique — biozgodna pielęgnacja twarzy i ciała. Poznaj naszą historię, filozofię i wartości.",
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
            <span className="text-brand-accent text-sm font-medium uppercase tracking-wider">
              O marce
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h1 className="text-3xl small:text-5xl font-serif font-semibold text-white mt-3 mb-6">
              Lunula Botanique
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-brand-text-muted text-lg small:text-xl max-w-2xl mx-auto leading-relaxed">
              Biozgodna pielęgnacja — powrót do natury.
              <br />
              By Lunula.
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
                    Lunula Botanique powstała z przekonania, że najlepsza
                    pielęgnacja jest zgodna z fizjologią skóry. Nie tworzę
                    kolejnej marki opartej na syntetycznych komponentach — buduję
                    koncepcję, która ma sens.
                  </p>
                  <p>
                    Starannie dobieram surowce kosmetyczne — naturalne oleje,
                    masła i zioła z najlepszych źródeł. Każdy produkt to efekt
                    długich poszukiwań idealnych składników i perfekcyjnych
                    proporcji.
                  </p>
                  <p>
                    Wszystkie produkty spełniają surowe normy mikrobiologiczne i
                    dermatologiczne. Są zarejestrowane w bazie CPNP oraz w
                    farmaceutycznej Bazie Leków i Środków Ochrony Zdrowia.
                  </p>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" delay={200}>
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/olejki-1.jpg"
                  alt="Produkty Lunula Botanique"
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
              Filozofia biozgodności
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-3 gap-10">
            {[
              {
                icon: "🌿",
                title: "Biozgodność",
                text: "Składniki rozpoznawalne przez skórę, które nie naruszają bariery hydrolipidowej i współpracują z naturalnym pH, mikrobiomem i lipidami.",
              },
              {
                icon: "✨",
                title: "Czystość",
                text: "Pielęgnacja powinna być tak czysta i bezpieczna, żeby można było ją zjeść. Bo wszystko, co nakładamy na skórę, przenika głębiej niż myślimy.",
              },
              {
                icon: "🌸",
                title: "Rytuał",
                text: "Pielęgnacja to nie obowiązek — to chwila dla siebie. Dotyk faktury, zapach ziół i chwila zatrzymania. Naturalna pielęgnacja to powrót do korzeni.",
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
                  src="/olejki-3.jpg"
                  alt="Składniki biozgodne"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" className="order-1 small:order-2">
              <div>
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  Biozgodna Pielęgnacja
                </span>
                <h2 className="text-2xl small:text-3xl font-serif text-white mt-3 mb-6">
                  Karmienie skóry tym, co ona już zna
                </h2>
                <div className="space-y-4 text-white/80 text-base leading-relaxed">
                  <p>
                    Biozgodna pielęgnacja twarzy to taka, która jest zgodna z
                    fizjologią skóry — wspiera jej naturalne procesy, zamiast je
                    zaburzać.
                  </p>
                  <p>
                    Składniki dobierane są celowo — tak, by wspierać, odżywiać
                    i przywracać równowagę. Efektem takiej pielęgnacji jest
                    cera, która odzyskuje blask, zdrowie, harmonię.
                  </p>
                  <p>
                    Inteligencja natury działa w harmonii z organizmem. Zero
                    przypadków. Pełna zgodność.
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
                    Oferujemy najwyższej jakości naturalne składniki i starannie
                    wyselekcjonowane surowce kosmetyczne. Unikalne formuły,
                    konsystencje i działanie składników aktywnych towarzyszą
                    codziennej pielęgnacji.
                  </p>
                </div>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-right" delay={200}>
              <div className="relative aspect-[4/3] max-h-[480px] rounded-large overflow-hidden">
                <Image
                  src="/olejki-2.jpg"
                  alt="Filozofia Lunula Botanique"
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
              Nasze linie
            </span>
            <h2 className="text-2xl small:text-3xl font-serif text-white mt-3">
              Trzy filary pielęgnacji
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 small:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <AnimateIn variant="fade-up" delay={0} duration={800}>
              <LocalizedClientLink
                href="/biozgodna-pielegnacja"
                className="block p-8 rounded-large border border-white/5 text-center hover:border-brand-accent/20 transition-colors"
              >
                <span className="text-3xl block mb-4">🧴</span>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Biozgodna Pielęgnacja
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  HialCode, SqualaneCode, JojobaCode — składniki, które skóra
                  rozumie.
                </p>
              </LocalizedClientLink>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={150} duration={800}>
              <LocalizedClientLink
                href="/mydla-rytualne"
                className="block p-8 rounded-large border border-white/5 text-center hover:border-brand-accent/20 transition-colors"
              >
                <span className="text-3xl block mb-4">🌿</span>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Mydła Rytualne
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Lunula Slavic Soap — roślinne oleje, masła i zioła w duchu
                  tradycji.
                </p>
              </LocalizedClientLink>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={300} duration={800}>
              <LocalizedClientLink
                href="/store"
                className="block p-8 rounded-large border border-white/5 text-center hover:border-brand-accent/20 transition-colors"
              >
                <span className="text-3xl block mb-4">✨</span>
                <h3 className="text-white text-lg font-semibold mb-3">
                  Oleje Lunula Oil
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Naturalne olejki do pielęgnacji twarzy, ciała i włosów.
                </p>
              </LocalizedClientLink>
            </AnimateIn>
          </div>

          <AnimateIn variant="fade-up" delay={300} className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/50 text-xs tracking-wider uppercase">
              <span>GMO Free</span>
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
              Dołącz do naszych warsztatów i poznaj tajniki biozgodnej
              pielęgnacji. Nauczysz się tworzyć własne rytuały dopasowane do
              potrzeb Twojej skóry.
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
                className="flex items-center gap-3 text-white/80 hover:text-brand-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                kontakt@lunulaoil.pl
              </a>
              <a
                href="tel:+48509085064"
                className="flex items-center gap-3 text-white/80 hover:text-brand-accent transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +48 509 085 064
              </a>
              <a
                href="https://www.instagram.com/lunulaoil/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-brand-accent transition-colors"
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
