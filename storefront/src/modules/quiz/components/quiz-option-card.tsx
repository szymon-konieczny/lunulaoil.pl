"use client"

import { clx } from "@medusajs/ui"
import { QuizOption } from "../data"
import { quizIcons } from "./quiz-icons"

type Props = {
  option: QuizOption
  selected: boolean
  onClick: () => void
}

export default function QuizOptionCard({ option, selected, onClick }: Props) {
  const IconComponent = option.icon ? quizIcons[option.icon] : null

  return (
    <button
      type="button"
      onClick={onClick}
      className={clx(
        "w-full text-left p-5 rounded-large border transition-all duration-200",
        "hover:border-brand-accent/60 hover:bg-brand-accent/5",
        "focus:outline-none focus:ring-2 focus:ring-brand-accent/40",
        selected
          ? "border-brand-accent bg-brand-accent/10 shadow-md"
          : "border-white/10 bg-brand-surface"
      )}
    >
      <div className="flex items-start gap-4">
        {IconComponent && (
          <span
            className={clx(
              "flex-shrink-0 mt-0.5 transition-colors duration-200",
              selected ? "text-brand-accent" : "text-brand-text-muted"
            )}
          >
            <IconComponent className="w-6 h-6" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span
              className={clx(
                "font-semibold text-base",
                selected ? "text-brand-accent-light" : "text-white"
              )}
            >
              {option.label}
            </span>
            {selected && (
              <svg
                className="w-4 h-4 text-brand-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
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
