"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "../product-preview"

type Props = {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

export default function RelatedProductsCarousel({ products, region }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)
    return () => {
      el.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector("li")?.offsetWidth || 280
    const gap = 24
    const distance = (cardWidth + gap) * 2
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative group">
      {/* Left arrow — always rendered, visibility via opacity */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-brand-border shadow-md items-center justify-center text-brand-text-muted hover:text-brand-accent hover:border-brand-accent/40 transition-opacity duration-200 hidden medium:flex ${
          canScrollLeft ? "group-hover:opacity-100 opacity-0" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Przewiń w lewo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overscroll-x-contain scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="list-none shrink-0 w-[calc(50%-12px)] small:w-[calc(33.333%-16px)] medium:w-[calc(25%-18px)]"
          >
            <ProductPreview region={region} product={product} />
          </li>
        ))}
      </div>

      {/* Right arrow — always rendered, visibility via opacity */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 rounded-full bg-white border border-brand-border shadow-md items-center justify-center text-brand-text-muted hover:text-brand-accent hover:border-brand-accent/40 transition-opacity duration-200 hidden medium:flex ${
          canScrollRight ? "group-hover:opacity-100 opacity-0" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Przewiń w prawo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
