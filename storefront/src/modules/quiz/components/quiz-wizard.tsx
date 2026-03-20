"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { quizSteps, QuizAnswers } from "../data"
import QuizOptionCard from "./quiz-option-card"
import QuizProgress from "./quiz-progress"
import QuizResults from "./quiz-results"

type Props = {
  allProducts: HttpTypes.StoreProduct[]
}

const STORAGE_KEY = "lunula-quiz-state"

function loadSavedState(): {
  answers: QuizAnswers
  showResults: boolean
  aiRecommendation: string | null
  currentStep: number
} | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export default function QuizWizard({ allProducts }: Props) {
  const searchParams = useSearchParams()
  const shouldReset = searchParams.get("reset") === "1"

  // Clear saved state if ?reset=1
  const saved = (() => {
    if (shouldReset) {
      try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
      return null
    }
    return typeof window !== "undefined" ? loadSavedState() : null
  })()

  const [currentStep, setCurrentStep] = useState(saved?.currentStep ?? 0)
  const [answers, setAnswers] = useState<QuizAnswers>(saved?.answers ?? {})
  const [showResults, setShowResults] = useState(saved?.showResults ?? false)
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(
    saved?.aiRecommendation ?? null
  )
  const [aiLoading, setAiLoading] = useState(false)
  const [aiHandles, setAiHandles] = useState<string[]>(
    saved?.aiHandles ?? []
  )
  const navRef = useRef<HTMLDivElement>(null)

  // Persist state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, showResults, aiRecommendation, aiHandles, currentStep })
      )
    } catch {}
  }, [answers, showResults, aiRecommendation, aiHandles, currentStep])

  // Re-fetch AI recommendation on restore if results shown but no recommendation
  useEffect(() => {
    if (showResults && !aiRecommendation && !aiLoading && Object.keys(answers).length > 0) {
      fetchAiRecommendation(answers)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    setAiHandles([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const fetchAiRecommendation = async (quizAnswers: QuizAnswers) => {
    setAiLoading(true)
    try {
      // Send only scored/matched products so AI recommends from the displayed list
      const matched = scoreProducts(allProducts, quizAnswers)
      const res = await fetch("/api/quiz-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: quizAnswers,
          products: matched.map((p) => ({
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
        if (data.handles?.length) {
          setAiHandles(data.handles)
        }
      }
    } catch {
      // Silently fail — products are still shown
    } finally {
      setAiLoading(false)
    }
  }

  const scoredProducts = scoreProducts(allProducts, answers)
  // If AI returned specific handles, display ONLY those products in AI's order
  const displayProducts = aiHandles.length > 0
    ? aiHandles
        .map((h) =>
          scoredProducts.find((p) => p.handle === h) ||
          allProducts.find((p) => p.handle === h)
        )
        .filter(Boolean) as typeof scoredProducts
    : scoredProducts

  if (showResults) {
    return (
      <QuizResults
        products={displayProducts.length > 0 ? displayProducts : scoredProducts}
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
        <h2 className="font-serif text-2xl small:text-3xl font-semibold text-brand-text mb-2">
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
                ? "text-brand-text-muted/40 cursor-not-allowed"
                : "text-brand-text border border-brand-border hover:border-brand-accent/40"
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
                ? "bg-brand-accent text-white hover:bg-brand-accent-light shadow-lg"
                : "bg-brand-border/50 text-brand-text-muted/50 cursor-not-allowed"
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
      dry: ["sucha", "nawilż", "odżyw", "regenera", "masło", "olejek", "zmęczon", "miękkość", "hialcode", "skwalan", "bariera hydrolipidow"],
      oily: ["tłusta", "matuj", "oczyszcz", "lekk", "serum", "sebum", "regulacja sebum", "jojoba", "squalanecode", "niekomedogenn"],
      combination: ["mieszana", "równoważ", "balansu", "sebum", "regulacja sebum", "jojoba", "samoreguluj"],
      normal: ["pielęgnac", "nawilż", "ochrona", "równowag", "biozgodn"],
      sensitive: ["wrażliwa", "łagod", "kojąc", "delikat", "ukojeni", "równowag", "rusałka", "rumianek", "lawend"],
    },
    concerns: {
      aging: ["zmarszcz", "jędrn", "lifting", "kolagen", "retinol", "anti-age", "argano", "bakuchiol", "elastyczn", "dojrzał", "odnow", "ujędrni", "wygładz", "hialcode", "kwas hialuronow"],
      dryness: ["such", "nawilż", "odżyw", "masło", "regenera", "blask", "miękkość", "hialcode", "skwalan", "bariera", "wilgoć"],
      glow: ["blask", "rozświetl", "promien", "witamin", "złot", "glow", "witaln", "odżywieni", "różyczka", "glinka"],
      imperfections: ["niedoskonał", "trądzik", "pory", "oczyszcz", "zaskórn", "problematyczn", "zapalne", "regulacja sebum", "jojoba", "niekomedogenn"],
      scars: ["blizn", "rozstęp", "regenera", "nierówn"],
      hair: ["włos", "głow", "nabad", "odżyw", "jojoba", "skwalan", "końcówk"],
    },
    body_area: {
      face: ["twarz", "twarzy", "okolice oczu", "szyj", "krem", "hialcode", "squalanecode", "jojobacode", "biozgodn"],
      body: ["ciał", "ciała", "dłoni", "dekolt", "masaż", "mydło", "mydlo"],
      hair: ["włos", "głow", "jojoba", "skwalan"],
      all: ["uniwersaln", "wielofunkcyj", "ciał", "twarz", "jojoba"],
    },
    preference: {
      light: ["lekk", "szybko się wchłan", "serum", "matując", "skwalan", "squalanecode", "ultra lekk"],
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
