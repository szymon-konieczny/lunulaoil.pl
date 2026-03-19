"use client"

import { useRef } from "react"

const ScrollDownButton = ({ label = "Odkryj więcej" }: { label?: string }) => {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <div className="flex justify-center mt-8">
      <button
        ref={ref}
        onClick={() => {
          const section = ref.current?.closest("section") || ref.current?.closest("[id]")
          if (section) {
            const nextSection = section.nextElementSibling
            nextSection?.scrollIntoView({ behavior: "smooth" })
          }
        }}
        className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.2em] uppercase">{label}</span>
        <svg
          className="w-5 h-5 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  )
}

export default ScrollDownButton
