import { Metadata } from "next"
import Image from "next/image"
import AnimateIn from "@modules/common/components/animate-in"
import ScrollDownButton from "@modules/common/components/scroll-down-button"

export const metadata: Metadata = {
  title: "Mydła Rytualne — Lunula Slavic Soap",
  description:
    "Mydła Lunula powstają z roślinnych olejów, maseł i ziół, w prostych recepturach inspirowanych tradycją.",
}

const soaps = [
  {
    name: "Rusałka",
    icon: "🌿",
    ingredients: "Rumianek \u2022 Lawenda \u2022 Płatki owsiane",
    inci: "Olea Europaea Fruit Oil, Cocos Nucifera Oil, Butyrospermum Parkii Butter, Chamomilla Recutita, Lavandula Angustifolia Oil, Avena Sativa",
    description:
      "Rusałka to lekkość i ukojenie. Delikatnie ziołowa z dodatkiem płatków owsianych, które nadają jej miękkiej, naturalnej faktury. Sprawdza się przy skórze wrażliwej i suchej — kiedy potrzeba ciszy, prostoty i oddechu.",
    price: "33 zł",
  },
  {
    name: "Różyczka",
    icon: "🌸",
    ingredients: "Glinka różowa i czerwona \u2022 May Chang \u2022 Słodka pomarańcza \u2022 Róża damasceńska",
    inci: "Illite, Kaolin, Cymbopogon Martini / Litsea Cubeba Oil (May Chang), Citrus Aurantium Dulcis Peel Oil, Rosa Damascena Flower Oil",
    description:
      "Różyczka łączy mineralną moc glinki z promienną energią cytrusów i róży. Kwiatowo-owocowa, świeża, z subtelną nutą kobiecego ciepła. Wspiera równowagę skóry i nadaje jej zdrowy, naturalny blask. To mydło czasu rozkwitu — dla kobiet, które chcą czuć się świeżo, lekko i promiennie.",
    price: "33 zł",
  },
  {
    name: "Mokosza",
    icon: "☕",
    ingredients: "Kawa \u2022 Oleje roślinne \u2022 Hibiskus",
    inci: "Coffea Arabica Seed Powder, Hibiscus Sabdariffa Flower Extract, masło shea",
    description:
      "Mokosza jest ziemista i wyrazista. Naturalny kolor kawy, delikatnie peelingująca struktura i ciepły, otulający zapach sprawiają, że to mydło ma korzenny, stabilny charakter. Choć inspirowana archetypem Matki Ziemi, Mokosza jest chętnie wybierana również przez mężczyzn — właśnie ze względu na jej naturalny, kawowy aromat. Daje poczucie mocy, zakorzenienia i energii.",
    price: "33 zł",
  },
]

export default function SlavicSoapPage() {
  return (
    <div className="bg-brand-background">
      {/* Hero with background image */}
      <section className="relative h-[calc(100dvh-4rem)] small:h-[calc(100dvh-5rem)] flex items-center overflow-hidden">
        <Image
          src="/products/slavic-soap.jpeg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="content-container relative z-10 text-center max-w-3xl mx-auto">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Lunula Slavic Soap
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h1 className="text-3xl small:text-5xl font-heading font-bold text-white mt-4 mb-6">
              Powrót do korzeni
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-white/80 text-lg leading-relaxed mb-4">
              Pielęgnacja w rytmie natury. Mydła Lunula powstają z roślinnych
              olejów, maseł i ziół, w prostych, autentycznych recepturach
              inspirowanych tradycją.
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              Bazą są starannie dobrane oleje roślinne — bez pośpiechu,
              z szacunkiem do surowca i skóry. To pielęgnacja, która nie
              konkuruje z naturą — tylko z nią współpracuje.
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={300}>
            <p className="text-white/60 text-base italic mt-6">
              Dotyk faktury, zapach ziół i chwila zatrzymania.
              <br />
              Naturalna pielęgnacja to powrót do korzeni.
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={400}>
            <ScrollDownButton />
          </AnimateIn>
        </div>
      </section>

      {/* Soaps */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <div className="space-y-16">
            {soaps.map((soap, i) => (
              <AnimateIn
                key={soap.name}
                variant="fade-up"
                delay={i * 100}
                duration={800}
              >
                <div className="grid grid-cols-1 small:grid-cols-2 gap-8 items-center">
                  {/* Placeholder image */}
                  <div className="relative aspect-square bg-brand-background rounded-sm flex items-center justify-center border border-brand-border">
                    <div className="text-center">
                      <span className="text-6xl block mb-2">{soap.icon}</span>
                      <p className="text-brand-text-muted/50 text-xs tracking-wider uppercase">
                        Zdjęcie wkrótce
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h2 className="text-brand-text text-2xl small:text-3xl font-heading font-bold mb-2">
                      {soap.name}
                    </h2>
                    <p className="text-brand-accent text-sm tracking-wider mb-4">
                      {soap.ingredients}
                    </p>
                    <p className="text-brand-text-muted text-base leading-relaxed mb-4">
                      {soap.description}
                    </p>
                    <div className="p-4 border border-brand-border rounded-sm mb-4">
                      <p className="text-brand-text-muted/60 text-xs uppercase tracking-wider mb-1">
                        INCI
                      </p>
                      <p className="text-brand-text-muted text-sm leading-relaxed">
                        {soap.inci}
                      </p>
                    </div>
                    <p className="text-brand-primary text-xl font-semibold">
                      {soap.price}
                    </p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
