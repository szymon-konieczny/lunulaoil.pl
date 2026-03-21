"use client"

import { useState } from "react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type MenuItem = {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const SIDE_MENU_ITEMS: MenuItem[] = [
  { label: "Strona główna", href: "/" },
  {
    label: "Sklep",
    href: "/store",
    children: [
      { label: "Twarz", href: "/categories/twarz" },
      { label: "Ciało", href: "/categories/cialo" },
      { label: "Rytuał", href: "/categories/rytual" },
      { label: "Włosy", href: "/categories/wlosy" },
      { label: "Wszystkie produkty", href: "/store" },
    ],
  },
  { label: "Dobierz kosmetyk", href: "/quiz" },
  { label: "Leksykon składników", href: "/leksykon" },
  { label: "O marce", href: "/about" },
  { label: "Dla salonów", href: "/dla-salonow" },
  { label: "Konto", href: "/account" },
  { label: "Koszyk", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const HamburgerIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
    />
  </svg>
)

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <button
          data-testid="nav-menu-button"
          className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-brand-accent"
          aria-label="Open menu"
          onClick={open}
        >
          <HamburgerIcon />
        </button>

        {/* Full-screen overlay menu */}
        {isOpen && (
          <>
            {/* Backdrop — only visible on tablet+ as dark overlay */}
            <div
              className="fixed inset-0 z-[900] sm:bg-black/40"
              onClick={close}
              data-testid="side-menu-backdrop"
            />

            {/* Menu panel */}
            <div
              data-testid="nav-menu-popup"
              className="fixed top-0 left-0 w-screen h-screen sm:w-80 sm:h-[calc(100vh-1rem)] sm:m-2 sm:rounded-rounded z-[901] flex flex-col bg-white sm:bg-white/95 sm:backdrop-blur-2xl justify-between p-6 text-sm text-brand-text"
            >
              <div className="flex justify-end">
                <button
                  data-testid="close-menu-button"
                  onClick={close}
                  aria-label="Close menu"
                >
                  <XMark className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col gap-6 items-center sm:items-start justify-center flex-1 sm:flex-initial sm:justify-start">
                {SIDE_MENU_ITEMS.map((item) => (
                  <li key={item.href} className="text-center sm:text-left">
                    {item.children ? (
                      <div>
                        <button
                          className="text-2xl sm:text-xl leading-8 hover:text-brand-accent transition-colors flex items-center gap-2 mx-auto sm:mx-0"
                          onClick={() =>
                            setExpandedItem(
                              expandedItem === item.href ? null : item.href
                            )
                          }
                        >
                          {item.label}
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedItem === item.href ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {expandedItem === item.href && (
                          <ul className="mt-3 flex flex-col gap-3 pl-0 sm:pl-4">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <LocalizedClientLink
                                  href={child.href}
                                  className="text-lg sm:text-base text-brand-text-muted hover:text-brand-accent transition-colors"
                                  onClick={close}
                                >
                                  {child.label}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <LocalizedClientLink
                        href={item.href}
                        className="text-2xl sm:text-xl leading-8 hover:text-brand-accent transition-colors"
                        onClick={close}
                        data-testid={`${item.href.replace("/", "") || "home"}-link`}
                      >
                        {item.label}
                      </LocalizedClientLink>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-y-6">
                {!!locales?.length && (
                  <div
                    className="flex justify-between"
                    onMouseEnter={languageToggleState.open}
                    onMouseLeave={languageToggleState.close}
                  >
                    <LanguageSelect
                      toggleState={languageToggleState}
                      locales={locales}
                      currentLocale={currentLocale}
                    />
                    <ArrowRightMini
                      className={clx(
                        "transition-transform duration-150",
                        languageToggleState.state ? "-rotate-90" : ""
                      )}
                    />
                  </div>
                )}
                <div
                  className="flex justify-between"
                  onMouseEnter={countryToggleState.open}
                  onMouseLeave={countryToggleState.close}
                >
                  {regions && (
                    <CountrySelect
                      toggleState={countryToggleState}
                      regions={regions}
                    />
                  )}
                  <ArrowRightMini
                    className={clx(
                      "transition-transform duration-150",
                      countryToggleState.state ? "-rotate-90" : ""
                    )}
                  />
                </div>
                <Text className="flex justify-between txt-compact-small">
                  © {new Date().getFullYear()} Lunula Botanique. Wszelkie prawa
                  zastrzeżone.
                </Text>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SideMenu
