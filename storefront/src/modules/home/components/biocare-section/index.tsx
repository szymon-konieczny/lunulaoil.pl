import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

const products = [
  {
    name: "HialCode",
    subtitle: "Kwas hialuronowy",
    description:
      "Intensywne nawilżenie w głębi skóry. Kwas hialuronowy o wielocząsteczkowej formule, który przywraca elastyczność i blask.",
    price: "79 zł",
    href: "/biozgodna-pielegnacja/hialcode",
    image: "/products/hialcode-placeholder.svg",
  },
  {
    name: "SqualaneCode",
    subtitle: "Skwalan",
    description:
      "Ultra lekki, suchy, niekomedogenny lipid. Stabilna forma skwalenu, naturalnie występującego w ludzkim sebum.",
    price: "59 zł",
    href: "/biozgodna-pielegnacja/squalanecode",
    image: "/products/squalanecode-placeholder.svg",
  },
  {
    name: "JojobaCode",
    subtitle: "Olej jojoba",
    description:
      "Inteligentny, wielozadaniowy, samoregulujący. Płynny wosk o budowie zbliżonej do ludzkiego sebum.",
    price: "69 zł",
    href: "/biozgodna-pielegnacja/jojobacode",
    image: "/products/jojobacode-placeholder.svg",
  },
]

const BiocareSection = () => {
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
          {products.map((product, i) => (
            <AnimateIn
              key={product.name}
              variant="fade-up"
              delay={i * 150}
              duration={800}
            >
              <LocalizedClientLink href={product.href} className="block group">
                <div className="bg-brand-background p-6 hover:shadow-sm transition-all duration-500">
                  <div className="relative aspect-square overflow-hidden mb-8">
                    <Image
                      src={product.image}
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
                  <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                    <span className="text-brand-text text-base font-semibold">
                      {product.price}
                    </span>
                    <span className="text-brand-text-muted/50 text-xs tracking-wider uppercase group-hover:text-brand-accent transition-colors duration-300">
                      Więcej →
                    </span>
                  </div>
                </div>
              </LocalizedClientLink>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BiocareSection
