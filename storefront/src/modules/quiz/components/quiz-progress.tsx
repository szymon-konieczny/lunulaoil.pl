"use client"

import { clx } from "@medusajs/ui"

type Props = {
  currentStep: number
  totalSteps: number
}

export default function QuizProgress({ currentStep, totalSteps }: Props) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-text-muted">
          Krok {currentStep + 1} z {totalSteps}
        </span>
        <span className="text-sm text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-dark to-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
