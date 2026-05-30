import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import { retrieveIsB2B } from "@lib/data/customer"
import { PriceModeProvider } from "@lib/context/price-mode-context"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isB2B = await retrieveIsB2B()

  return (
    <PriceModeProvider mode={isB2B ? "net" : "gross"}>
    <div className="w-full bg-brand-background relative small:min-h-screen">
      <div className="h-16 bg-brand-surface border-b ">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
              Wróć do koszyka
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Wróć
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex items-center justify-center hover:opacity-90 transition-opacity"
            data-testid="store-link"
          >
            <Image
              src="/logo-botanique.png"
              alt="Lunula Botanique"
              width={250}
              height={210}
              className="w-auto h-12"
              priority
            />
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div>
    </div>
    </PriceModeProvider>
  )
}
