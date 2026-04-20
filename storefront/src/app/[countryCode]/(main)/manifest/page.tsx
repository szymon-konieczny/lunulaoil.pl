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
      {/* Cinematic hero with forest image */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <Image
          src="/manifest-forest.jpeg"
          alt="Lunula Botanique — powrót do natury"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft gradient overlay — top and bottom only, center stays clean */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

        {/* Top label */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-24 small:pt-32">
          <AnimateIn variant="fade-in">
            <div className="text-center">
              <span className="text-white/90 text-sm tracking-[0.35em] uppercase font-medium drop-shadow-lg">
                Manifest
              </span>
            </div>
          </AnimateIn>
        </div>

        {/* Bottom: signature + scroll indicator */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 small:pb-14">
          <AnimateIn variant="fade-up" delay={300}>
            <div className="text-center space-y-6">
              <p className="text-white/90 text-xs tracking-[0.4em] uppercase drop-shadow-lg">
                By Lunula
              </p>
              <div className="flex justify-center">
                <div className="w-px h-10 bg-white/60 animate-pulse" />
              </div>
            </div>
          </AnimateIn>
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
                <p className="text-brand-text-muted/70 italic">
                  Bo kiedyś wiedzieliśmy więcej, niż wiemy dziś.
                  <br />
                  Rozumieliśmy moc natury - i żyliśmy z nią w zgodzie.
                </p>
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
