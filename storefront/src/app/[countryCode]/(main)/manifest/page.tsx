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
      {/* Gallery hero — full portrait image centered with blurred backdrop */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center py-20 small:py-24">
        {/* Blurred backdrop using the same image — fills empty space on wide screens */}
        <div className="absolute inset-0">
          <Image
            src="/manifest-forest.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
            className="object-cover scale-110 blur-2xl opacity-40"
          />
          <div className="absolute inset-0 bg-brand-background/60" />
        </div>

        {/* Top label */}
        <AnimateIn variant="fade-in" className="relative z-10 mb-8">
          <span className="text-brand-accent text-sm tracking-[0.35em] uppercase font-medium">
            Manifest
          </span>
        </AnimateIn>

        {/* Full image — contained, never cropped */}
        <AnimateIn variant="fade-up" delay={150} className="relative z-10 w-full flex justify-center px-4">
          <div className="relative w-full max-w-md medium:max-w-lg aspect-[2/3] rounded-sm overflow-hidden shadow-2xl">
            <Image
              src="/manifest-forest.jpeg"
              alt="Lunula Botanique — powrót do natury"
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
              className="object-cover"
            />
          </div>
        </AnimateIn>

        {/* Bottom signature */}
        <AnimateIn variant="fade-up" delay={300} className="relative z-10 mt-8 flex flex-col items-center gap-4">
          <p className="text-brand-text-muted text-xs tracking-[0.4em] uppercase">
            By Lunula
          </p>
          <div className="w-px h-10 bg-brand-accent/40 animate-pulse" />
        </AnimateIn>
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
