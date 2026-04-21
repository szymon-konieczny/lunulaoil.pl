import { Metadata } from "next"
import Image from "next/image"
import AnimateIn from "@modules/common/components/animate-in"

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
        <div className="hidden small:flex min-h-screen justify-end items-stretch">
          <div className="relative h-screen aspect-[2/3] flex-shrink-0">
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
        <div className="hidden small:flex absolute inset-0 items-center pointer-events-none">
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
            </div>
          </div>
        </div>

        {/* Mobile: stacked — image on top, text below */}
        <div className="small:hidden">
          <div className="relative w-full aspect-[2/3] max-h-[80vh]">
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
          </div>
        </div>
      </section>

      {/* Moja misja */}
      <section className="py-20 small:py-32">
        <div className="content-container max-w-3xl mx-auto">
          <AnimateIn variant="fade-up">
            <div>
              <h2 className="text-brand-accent text-lg font-heading font-semibold mb-8 text-center">
                Moja misja
              </h2>
              <div className="space-y-4 text-brand-text-muted text-lg leading-relaxed text-center">
                <p>
                  Nie tworzę kolejnej marki, której produkty różnią się od siebie
                  jedynie opakowaniem, nazwą i marketingiem - a składy pozostają
                  oparte na tych samych syntetycznych komponentach.
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

      {/* Workshop image — full-width cinematic break */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/manifest-workshop.jpeg"
          alt="Pracownia Lunula Botanique — rzemieślnicza produkcja kosmetyków"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Very subtle overlay, just to ease the transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-background/20 via-transparent to-brand-background/40 pointer-events-none" />
      </section>

      {/* Moja filozofia */}
      <section className="py-20 small:py-32">
        <div className="content-container max-w-3xl mx-auto">
          <AnimateIn variant="fade-up">
            <div>
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

      {/* Separator */}
      <div className="w-16 h-px bg-brand-accent mx-auto mb-16" />

      {/* Closing */}
      <section className="pb-24 small:pb-32">
        <div className="content-container max-w-3xl mx-auto">
          <AnimateIn variant="fade-up">
            <div className="text-center space-y-4">
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
  )
}
