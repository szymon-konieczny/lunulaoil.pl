"use client"

import { useState, useRef, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Category = {
  id: string
  name: string
  handle: string
  parent_category_id: string | null
  category_children?: Category[]
}

type ShopDropdownProps = {
  categories: Category[]
}

export default function ShopDropdown({ categories }: ShopDropdownProps) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Only show top-level categories (no parent)
  const topLevel = categories.filter((c) => !c.parent_category_id)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-full flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href="/store"
        className="hover:text-brand-accent transition-colors flex items-center gap-1"
      >
        Sklep
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </LocalizedClientLink>

      {open && topLevel.length > 0 && (
        <div className="absolute top-full left-0 mt-0 pt-2 z-50">
          <div className="bg-brand-surface border border-brand-border rounded-md shadow-lg min-w-[220px] py-2">
            {/* Pinned brand line */}
            <LocalizedClientLink
              href="/biozgodna-pielegnacja"
              className="block px-4 py-2 text-sm font-medium text-brand-accent hover:bg-brand-surface-hover transition-colors"
              onClick={() => setOpen(false)}
            >
              Lunula Botanique
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/mydla-rytualne"
              className="block px-4 py-2 text-sm text-brand-text-muted hover:text-brand-accent hover:bg-brand-surface-hover transition-colors"
              onClick={() => setOpen(false)}
            >
              Mydła Rytualne
            </LocalizedClientLink>
            {topLevel.length > 0 && (
              <div className="border-t border-brand-border my-1" />
            )}
            {topLevel.map((category) => (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="block px-4 py-2 text-sm text-brand-text-muted hover:text-brand-accent hover:bg-brand-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                {category.name}
              </LocalizedClientLink>
            ))}
            <div className="border-t border-brand-border mt-1 pt-1">
              <LocalizedClientLink
                href="/store"
                className="block px-4 py-2 text-sm text-brand-text-muted hover:text-brand-accent hover:bg-brand-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                Wszystkie produkty
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/leksykon"
                className="block px-4 py-2 text-sm text-brand-text-muted hover:text-brand-accent hover:bg-brand-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                Leksykon Składników
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
