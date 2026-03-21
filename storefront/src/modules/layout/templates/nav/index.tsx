import { Suspense } from "react"
import Image from "next/image"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { listCategories, normalizeHandle } from "@lib/data/categories"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import ShopDropdown from "@modules/layout/components/shop-dropdown"
import NavWrapper from "@modules/layout/components/nav-wrapper"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories().catch(() => []),
  ])

  // Normalize handles for URL-safe links
  const navCategories = (categories || []).map((c) => ({
    id: c.id,
    name: c.name,
    handle: normalizeHandle(c.handle),
    parent_category_id: c.parent_category?.id || null,
  }))

  return (
    <NavWrapper>
      <div className="flex-1 basis-0 h-full flex items-center">
        <div className="small:hidden flex items-center">
          <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
        </div>
        <div className="hidden small:flex items-center gap-x-8 text-sm">
          <ShopDropdown categories={navCategories} />
          <LocalizedClientLink
            className="hover:text-brand-accent transition-colors"
            href="/quiz"
          >
            Dobierz kosmetyk
          </LocalizedClientLink>
          <LocalizedClientLink
            className="hover:text-brand-accent transition-colors"
            href="/leksykon"
          >
            Leksykon
          </LocalizedClientLink>
          <LocalizedClientLink
            className="hover:text-brand-accent transition-colors"
            href="/about"
          >
            O marce
          </LocalizedClientLink>
          <LocalizedClientLink
            className="hover:text-brand-accent transition-colors"
            href="/dla-salonow"
          >
            Dla salonów
          </LocalizedClientLink>
        </div>
      </div>

      <div className="flex items-center h-full">
        <LocalizedClientLink
          href="/"
          className="relative flex items-center justify-center hover:opacity-90 transition-opacity"
          data-testid="nav-store-link"
        >
          {/* Translucent circle behind logo — visible only on hero (not scrolled) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 small:w-44 small:h-44 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-300 [[data-scrolled='true']_&]:opacity-0 pointer-events-none" />
          <Image
            src="/logo-botanique.png"
            alt="Lunula Botanique"
            width={250}
            height={210}
            className="relative w-auto transition-all duration-300 h-16 small:h-24 [[data-scrolled='true']_&]:h-9 small:[[data-scrolled='true']_&]:h-12"
            priority
          />
        </LocalizedClientLink>
      </div>

      <div className="flex items-center gap-x-8 flex-1 basis-0 justify-end text-sm">
        <LocalizedClientLink
          className="hidden small:block hover:text-brand-accent transition-colors"
          href="/account"
          data-testid="nav-account-link"
        >
          Konto
        </LocalizedClientLink>
        <Suspense
          fallback={
            <>
              {/* Mobile fallback: cart icon */}
              <LocalizedClientLink
                className="small:hidden hover:text-brand-accent transition-colors"
                href="/cart"
                data-testid="nav-cart-link-mobile"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </LocalizedClientLink>
              {/* Desktop fallback: text */}
              <LocalizedClientLink
                className="hidden small:block hover:text-brand-accent transition-colors"
                href="/cart"
                data-testid="nav-cart-link"
              >
                Koszyk (0)
              </LocalizedClientLink>
            </>
          }
        >
          <CartButton />
        </Suspense>
      </div>
    </NavWrapper>
  )
}
