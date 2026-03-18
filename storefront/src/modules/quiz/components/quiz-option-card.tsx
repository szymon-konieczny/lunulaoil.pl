"use client"

import { clx } from "@medusajs/ui"
import { QuizOption } from "../data"

type Props = {
  option: QuizOption
  selected: boolean
  onClick: () => void
}

export default function QuizOptionCard({ option, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clx(
        "w-full text-left p-5 rounded-large border transition-all duration-200",
        "hover:border-primary/60 hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary/40",
        selected
          ? "border-primary bg-primary/10 shadow-md"
          : "border-white/10 bg-surface"
      )}
    >
      <div className="flex items-start gap-4">
        {option.icon && (
          <span className="text-2xl flex-shrink-0 mt-0.5">{option.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span
              className={clx(
                "font-semibold text-base",
                selected ? "text-primary-light" : "text-white"
              )}
            >
              {option.label}
            </span>
            {selected && (
              <span className="text-primary text-sm">✓</span>
            )}
          </div>
          {option.description && (
            <p className="text-sm text-text-muted mt-1 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
