import { Metadata } from "next"
import AnimateIn from "@modules/common/components/animate-in"

export const metadata: Metadata = {
  title: "Manifest",
  description:
    "Manifest Lunula Botanique - filozofia biozgodnej pielęgnacji. By Lunula.",
}

export default function ManifestPage() {
  return (
    <div className="bg-brand-background">
      <section className="py-20 small:py-32">
        <div className="content-container max-w-3xl mx-auto">
          <AnimateIn variant="fade-in" className="text-center mb-16">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Manifest
            </span>
          </AnimateIn>

          {/* Moja misja */}
          <AnimateIn variant="fade-up" delay={100}>
            <div className="mb-16">
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

          {/* Separator */}
          <div className="w-16 h-px bg-brand-accent mx-auto mb-16" />

          {/* Moja filozofia */}
          <AnimateIn variant="fade-up" delay={200}>
            <div className="mb-16">
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

          {/* Separator */}
          <div className="w-16 h-px bg-brand-accent mx-auto mb-16" />

          {/* Closing */}
          <AnimateIn variant="fade-up" delay={300}>
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
