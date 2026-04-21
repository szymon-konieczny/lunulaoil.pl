import { Metadata } from "next"
import Image from "next/image"
import AnimateIn from "@modules/common/components/animate-in"
import ScrollToButton from "@modules/common/components/scroll-to-button"

export const metadata: Metadata = {
  title: "Manifest",
  description:
    "Manifest Lunula Botanique - filozofia biozgodnej pielęgnacji. By Lunula.",
}

export default function ManifestPage() {
  return (
    <div className="bg-brand-background">
      {/* Editorial hero — image right-aligned, text overflowing on the left */}
      <section className="relative w-full overflow-hidden bg-brand-background">
        {/* Desktop: full portrait image on the right, text overlaid on the left */}
        <div className="hidden small:flex h-[calc(100dvh-5rem)] justify-end items-stretch">
          <div className="relative h-full aspect-[2/3] flex-shrink-0">
            <Image
              src="/manifest-forest.jpeg"
              alt="Lunula Botanique — powrót do natury"
              fill
              priority
              sizes="66vh"
              className="object-cover"
            />
            {/* Soft gradient on left edge to keep overlapping text readable */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-brand-background/80 via-brand-background/20 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Text overlay — absolute on desktop, flows over image's left edge */}
        <div className="hidden small:flex absolute inset-0 items-center pointer-events-none h-[calc(100dvh-5rem)]">
          <div className="content-container">
            <div className="max-w-xl pointer-events-auto">
              <AnimateIn variant="fade-in">
                <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                  Filozofia marki
                </span>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={150}>
                <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-6">
                  Manifest
                </h1>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={300}>
                <p className="text-brand-text-muted text-lg italic font-heading leading-relaxed">
                  Bo kiedyś wiedzieliśmy więcej, niż wiemy dziś.
                  <br />
                  Rozumieliśmy moc natury — i żyliśmy z nią w zgodzie.
                </p>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={450}>
                <div className="mt-10 flex items-center gap-4">
                  <span className="w-10 h-px bg-brand-accent" />
                  <span className="text-brand-text-muted text-xs tracking-[0.4em] uppercase">
                    By Lunula
                  </span>
                </div>
              </AnimateIn>
              <AnimateIn variant="fade-up" delay={600}>
                <ScrollToButton
                  targetId="manifest-content"
                  className="group mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-brand-accent text-brand-accent text-xs tracking-[0.3em] uppercase hover:bg-brand-accent hover:text-white transition-all duration-300"
                >
                  <span>Odkryj więcej</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 14l-7 7-7-7M19 5l-7 7-7-7"
                    />
                  </svg>
                </ScrollToButton>
              </AnimateIn>
            </div>
          </div>
        </div>

        {/* Mobile: stacked — image on top, text below */}
        <div className="small:hidden">
          <div className="relative w-full aspect-[2/3] max-h-[80dvh]">
            <Image
              src="/manifest-forest.jpeg"
              alt="Lunula Botanique — powrót do natury"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="content-container py-12">
            <AnimateIn variant="fade-in">
              <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
                Filozofia marki
              </span>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={150}>
              <h1 className="text-3xl font-heading font-bold text-brand-text mt-4 mb-6">
                Manifest
              </h1>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={300}>
              <p className="text-brand-text-muted text-base italic font-heading leading-relaxed">
                Bo kiedyś wiedzieliśmy więcej, niż wiemy dziś.
                <br />
                Rozumieliśmy moc natury — i żyliśmy z nią w zgodzie.
              </p>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={450}>
              <div className="mt-8 flex items-center gap-4">
                <span className="w-10 h-px bg-brand-accent" />
                <span className="text-brand-text-muted text-xs tracking-[0.4em] uppercase">
                  By Lunula
                </span>
              </div>
            </AnimateIn>
            <AnimateIn variant="fade-up" delay={600}>
              <ScrollToButton
                targetId="manifest-content"
                className="group mt-10 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-brand-accent text-brand-accent text-xs tracking-[0.3em] uppercase hover:bg-brand-accent hover:text-white transition-all duration-300"
              >
                <span>Odkryj więcej</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 14l-7 7-7-7M19 5l-7 7-7-7"
                  />
                </svg>
              </ScrollToButton>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Content sections with workshop image as parallax background */}
      <div
        id="manifest-content"
        className="relative bg-cover bg-center bg-scroll small:bg-fixed scroll-mt-20"
        style={{ backgroundImage: "url('/manifest-workshop.jpeg')" }}
      >
        {/* Very subtle global tint to unify the image with brand palette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(250, 250, 248, 0.25)" }}
        />

        {/* Content on top — each text block lives inside its own frosted card */}
        <div className="relative">
          {/* Moja misja */}
          <section className="py-20 small:py-32">
            <div className="content-container max-w-3xl mx-auto">
              <AnimateIn variant="fade-up">
                <div
                  className="rounded-large p-8 small:p-14 shadow-2xl border border-white/50"
                  style={{
                    backgroundColor: "rgba(250, 250, 248, 0.88)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <h2 className="text-brand-accent text-lg font-heading font-semibold mb-8 text-center">
                    Moja misja
                  </h2>
                  <div className="space-y-4 text-brand-text-muted text-lg leading-relaxed text-center">
                    <p>
                      Nie tworzę kolejnej marki, której produkty różnią się od
                      siebie jedynie opakowaniem, nazwą i marketingiem - a składy
                      pozostają oparte na tych samych syntetycznych komponentach.
                    </p>
                    <p className="text-brand-text font-semibold">
                      Buduję koncepcję - coś, co ma sens.
                    </p>
                    <p>Coś, co zmienia sposób myślenia o pielęgnacji.</p>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </section>

          {/* Moja filozofia */}
          <section className="pb-20 small:pb-32">
            <div className="content-container max-w-3xl mx-auto">
              <AnimateIn variant="fade-up">
                <div
                  className="rounded-large p-8 small:p-14 shadow-2xl border border-white/50"
                  style={{
                    backgroundColor: "rgba(250, 250, 248, 0.88)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <h2 className="text-brand-accent text-lg font-heading font-semibold mb-8 text-center">
                    Moja filozofia
                  </h2>
                  <div className="space-y-4 text-brand-text-muted text-lg leading-relaxed text-center">
                    <p className="text-brand-text font-semibold">
                      Wierzę, że skórę należy karmić, a nie zatruwać.
                    </p>
                    <p>Czy wiesz czym żywi się Twój mikrobiom?</p>
                    <p>
                      Pielęgnacja powinna być tak czysta i bezpieczna, żeby można
                      było ją zjeść. Bo wszystko, co nakładamy na skórę, przenika
                      głębiej niż myślimy.
                    </p>
                    <p>
                      Inteligencja natury działa w harmonii z organizmem.
                      <br />
                      Zero przypadków. Pełna zgodność.
                    </p>
                    <p>
                      Składniki dobierane są celowo - tak, by wspierać, odżywiać
                      i przywracać równowagę.
                    </p>
                    <p>
                      Efektem takiej pielęgnacji jest cera, która odzyskuje blask,
                      zdrowie, harmonię.
                    </p>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </section>

          {/* Closing */}
          <section className="pb-24 small:pb-32">
            <div className="content-container max-w-3xl mx-auto">
              <AnimateIn variant="fade-up">
                <div
                  className="rounded-large p-8 small:p-14 shadow-2xl border border-white/50 text-center space-y-4"
                  style={{
                    backgroundColor: "rgba(250, 250, 248, 0.88)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <p className="text-brand-text text-xl font-heading font-semibold">
                    Czystość to luksus. Prostota to siła.
                  </p>
                  <p className="text-brand-accent text-lg italic font-heading">
                    „Minimalizm to nie brak - to wybór tego, co najważniejsze."
                  </p>
                  <div className="space-y-2 text-brand-text-muted text-base mt-8">
                    <p>To powrót do źródła</p>
                    <p>To zaufanie do natury</p>
                    <p>To manifest</p>
                  </div>
                  <p className="text-brand-text-muted/60 text-sm tracking-wider uppercase mt-8">
                    By Lunula
                  </p>
                </div>
              </AnimateIn>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
