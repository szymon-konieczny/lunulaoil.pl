import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"

export const metadata: Metadata = {
  title: "Biozgodna Pielęgnacja Twarzy",
  description:
    "Biozgodna pielęgnacja twarzy to taka, która jest zgodna z fizjologią skóry — wspiera jej naturalne procesy, zamiast je zaburzać.",
}

const products = [
  {
    name: "HialCode",
    subtitle: "Kwas hialuronowy",
    price: "79 zł",
    href: "/biozgodna-pielegnacja/hialcode",
    icon: "💧",
  },
  {
    name: "SqualaneCode",
    subtitle: "Skwalan",
    price: "59 zł",
    href: "/biozgodna-pielegnacja/squalanecode",
    icon: "🫧",
  },
  {
    name: "JojobaCode",
    subtitle: "Olej jojoba",
    price: "69 zł",
    href: "/biozgodna-pielegnacja/jojobacode",
    icon: "🌱",
  },
]

export default function BiocarePage() {
  return (
    <div className="bg-brand-background">
      {/* Hero */}
      <section className="py-20 small:py-32">
        <div className="content-container text-center max-w-3xl mx-auto">
          <AnimateIn variant="fade-in">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Biozgodna Pielęgnacja
            </span>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={100}>
            <h1 className="text-3xl small:text-5xl font-heading font-bold text-white mt-4 mb-6">
              Pielęgnacja Twarzy
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-white/80 text-lg leading-relaxed mb-4">
              Biozgodna pielęgnacja twarzy to taka, która jest zgodna z
              fizjologią skóry — czyli wspiera jej naturalne procesy, zamiast je
              zaburzać.
            </p>
            <p className="text-white/60 text-base leading-relaxed">
              Chodzi o to, żeby składniki były rozpoznawalne przez skórę, nie
              naruszały bariery hydrolipidowej, współpracowały z jej naturalnym
              pH, mikrobiomem i lipidami.
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={300}>
            <p className="text-white/50 text-base italic mt-6">
              Karmienie skóry tym, co ona już zna.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <AnimateIn
                key={product.name}
                variant="fade-up"
                delay={i * 150}
                duration={800}
              >
                <LocalizedClientLink
                  href={product.href}
                  className="block group"
                >
                  <div className="p-8 rounded-sm border border-brand-border hover:border-brand-accent/30 transition-colors duration-300 text-center">
                    <div className="relative aspect-square bg-brand-background rounded-sm flex items-center justify-center mb-6">
                      <div className="text-center">
                        <span className="text-5xl block mb-2">
                          {product.icon}
                        </span>
                        <p className="text-white/30 text-xs tracking-wider uppercase">
                          Zdjęcie wkrótce
                        </p>
                      </div>
                    </div>
                    <h3 className="text-white text-xl font-heading font-semibold mb-1 group-hover:text-brand-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-brand-accent text-sm mb-3">
                      {product.subtitle}
                    </p>
                    <span className="text-brand-primary text-lg font-semibold">
                      {product.price}
                    </span>
                    <p className="text-white/40 text-sm mt-3 group-hover:text-brand-accent transition-colors">
                      Dowiedz się więcej →
                    </p>
                  </div>
                </LocalizedClientLink>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
