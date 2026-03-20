import { Metadata } from "next"
import AnimateIn from "@modules/common/components/animate-in"

export const metadata: Metadata = {
  title: "JojobaCode — Olej jojoba",
  description:
    "Inteligentny, wielozadaniowy, samoregulujący olej jojoba. Płynny wosk o budowie zbliżonej do ludzkiego sebum.",
}

export default function JojobaCodePage() {
  return (
    <div className="bg-brand-background">
      <section className="py-20 small:py-32">
        <div className="content-container max-w-3xl mx-auto">
          <AnimateIn variant="fade-in" className="text-center mb-12">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Biozgodna Pielęgnacja
            </span>
            <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-2">
              JojobaCode
            </h1>
            <p className="text-brand-accent text-lg">
              Inteligentny, wielozadaniowy, samoregulujący
            </p>
            <p className="text-brand-primary text-2xl font-semibold mt-4">
              69 zł
            </p>
          </AnimateIn>

          {/* Placeholder image */}
          <AnimateIn variant="fade-up" delay={100}>
            <div className="relative aspect-[4/3] bg-brand-surface rounded-sm flex items-center justify-center mb-12 border border-brand-border">
              <div className="text-center">
                <img src="/icons/seedling.svg" alt="" className="w-12 h-12 mx-auto mb-2" />
                <p className="text-brand-text-muted/50 text-xs tracking-wider uppercase">
                  Zdjęcie wkrótce
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* Content */}
          <AnimateIn variant="fade-up" delay={200}>
            <div className="space-y-8">
              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Inteligentny — dopasowuje się do skóry
                </h2>
                <p className="text-brand-text-muted text-base leading-relaxed">
                  Olej jojoba to nie olej, a płynny wosk o budowie zbliżonej do
                  ludzkiego sebum. Dzięki temu „rozpoznaje" potrzeby skóry —
                  wspiera regulację wydzielania łoju: utrzymuje wilgoć w skórze,
                  poprawia nawilżenie skóry suchej w duecie z kwasem hialuronowym,
                  a równocześnie ogranicza przetłuszczanie się tłustej. Działa
                  intuicyjnie i przywraca równowagę.
                </p>
                <p className="text-brand-text-muted text-sm mt-3 italic">
                  Idealny do masażu twarzy i ciała, zwłaszcza w pracy z cerą
                  problematyczną, wrażliwą lub trądzikową.
                </p>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Wielozadaniowy — jeden olej, wiele zastosowań
                </h2>
                <ul className="space-y-2 text-brand-text-muted text-base leading-relaxed">
                  <li>— emolient utrzymujący wilgoć po zastosowaniu HialCode</li>
                  <li>— baza do masażu i automasażu twarzy</li>
                  <li>— olejek do demakijażu i oczyszczania skóry</li>
                  <li>— eliksir na końcówki włosów</li>
                  <li>— baza do aromaterapii — łączy się z olejkami eterycznymi</li>
                  <li>— serum do skórek, ust, brody, paznokci</li>
                </ul>
                <p className="text-brand-text-muted text-sm mt-4">
                  Idealnie jest łączyć go ze skwalanem — SqualaneCode.
                </p>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Samoregulujący — nie zapycha, stabilizuje inne oleje
                </h2>
                <p className="text-brand-text-muted text-base leading-relaxed">
                  Z komedogennością 0–1, olej jojoba rozcieńcza cięższe, bardziej
                  komedogenne oleje (np. z awokado, z wiesiołka czy macadamia),
                  dzięki czemu zyskują lżejszą formułę i nie obciążają porów.
                  To doskonała baza do tworzenia autorskich mieszanek do masażu
                  twarzy i ciała.
                </p>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Pielęgnacja włosów
                </h2>
                <ul className="space-y-2 text-brand-text-muted text-base leading-relaxed">
                  <li>— zabezpiecza końcówki bez obciążania</li>
                  <li>— reguluje przetłuszczanie się skóry głowy</li>
                  <li>— nie zmywa naturalnej warstwy lipidowej włosa</li>
                </ul>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  W aromaterapii
                </h2>
                <p className="text-brand-text-muted text-base leading-relaxed">
                  Dzięki neutralnemu zapachowi nie konkuruje z kompozycją
                  zapachową olejków eterycznych. Przedłuża trwałość zapachu
                  na skórze i działa jak nośnik w aromaterapii dotykowej.
                </p>
              </div>

              <div className="text-center mt-8">
                <p className="text-brand-text-muted/70 text-base italic">
                  „Jojoba to olej, który słucha skóry — nie narzuca, lecz
                  harmonizuje."
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
