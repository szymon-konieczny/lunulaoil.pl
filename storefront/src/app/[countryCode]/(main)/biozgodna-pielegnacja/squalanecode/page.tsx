import { Metadata } from "next"
import AnimateIn from "@modules/common/components/animate-in"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import AddToCartButton from "@modules/products/components/add-to-cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "SqualaneCode — Skwalan",
  description:
    "Ultra lekki, suchy, niekomedogenny lipid. Stabilna forma skwalenu naturalnie występującego w ludzkim sebum.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function SqualaneCodePage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  let product: any = null
  if (region) {
    try {
      const { response } = await listProducts({
        countryCode,
        queryParams: { handle: "squalanecode", limit: 1 },
      })
      product = response.products[0] || null
    } catch {}
  }

  const variantId = product?.variants?.[0]?.id
  let price: string | null = null
  try {
    if (product) {
      price =
        getProductPrice({ product }).cheapestPrice?.calculated_price ?? null
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
              SqualaneCode
            </h1>
            <p className="text-brand-accent text-lg">
              Ultra lekki, suchy, niekomedogenny lipid
            </p>
            <p className="text-brand-primary text-2xl font-semibold mt-4">
              {price || "59 zł"}
            </p>
            {variantId && (
              <div className="mt-4">
                <AddToCartButton variantId={variantId} />
              </div>
            )}
            {product && (
              <LocalizedClientLink
                href="/products/squalanecode"
                className="inline-flex items-center gap-1 text-brand-accent text-sm mt-3 hover:underline"
              >
                Zobacz w sklepie &rarr;
              </LocalizedClientLink>
            )}
          </AnimateIn>

          {/* Product image or placeholder */}
          <AnimateIn variant="fade-up" delay={100}>
            <div className="relative aspect-[4/3] bg-brand-surface rounded-sm flex items-center justify-center mb-12 border border-brand-border">
              {product?.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title || "SqualaneCode"}
                  className="object-contain w-full h-full rounded-sm"
                />
              ) : (
                <div className="text-center">
                  <span className="text-5xl block mb-2">🫧</span>
                  <p className="text-brand-text-muted/50 text-xs tracking-wider uppercase">
                    Zdjęcie wkrótce
                  </p>
                </div>
              )}
            </div>
          </AnimateIn>

          {/* Content */}
          <AnimateIn variant="fade-up" delay={200}>
            <div className="space-y-8">
              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Skwalan — co to właściwie jest?
                </h2>
                <p className="text-brand-text-muted text-base leading-relaxed">
                  Skwalan to stabilna, uwodorniona forma skwalenu — lipidu, który
                  naturalnie występuje w ludzkim sebum. Dzięki temu jest
                  biokompatybilny ze skórą: dobrze tolerowany, lekki i niekomedogenny.
                </p>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Jak działa na skórę twarzy?
                </h2>
                <ul className="space-y-2 text-brand-text-muted text-base leading-relaxed">
                  <li>— wzmacnia barierę hydrolipidową</li>
                  <li>— ogranicza transepidermalną utratę wody (TEWL)</li>
                  <li>— zmiękcza i wygładza skórę</li>
                  <li>— poprawia elastyczność bez efektu ciężkości</li>
                  <li>— odpowiedni także dla skóry wrażliwej i trądzikowej</li>
                </ul>
              </div>

              <div className="p-6 border border-brand-border rounded-sm">
                <h3 className="text-brand-text text-base font-semibold mb-2">
                  Ciekawostka
                </h3>
                <p className="text-brand-text-muted text-sm leading-relaxed">
                  Z wiekiem ilość skwalenu w skórze spada, co sprzyja przesuszeniu
                  i nadreaktywności. Skwalan uzupełnia ten niedobór, nie zaburzając
                  naturalnych procesów skóry.
                </p>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  A włosy?
                </h2>
                <ul className="space-y-2 text-brand-text-muted text-base leading-relaxed">
                  <li>— wygładza łuskę włosa</li>
                  <li>— nadaje połysk</li>
                  <li>— chroni końcówki przed łamaniem</li>
                  <li>— nie obciąża nawet cienkich i delikatnych włosów</li>
                </ul>
              </div>

              <div>
                <h2 className="text-brand-accent text-lg font-heading font-semibold mb-4">
                  Dlaczego skwalan, a nie skwalen?
                </h2>
                <p className="text-brand-text-muted text-base leading-relaxed mb-4">
                  Skwalen łatwo się utlenia. Skwalan jest chemicznie stabilny,
                  odporny na światło i tlen, dlatego znacznie lepiej sprawdza się
                  w kosmetykach.
                </p>
                <p className="text-brand-text-muted text-base leading-relaxed">
                  Minimalistyczny skład. Wysoka tolerancja. Funkcja, którą skóra
                  rozumie.
                </p>
              </div>

              <div className="p-6 border border-brand-accent/20 rounded-sm bg-brand-surface">
                <p className="text-brand-text-muted text-base leading-relaxed mb-2">
                  Idealnie sprawdza się w połączeniu z HialCode — serum
                  hialuronowym. Kwas hialuronowy intensywnie nawilża, a skwalan
                  pomaga utrzymać wilgoć w skórze.
                </p>
              </div>

              <div className="text-center mt-8 space-y-2">
                <p className="text-brand-text-muted/70 text-base italic">
                  Skwalan to olej ciszy. Nie pachnie. Nie dominuje.
                </p>
                <p className="text-brand-text-muted/70 text-base italic">
                  Dostosowuje się do rytmu skóry i włosów, zamiast go narzucać.
                </p>
                <p className="text-brand-text font-semibold text-lg mt-4">
                  Minimalizm, który działa. To jest właśnie Code.
                </p>
                <p className="text-brand-accent text-base mt-2">
                  Skóra rozumie ten język.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
