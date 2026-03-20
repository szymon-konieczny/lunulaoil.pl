import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import AddToCartButton from "@modules/products/components/add-to-cart-button"

const soaps = [
  {
    handle: "rusalka-mydlo-rytualne",
    name: "Rusałka",
    image: "/products/rusalka-placeholder.svg",
    ingredients: "Rumianek \u2022 Lawenda \u2022 Płatki owsiane",
    description:
      "Lekkość i ukojenie. Delikatnie ziołowa z naturalną fakturą płatków owsianych. Dla skóry wrażliwej i suchej — kiedy potrzeba ciszy i oddechu.",
    fallbackPrice: "33 zł",
    storeHref: "/products/rusalka-mydlo-rytualne",
  },
  {
    handle: "rozyczka-mydlo-rytualne",
    name: "Różyczka",
    image: "/products/rozyczka-placeholder.svg",
    ingredients: "Glinka różowa \u2022 May Chang \u2022 Róża damasceńska",
    description:
      "Mineralny blask. Łączy moc glinki z energią cytrusów i róży. Mydło czasu rozkwitu — dla kobiet, które chcą czuć się świeżo i promiennie.",
    fallbackPrice: "33 zł",
    storeHref: "/products/rozyczka-mydlo-rytualne",
  },
  {
    handle: "mokosza-mydlo-rytualne",
    name: "Mokosza",
    image: "/products/mokosza-placeholder.svg",
    ingredients: "Kawa \u2022 Oleje roślinne \u2022 Hibiskus",
    description:
      "Ziemista i wyrazista. Naturalny kolor kawy, delikatnie peelingująca struktura i otulający zapach. Daje poczucie mocy, zakorzenienia i energii.",
    fallbackPrice: "33 zł",
    storeHref: "/products/mokosza-mydlo-rytualne",
  },
]

type ProductData = {
  price: string
  variantId: string | null
  thumbnail: string | null
}

type Props = {
  productData?: Record<string, ProductData>
}

const SlavicSoap = ({ productData = {} }: Props) => {
  return (
    <section className="relative py-24 small:py-36 overflow-hidden">
      {/* Background image */}
      <Image
        src="/products/slavic-soap.jpeg"
        alt=""
        fill
        className="object-cover"
        aria-hidden="true"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="content-container relative z-10">
        <AnimateIn variant="fade-in" className="text-center mb-4">
          <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
            Lunula Slavic Soap
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} className="text-center mb-4">
          <h2 className="text-white text-2xl small:text-3xl font-heading font-normal mt-2">
            Powrót do korzeni
          </h2>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={150} className="text-center mb-16">
          <p className="text-white/70 text-base max-w-xl mx-auto leading-[1.8] mt-4">
            Mydła Lunula powstają z roślinnych olejów, maseł i ziół, w prostych
            recepturach inspirowanych tradycją. Pielęgnacja, która nie konkuruje
            z naturą — tylko z nią współpracuje.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {soaps.map((soap, i) => {
            const medusa = productData[soap.handle]
            const price = medusa?.price || soap.fallbackPrice
            const variantId = medusa?.variantId || null

            return (
              <AnimateIn
                key={soap.name}
                variant="fade-up"
                delay={i * 150}
                duration={800}
              >
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-sm p-8 flex flex-col h-full">
                  <h3 className="text-white text-xl font-heading font-normal mb-2">
                    {soap.name}
                  </h3>
                  <p className="text-brand-accent text-xs tracking-wider mb-4">
                    {soap.ingredients}
                  </p>
                  <p className="text-white/60 text-sm leading-[1.7] mb-6 max-w-xs mx-auto">
                    {soap.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-white/80 text-base font-semibold">
                        {price}
                      </span>
                      <LocalizedClientLink
                        href={soap.storeHref}
                        className="text-white/40 text-xs hover:text-brand-accent transition-colors"
                      >
                        W sklepie →
                      </LocalizedClientLink>
                    </div>
                    <AddToCartButton
                      variantId={variantId || ""}
                      disabled={!variantId}
                      className="w-full px-4 py-2 rounded-sm text-xs font-medium transition-all duration-200 border inline-flex items-center justify-center gap-2 border-white/30 text-white/80 hover:bg-brand-accent hover:border-brand-accent hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </AnimateIn>
            )
          })}
        </div>

        <AnimateIn variant="fade-up" delay={500} className="mt-14 text-center">
          <LocalizedClientLink
            href="/mydla-rytualne"
            className="inline-flex items-center gap-2 px-10 py-3.5 border border-white/30 text-white/80 hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all duration-300 text-xs tracking-[0.15em] uppercase"
          >
            Poznaj mydła rytualne
          </LocalizedClientLink>
        </AnimateIn>
      </div>
    </section>
  )
}

export default SlavicSoap
