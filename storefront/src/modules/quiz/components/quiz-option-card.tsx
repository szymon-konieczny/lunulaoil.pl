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
        "hover:border-brand-primary/60 hover:bg-brand-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-brand-primary/40",
        selected
          ? "border-brand-primary bg-brand-primary/10 shadow-md"
          : "border-white/10 bg-brand-surface"
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
                selected ? "text-brand-primary-light" : "text-white"
              )}
            >
              {option.label}
            </span>
            {selected && (
              <span className="text-brand-primary text-sm">✓</span>
            )}
          </div>
          {option.description && (
            <p className="text-sm text-brand-text-muted mt-1 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
