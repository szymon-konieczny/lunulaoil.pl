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
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-20 mx-auto border-b duration-200 bg-brand-surface border-brand-border">
        <nav className="content-container txt-xsmall-plus flex items-center justify-between w-full h-full text-small-regular text-brand-text-muted">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full small:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <ShopDropdown categories={navCategories} />
              <LocalizedClientLink
                className="hover:text-brand-accent transition-colors"
                href="/quiz"
              >
                Dobierz kosmetyk
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-brand-accent transition-colors"
                href="/about"
              >
                O marce
              </LocalizedClientLink>
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              <Image
                src="/logo-botanique.jpeg"
                alt="Lunula Botanique"
                width={165}
                height={138}
                className="h-16 w-auto"
                priority
              />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <LocalizedClientLink
              className="hidden small:block hover:text-brand-accent transition-colors"
              href="/account"
              data-testid="nav-account-link"
            >
              Konto
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-brand-accent flex gap-2 transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Koszyk (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
