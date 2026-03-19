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
    icon: "💧",
  },
  {
    name: "SqualaneCode",
    subtitle: "Skwalan",
    description:
      "Ultra lekki, suchy, niekomedogenny lipid. Stabilna forma skwalenu, naturalnie występującego w ludzkim sebum.",
    price: "59 zł",
    href: "/biozgodna-pielegnacja/squalanecode",
    icon: "🫧",
  },
  {
    name: "JojobaCode",
    subtitle: "Olej jojoba",
    description:
      "Inteligentny, wielozadaniowy, samoregulujący. Płynny wosk o budowie zbliżonej do ludzkiego sebum.",
    price: "69 zł",
    href: "/biozgodna-pielegnacja/jojobacode",
    icon: "🌱",
  },
]

const BiocareSection = () => {
  return (
    <section className="py-16 small:py-24 bg-brand-surface">
      <div className="content-container">
        <AnimateIn variant="fade-in" className="text-center mb-4">
          <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
            Biozgodna Pielęgnacja Twarzy
          </span>
        </AnimateIn>
        <AnimateIn variant="fade-up" delay={100} className="text-center mb-12">
          <p className="text-brand-text-muted text-base max-w-2xl mx-auto leading-relaxed">
            Składniki rozpoznawalne przez skórę, które wspierają jej naturalne
            procesy zamiast je zaburzać. Karmienie skóry tym, co ona już zna.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <AnimateIn
              key={product.name}
              variant="fade-up"
              delay={i * 150}
              duration={800}
            >
              <LocalizedClientLink href={product.href} className="block group">
                <div className="p-8 rounded-sm border border-brand-border hover:border-brand-accent/30 transition-colors duration-300">
                  {/* Placeholder for product image */}
                  <div className="relative aspect-square bg-brand-background rounded-sm flex items-center justify-center mb-6">
                    <div className="text-center">
                      <span className="text-4xl block mb-2">{product.icon}</span>
                      <p className="text-brand-text-muted/50 text-xs tracking-wider uppercase">
                        Zdjęcie wkrótce
                      </p>
                    </div>
                  </div>

                  <h3 className="text-brand-text text-xl font-heading font-semibold mb-1 group-hover:text-brand-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-brand-accent text-sm mb-3">
                    {product.subtitle}
                  </p>
                  <p className="text-brand-text-muted text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-primary text-lg font-semibold">
                      {product.price}
                    </span>
                    <span className="text-brand-text-muted/60 text-sm group-hover:text-brand-accent transition-colors">
                      Dowiedz się więcej →
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
