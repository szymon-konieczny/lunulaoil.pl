"use client"

import { useEffect, useRef, useState } from "react"
import { clx } from "@medusajs/ui"

type AnimateInProps = {
  children: React.ReactNode
  className?: string
  /** Animation variant */
  variant?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale"
  /** Delay in ms */
  delay?: number
  /** Duration in ms */
  duration?: number
  /** IntersectionObserver threshold (0–1) */
  threshold?: number
  /** Tag to render */
  as?: keyof JSX.IntrinsicElements
}

const variantStyles = {
  "fade-up": {
    hidden: "translate-y-8 opacity-0",
    visible: "translate-y-0 opacity-100",
  },
  "fade-in": {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  "fade-left": {
    hidden: "-translate-x-8 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  "fade-right": {
    hidden: "translate-x-8 opacity-0",
    visible: "translate-x-0 opacity-100",
  },
  scale: {
    hidden: "scale-95 opacity-0",
    visible: "scale-100 opacity-100",
  },
}

export default function AnimateIn({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.15,
  as: Tag = "div",
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const styles = variantStyles[variant]

  return (
    // @ts-ignore - dynamic tag
    <Tag
      ref={ref}
      className={clx(
        "transition-all ease-out",
        isVisible ? styles.visible : styles.hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
