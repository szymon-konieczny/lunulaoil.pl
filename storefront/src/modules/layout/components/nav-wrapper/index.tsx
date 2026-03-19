"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const SCROLL_THRESHOLD = 50

export default function NavWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Only the homepage has a full-bleed hero
  const isHomepage = pathname === "/" || /^\/[a-z]{2}$/.test(pathname)

  useEffect(() => {
    if (!isHomepage) {
      setScrolled(true)
      return
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomepage])

  return (
    <div
      data-scrolled={scrolled}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <header
        className={`relative mx-auto transition-all duration-300 ${
          scrolled ? "h-20" : "h-44"
        }`}
      >
        <nav
          className={`content-container txt-xsmall-plus flex justify-between w-full text-small-regular transition-colors duration-300 ${
            scrolled
              ? "text-brand-text-muted items-center"
              : "text-white/80 items-start pt-5"
          }`}
        >
          {children}
        </nav>
      </header>
    </div>
  )
}
