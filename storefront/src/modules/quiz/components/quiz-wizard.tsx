"use client"

import { useState, useCallback, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { quizSteps, QuizAnswers } from "../data"
import QuizOptionCard from "./quiz-option-card"
import QuizProgress from "./quiz-progress"
import QuizResults from "./quiz-results"

type Props = {
  allProducts: HttpTypes.StoreProduct[]
}

export default function QuizWizard({ allProducts }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [showResults, setShowResults] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  const step = quizSteps[currentStep]
  const isLastStep = currentStep === quizSteps.length - 1
  const canProceed = !!answers[step?.id]

  const handleSelect = useCallback(
    (value: string) => {
      setAnswers((prev) => {
        if (step.type === "multiple") {
          const current = (prev[step.id] as string[]) || []
          const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]
          return { ...prev, [step.id]: updated }
        }
        return { ...prev, [step.id]: value }
      })
    },
    [step]
  )

  const isSelected = (value: string) => {
    const answer = answers[step.id]
    if (Array.isArray(answer)) return answer.includes(value)
    return answer === value
  }

  const handleNext = () => {
    if (isLastStep) {
      setShowResults(true)
      fetchAiRecommendation(answers)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setAiRecommendation(null)
  }

  const fetchAiRecommendation = async (quizAnswers: QuizAnswers) => {
    setAiLoading(true)
    try {
      const res = await fetch("/api/quiz-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: quizAnswers,
          products: allProducts.map((p) => ({
            title: p.title,
            handle: p.handle,
            description: p.description,
            tags: p.tags?.map((t) => t.value) || [],
          })),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiRecommendation(data.recommendation)
      }
    } catch {
      // Silently fail — products are still shown
    } finally {
      setAiLoading(false)
    }
  }

  const scoredProducts = scoreProducts(allProducts, answers)

  if (showResults) {
    return (
      <QuizResults
        products={scoredProducts}
        answers={answers}
        aiRecommendation={aiRecommendation}
        loading={aiLoading}
        onReset={handleReset}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <QuizProgress
        currentStep={currentStep}
        totalSteps={quizSteps.length}
      />

      {/* Question */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl small:text-3xl font-semibold text-white mb-2">
          {step.question}
        </h2>
        {step.subtitle && (
          <p className="text-brand-text-muted text-base">{step.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {step.options.map((option) => (
          <QuizOptionCard
            key={option.value}
            option={option}
            selected={isSelected(option.value)}
            onClick={() => {
              handleSelect(option.value)
              setTimeout(() => {
                navRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
              }, 100)
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div ref={navRef} className="flex items-center justify-between pb-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={clx(
              "px-5 py-2.5 rounded-large text-sm font-medium transition-colors",
              currentStep === 0
                ? "text-white/20 cursor-not-allowed"
                : "text-white border border-white/20 hover:border-brand-primary/40"
            )}
          >
            Wstecz
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={clx(
              "px-8 py-2.5 rounded-large text-sm font-semibold transition-all duration-200",
              canProceed
                ? "bg-brand-primary text-black hover:bg-brand-primary-light shadow-lg"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            )}
          >
            {isLastStep ? "Zobacz wyniki" : "Dalej"}
          </button>
      </div>
    </div>
  )
}

/**
 * Score products based on quiz answers.
 * Uses product description + tags + metadata for keyword matching.
 */
function scoreProducts(
  products: HttpTypes.StoreProduct[],
  answers: QuizAnswers
): HttpTypes.StoreProduct[] {
  const keywordMap: Record<string, Record<string, string[]>> = {
    skin_type: {
      dry: ["sucha", "nawilż", "odżyw", "regenera", "masło", "olejek", "zmęczon", "miękkość"],
      oily: ["tłusta", "matuj", "oczyszcz", "lekk", "serum", "sebum", "regulacja sebum"],
      combination: ["mieszana", "równoważ", "balansu", "sebum", "regulacja sebum"],
      normal: ["pielęgnac", "nawilż", "ochrona", "równowag"],
      sensitive: ["wrażliwa", "łagod", "kojąc", "delikat", "ukojeni", "równowag"],
    },
    concerns: {
      aging: ["zmarszcz", "jędrn", "lifting", "kolagen", "retinol", "anti-age", "argano", "bakuchiol", "elastyczn", "dojrzał", "odnow", "ujędrni", "wygładz"],
      dryness: ["such", "nawilż", "odżyw", "masło", "regenera", "blask", "miękkość"],
      glow: ["blask", "rozświetl", "promien", "witamin", "złot", "glow", "witaln", "odżywieni"],
      imperfections: ["niedoskonał", "trądzik", "pory", "oczyszcz", "zaskórn", "problematyczn", "zapalne", "regulacja sebum"],
      scars: ["blizn", "rozstęp", "regenera", "nierówn"],
      hair: ["włos", "głow", "nabad", "odżyw"],
    },
    body_area: {
      face: ["twarz", "twarzy", "okolice oczu", "szyj", "krem"],
      body: ["ciał", "ciała", "dłoni", "dekolt", "masaż"],
      hair: ["włos", "głow"],
      all: ["uniwersaln", "wielofunkcyj", "ciał", "twarz"],
    },
    preference: {
      light: ["lekk", "szybko się wchłan", "serum", "matując"],
      rich: ["bogat", "intensywn", "masło", "odżyw", "aksamit"],
      any: [],
    },
  }

  const scored = products.map((product) => {
    let score = 0
    const text = [
      product.title || "",
      product.description || "",
      ...(product.tags?.map((t) => t.value) || []),
    ]
      .join(" ")
      .toLowerCase()

    for (const [stepId, answer] of Object.entries(answers)) {
      const values = Array.isArray(answer) ? answer : [answer]
      for (const val of values) {
        const keywords = keywordMap[stepId]?.[val] || []
        for (const kw of keywords) {
          if (text.includes(kw.toLowerCase())) {
            score += 1
          }
        }
      }
    }

    return { product, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.product)
}
