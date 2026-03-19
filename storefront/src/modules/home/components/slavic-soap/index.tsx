import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const soaps = [
  {
    name: "Rusałka",
    icon: "🌿",
    ingredients: "Rumianek \u2022 Lawenda \u2022 Płatki owsiane",
    description:
      "Lekkość i ukojenie. Delikatnie ziołowa z naturalną fakturą płatków owsianych. Dla skóry wrażliwej i suchej — kiedy potrzeba ciszy i oddechu.",
    price: "33 zł",
  },
  {
    name: "Różyczka",
    icon: "🌸",
    ingredients: "Glinka różowa \u2022 May Chang \u2022 Róża damasceńska",
    description:
      "Mineralny blask. Łączy moc glinki z energią cytrusów i róży. Mydło czasu rozkwitu — dla kobiet, które chcą czuć się świeżo i promiennie.",
    price: "33 zł",
  },
  {
    name: "Mokosza",
    icon: "☕",
    ingredients: "Kawa \u2022 Oleje roślinne \u2022 Hibiskus",
    description:
      "Ziemista i wyrazista. Naturalny kolor kawy, delikatnie peelingująca struktura i otulający zapach. Daje poczucie mocy, zakorzenienia i energii.",
    price: "33 zł",
  },
]

const SlavicSoap = () => {
  return (
    <section className="py-16 small:py-24 bg-brand-background">
      <div className="content-container">
        <AnimateIn variant="fade-in" className="text-center mb-4">
          <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
            Lunula Slavic Soap
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} className="text-center mb-4">
          <h2 className="text-white text-2xl small:text-3xl font-heading font-bold">
            Powrót do korzeni
          </h2>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={150} className="text-center mb-12">
          <p className="text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
            Mydła Lunula powstają z roślinnych olejów, maseł i ziół, w prostych
            recepturach inspirowanych tradycją. Pielęgnacja, która nie konkuruje
            z naturą — tylko z nią współpracuje.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
          {soaps.map((soap, i) => (
            <AnimateIn
              key={soap.name}
              variant="fade-up"
              delay={i * 150}
              duration={800}
            >
              <div className="p-8 rounded-sm border border-brand-border text-center">
                <span className="text-4xl block mb-4">{soap.icon}</span>
                <h3 className="text-white text-xl font-heading font-semibold mb-2">
                  {soap.name}
                </h3>
                <p className="text-brand-accent text-xs tracking-wider mb-4">
                  {soap.ingredients}
                </p>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {soap.description}
                </p>
                <span className="text-brand-primary text-lg font-semibold">
                  {soap.price}
                </span>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn variant="fade-up" delay={500} className="mt-10 text-center">
          <LocalizedClientLink
            href="/mydla-rytualne"
            className="inline-flex items-center gap-2 px-8 py-3 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-black transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            Poznaj mydła rytualne →
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default SlavicSoap
