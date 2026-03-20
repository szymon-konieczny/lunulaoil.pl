import { Metadata } from "next"
import AnimateIn from "@modules/common/components/animate-in"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "HialCode — Kwas hialuronowy",
  description:
    "Serum z kwasem hialuronowym o wielocząsteczkowej formule. Intensywne nawilżenie w głębi skóry.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function HialCodePage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  let product: any = null
  if (region) {
    try {
      const { response } = await listProducts({
        countryCode,
        queryParams: { handle: "hialcode", limit: 1 },
      })
      product = response.products[0] || null
    } catch {}
  }

  const variantId = product?.variants?.[0]?.id
  let price: string | null = null
  try {
    if (product) {
      price = getProductPrice({ product }).cheapestPrice?.calculated_price ?? null
    }
  } catch {}

  return (
    <div className="bg-brand-background">
      <section className="py-20 small:py-32">
        <div className="content-container max-w-3xl mx-auto">
          <AnimateIn variant="fade-in" className="text-center mb-12">
            <span className="text-brand-accent text-sm tracking-[0.3em] uppercase font-medium">
              Biozgodna Pielęgnacja
            </span>
            <h1 className="text-3xl small:text-5xl font-heading font-bold text-brand-text mt-4 mb-2">
              HialCode
            </h1>
            <p className="text-brand-accent text-lg">Kwas hialuronowy</p>
            <p className="text-brand-primary text-2xl font-semibold mt-4">
              {price || "79 zł"}
            </p>
            {variantId && (
              <div className="mt-4">
                <AddToCartButton variantId={variantId} />
              </div>
            )}
            {product && (
              <LocalizedClientLink
                href="/products/hialcode"
                className="inline-flex items-center gap-1 text-brand-accent text-sm mt-3 hover:underline"
              >
                Zobacz w sklepie &rarr;
              </LocalizedClientLink>
            )}
          </AnimateIn>

          {/* Product image or placeholder */}
          <AnimateIn variant="fade-up" delay={100}>
            {product?.thumbnail ? (
              <div className="relative aspect-[4/3] bg-brand-surface rounded-sm overflow-hidden mb-12 border border-brand-border">
                <img src={product.thumbnail} alt="HialCode" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="relative aspect-[4/3] bg-brand-surface rounded-sm flex items-center justify-center mb-12 border border-brand-border">
                <div className="text-center">
                  <img src="/icons/water-drop.svg" alt="" className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-brand-text-muted/50 text-xs tracking-wider uppercase">
                    Zdjęcie wkrótce
                  </p>
                </div>
              </div>
            )}
          </AnimateIn>

          {/* Content */}
          <AnimateIn variant="fade-up" delay={200}>
            <div className="space-y-8">
              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Kwas hialuronowy — klucz do nawilżenia
                </h2>
                <p className="text-brand-text-muted text-base leading-relaxed">
                  Kwas hialuronowy to naturalny składnik skóry, który odpowiada
                  za jej nawilżenie i elastyczność. Jedna cząsteczka kwasu
                  hialuronowego jest w stanie przyciągnąć i zatrzymać ilość wody
                  tysiąckrotnie większą od swojej masy.
                </p>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Jak działa na skórę?
                </h2>
                <ul className="space-y-2 text-brand-text-muted text-base leading-relaxed">
                  <li>— intensywnie nawilża w głębi skóry</li>
                  <li>— wypełnia drobne zmarszczki od wewnątrz</li>
                  <li>— przywraca elastyczność i jędrność</li>
                  <li>— wzmacnia barierę ochronną skóry</li>
                  <li>— odpowiedni dla każdego typu cery</li>
                </ul>
              </div>

              <div className="p-6 border border-brand-accent/20 rounded-sm bg-brand-surface">
                <p className="text-brand-text-muted text-base leading-relaxed">
                  HialCode idealnie sprawdza się w połączeniu z SqualaneCode lub
                  JojobaCode. Kwas hialuronowy intensywnie nawilża, a skwalan lub
                  jojoba pomagają zamknąć wilgoć w skórze, tworząc ochronną
                  barierę.
                </p>
              </div>

              <div className="text-center mt-8">
                <p className="text-brand-text font-semibold text-lg">
                  Nawilżenie, które skóra rozumie.
                </p>
                <p className="text-brand-accent text-base mt-2">
                  HialCode
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
