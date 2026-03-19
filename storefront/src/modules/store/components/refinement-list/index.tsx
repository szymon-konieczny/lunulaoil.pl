"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { clx } from "@medusajs/ui"

import { SortOptions } from "./sort-products"

export type CategoryItem = {
  id: string
  name: string
  handle: string
}

type RefinementListProps = {
  sortBy: SortOptions
  categories?: CategoryItem[]
  activeCategory?: string
  search?: boolean
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Nowości" },
  { value: "price_asc", label: "Cena ↑" },
  { value: "price_desc", label: "Cena ↓" },
]

const RefinementList = ({
  sortBy,
  categories,
  activeCategory,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(
    searchParams.get("q") || ""
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      if (name !== "page") {
        params.delete("page")
      }
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQueryParams("q", searchValue)
  }

  const countryPrefix = pathname.match(/^\/[a-z]{2}/)?.[0] || "/pl"

  return (
    <div className="w-full mb-6" data-testid={dataTestId}>
      <div className="flex flex-wrap items-center gap-2 small:gap-3">
        {/* Category chips */}
        {categories && categories.length > 0 && (
          <>
            <button
              onClick={() => router.push(`${countryPrefix}/store`)}
              className={clx(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer",
                !activeCategory
                  ? "bg-brand-accent text-black border-brand-accent"
                  : "border-white/20 text-white/70 hover:border-brand-accent/50 hover:text-white"
              )}
            >
              Wszystkie
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  router.push(`${countryPrefix}/categories/${cat.handle}`)
                }
                className={clx(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer",
                  activeCategory === cat.handle
                    ? "bg-brand-accent text-black border-brand-accent"
                    : "border-white/20 text-white/70 hover:border-brand-accent/50 hover:text-white"
                )}
              >
                {cat.name}
              </button>
            ))}

            <div className="w-px h-5 bg-white/10 mx-0.5 hidden small:block" />
          </>
        )}

        {/* Sort chips */}
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setQueryParams("sortBy", opt.value)}
            className={clx(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer",
              sortBy === opt.value
                ? "bg-white/10 text-white border-white/30"
                : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            )}
          >
            {opt.label}
          </button>
        ))}

        {/* Search toggle */}
        <div className="ml-auto flex items-center">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Szukaj..."
                autoFocus
                className="bg-white/5 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-accent/50 w-36 small:w-48"
                onBlur={() => {
                  if (!searchValue) setSearchOpen(false)
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchValue("")
                  setSearchOpen(false)
                  setQueryParams("q", "")
                }}
                className="text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-full border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 transition-all"
              aria-label="Szukaj"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RefinementList
