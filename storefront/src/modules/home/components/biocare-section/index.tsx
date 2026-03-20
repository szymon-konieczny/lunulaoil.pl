import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import AddToCartButton from "@modules/products/components/add-to-cart-button"

const products = [
  {
    handle: "hialcode",
    name: "HialCode",
    subtitle: "Kwas hialuronowy",
    description:
      "Intensywne nawilżenie w głębi skóry. Kwas hialuronowy o wielocząsteczkowej formule, który przywraca elastyczność i blask.",
    fallbackPrice: "79 zł",
    href: "/biozgodna-pielegnacja/hialcode",
    storeHref: "/products/hialcode",
    image: "/products/hialcode-placeholder.svg",
  },
  {
    handle: "squalanecode",
    name: "SqualaneCode",
    subtitle: "Skwalan",
    description:
      "Ultra lekki, suchy, niekomedogenny lipid. Stabilna forma skwalenu, naturalnie występującego w ludzkim sebum.",
    fallbackPrice: "59 zł",
    href: "/biozgodna-pielegnacja/squalanecode",
    storeHref: "/products/squalanecode",
    image: "/products/squalanecode-placeholder.svg",
  },
  {
    handle: "jojobacode",
    name: "JojobaCode",
    subtitle: "Olej jojoba",
    description:
      "Inteligentny, wielozadaniowy, samoregulujący. Płynny wosk o budowie zbliżonej do ludzkiego sebum.",
    fallbackPrice: "69 zł",
    href: "/biozgodna-pielegnacja/jojobacode",
    storeHref: "/products/jojobacode",
    image: "/products/jojobacode-placeholder.svg",
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

const BiocareSection = ({ productData = {} }: Props) => {
  return (
    <section className="py-20 small:py-32 bg-brand-surface">
      <div className="content-container">
        <AnimateIn variant="fade-in" className="text-center mb-4">
          <span className="text-brand-accent text-xs tracking-[0.35em] uppercase font-medium">
            Biozgodna Pielęgnacja Twarzy
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} className="text-center mb-16">
          <p className="text-brand-text-muted text-base max-w-xl mx-auto leading-[1.8]">
            Składniki rozpoznawalne przez skórę, które wspierają jej naturalne
            procesy zamiast je zaburzać. Karmienie skóry tym, co ona już zna.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {products.map((product, i) => {
            const medusa = productData[product.handle]
            const price = medusa?.price || product.fallbackPrice
            const variantId = medusa?.variantId || null

            return (
              <AnimateIn
                key={product.name}
                variant="fade-up"
                delay={i * 150}
                duration={800}
              >
                <div className="bg-brand-background p-6 hover:shadow-sm transition-all duration-500 flex flex-col h-full">
                  <LocalizedClientLink
                    href={product.href}
                    className="block group"
                  >
                    <div className="relative aspect-square overflow-hidden mb-8">
                      <Image
                        src={
                          medusa?.thumbnail || product.image
                        }
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <h3 className="text-brand-text text-lg font-heading font-semibold mb-1 group-hover:text-brand-accent transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-brand-accent text-xs tracking-wider mb-3">
                      {product.subtitle}
                    </p>
                    <p className="text-brand-text-muted text-sm leading-[1.7] mb-5">
                      {product.description}
                    </p>
                  </LocalizedClientLink>

                  <div className="mt-auto pt-4 border-t border-brand-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text text-base font-semibold">
                        {price}
                      </span>
                      <LocalizedClientLink
                        href={product.storeHref}
                        className="text-brand-text-muted/50 text-xs tracking-wider uppercase hover:text-brand-accent transition-colors duration-300"
                      >
                        W sklepie →
                      </LocalizedClientLink>
                    </div>
                    <AddToCartButton
                      variantId={variantId || ""}
                      disabled={!variantId}
                      className="w-full px-4 py-2 rounded-sm text-xs font-medium transition-all duration-200 border inline-flex items-center justify-center gap-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </AnimateIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BiocareSection
