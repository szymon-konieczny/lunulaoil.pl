"use client"

import { MouseEvent, ReactNode } from "react"

type Props = {
  targetId: string
  children: ReactNode
  className?: string
}

export default function ScrollToButton({
  targetId,
  children,
  className = "",
}: Props) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label="Przewiń w dół"
    >
      {children}
    </button>
  )
}
