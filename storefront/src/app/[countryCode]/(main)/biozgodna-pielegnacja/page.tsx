import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AnimateIn from "@modules/common/components/animate-in"
import Icon from "@modules/common/components/icon"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import Thumbnail from "@modules/products/components/thumbnail"

export const metadata: Metadata = {
  title: "Biozgodna Pielęgnacja Twarzy",
  description:
    "Biozgodna pielęgnacja twarzy to taka, która jest zgodna z fizjologią skóry — wspiera jej naturalne procesy, zamiast je zaburzać.",
}

const productConfigs = [
  {
    handle: "hialcode",
    name: "HialCode",
    subtitle: "Kwas hialuronowy",
    fallbackPrice: "79 zł",
    href: "/biozgodna-pielegnacja/hialcode",
    icon: "water-drop",
  },
  {
    handle: "squalanecode",
    name: "SqualaneCode",
    subtitle: "Skwalan",
    fallbackPrice: "59 zł",
    href: "/biozgodna-pielegnacja/squalanecode",
    icon: "bubbles",
  },
  {
    handle: "jojobacode",
    name: "JojobaCode",
    subtitle: "Olej jojoba",
    fallbackPrice: "69 zł",
    href: "/biozgodna-pielegnacja/jojobacode",
    icon: "seedling",
  },
]

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function BiocarePage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  // Fetch all 3 products from Medusa
  const productMap: Record<string, any> = {}
  if (region) {
    try {
      const { response } = await listProducts({
        countryCode,
        queryParams: {
          handle: productConfigs.map((p) => p.handle),
          limit: 3,
        },
      })
      for (const p of response.products) {
        if (p.handle) productMap[p.handle] = p
      }
    } catch {}
  }

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
            <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-6">
              Pielęgnacja Twarzy
            </h1>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={200}>
            <p className="text-brand-text-muted text-lg leading-relaxed mb-4">
              Biozgodna pielęgnacja twarzy to taka, która jest zgodna z
              fizjologią skóry — czyli wspiera jej naturalne procesy, zamiast je
              zaburzać.
            </p>
            <p className="text-brand-text-muted text-base leading-relaxed">
              Chodzi o to, żeby składniki były rozpoznawalne przez skórę, nie
              naruszały bariery hydrolipidowej, współpracowały z jej naturalnym
              pH, mikrobiomem i lipidami.
            </p>
          </AnimateIn>
          <AnimateIn variant="fade-up" delay={300}>
            <p className="text-brand-text-muted/70 text-base italic mt-6">
              Karmienie skóry tym, co ona już zna.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 small:py-24 bg-brand-surface">
        <div className="content-container">
          <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
            {productConfigs.map((config, i) => {
              const medusaProduct = productMap[config.handle]
              const variantId = medusaProduct?.variants?.[0]?.id || null
              let price = config.fallbackPrice
              if (medusaProduct) {
                try {
                  const { cheapestPrice } = getProductPrice({
                    product: medusaProduct,
                  })
                  if (cheapestPrice?.calculated_price) {
                    price = cheapestPrice.calculated_price
                  }
                } catch {}
              }
              const hasThumbnail = medusaProduct?.thumbnail

              return (
                <AnimateIn
                  key={config.name}
                  variant="fade-up"
                  delay={i * 150}
                  duration={800}
                >
                  <div className="p-8 rounded-sm border border-brand-border hover:border-brand-accent/30 transition-colors duration-300 text-center flex flex-col">
                    <LocalizedClientLink
                      href={config.href}
                      className="block group"
                    >
                      {hasThumbnail ? (
                        <div className="relative aspect-square bg-brand-background rounded-sm overflow-hidden mb-6">
                          <Thumbnail
                            thumbnail={medusaProduct.thumbnail}
                            images={medusaProduct.images}
                            size="full"
                            className="!rounded-sm !shadow-none"
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-square bg-brand-background rounded-sm flex items-center justify-center mb-6">
                          <div className="text-center">
                            <Icon
                              name={config.icon}
                              size={48}
                              className="mx-auto mb-2"
                            />
                            <p className="text-brand-text-muted/50 text-xs tracking-wider uppercase">
                              Zdjęcie wkrótce
                            </p>
                          </div>
                        </div>
                      )}
                      <h3 className="text-brand-text text-xl font-heading font-semibold mb-1 group-hover:text-brand-accent transition-colors">
                        {config.name}
                      </h3>
                      <p className="text-brand-accent text-sm mb-3">
                        {config.subtitle}
                      </p>
                      <span className="text-brand-primary text-lg font-semibold">
                        {price}
                      </span>
                      <p className="text-brand-text-muted/60 text-sm mt-3 group-hover:text-brand-accent transition-colors">
                        Dowiedz się więcej →
                      </p>
                    </LocalizedClientLink>

                    {/* Add to cart + store link */}
                    <div className="mt-4 pt-4 border-t border-brand-border space-y-2">
                      <AddToCartButton
                        variantId={variantId || ""}
                        disabled={!variantId}
                      />
                      <LocalizedClientLink
                          href={`/products/${config.handle}`}
                          className="block text-brand-text-muted/60 text-xs hover:text-brand-accent transition-colors"
                        >
                          Zobacz w sklepie →
                        </LocalizedClientLink>
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
