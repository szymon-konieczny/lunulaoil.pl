"use client"

import { useState, useRef, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ABOUT_LINKS = [
  {
    label: "Manifest",
    href: "/manifest",
    description: "Filozofia i wizja marki",
  },
  {
    label: "Historia",
    href: "/about",
    description: "Nasza droga i wartości",
  },
  {
    label: "Biozgodna pielęgnacja",
    href: "/biozgodna-pielegnacja",
    description: "Co to znaczy i dlaczego to ważne",
  },
] as const

export default function AboutDropdown() {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
      className="relative h-full flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <LocalizedClientLink
        href="/about"
        className="hover:text-brand-accent transition-colors flex items-center gap-1"
      >
        O marce
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

      {open && (
        <div className="absolute top-full left-0 mt-0 pt-2 z-50">
          <div className="bg-brand-surface border border-brand-border rounded-md shadow-lg min-w-[260px] py-2">
            {ABOUT_LINKS.map((link) => (
              <LocalizedClientLink
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 hover:bg-brand-surface-hover transition-colors group"
                onClick={() => setOpen(false)}
              >
                <div className="text-sm text-brand-text group-hover:text-brand-accent transition-colors">
                  {link.label}
                </div>
                <div className="text-xs text-brand-text-muted/60 mt-0.5">
                  {link.description}
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
