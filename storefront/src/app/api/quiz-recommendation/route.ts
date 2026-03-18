import { NextRequest, NextResponse } from "next/server"

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

type QuizProduct = {
  title: string
  handle: string
  description: string
  tags: string[]
}

type RequestBody = {
  answers: Record<string, string | string[]>
  products: QuizProduct[]
}

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  skin_type: {
    dry: "sucha",
    oily: "tłusta",
    combination: "mieszana",
    normal: "normalna",
    sensitive: "wrażliwa",
  },
  concerns: {
    aging: "zmarszczki i utrata jędrności",
    dryness: "suchość i łuszczenie",
    glow: "brak blasku",
    imperfections: "niedoskonałości",
    scars: "blizny i rozstępy",
    hair: "pielęgnacja włosów",
  },
  body_area: {
    face: "twarz",
    body: "ciało",
    hair: "włosy",
    all: "całe ciało",
  },
  preference: {
    light: "lekka konsystencja",
    rich: "bogata konsystencja",
    any: "brak preferencji",
  },
}

function formatAnswers(answers: Record<string, string | string[]>): string {
  const lines: string[] = []
  for (const [stepId, answer] of Object.entries(answers)) {
    const values = Array.isArray(answer) ? answer : [answer]
    const labels = values.map((v) => ANSWER_LABELS[stepId]?.[v] || v)
    const stepLabel =
      stepId === "skin_type"
        ? "Typ skóry"
        : stepId === "concerns"
        ? "Problemy"
        : stepId === "body_area"
        ? "Obszar"
        : "Preferencje"
    lines.push(`${stepLabel}: ${labels.join(", ")}`)
  }
  return lines.join("\n")
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI recommendations not configured" },
      { status: 503 }
    )
  }

  try {
    const body: RequestBody = await request.json()
    const { answers, products } = body

    const formattedAnswers = formatAnswers(answers)
    const productList = products
      .map((p) => `- ${p.title}: ${p.description || "brak opisu"}`)
      .join("\n")

    const prompt = `Jesteś ekspertem od naturalnych kosmetyków w sklepie Lunula Oil & More, specjalizującym się w olejkach BIO z Maroka, Hiszpanii i Francji.

Klient wypełnił quiz doboru kosmetyków z następującymi odpowiedziami:

${formattedAnswers}

Dostępne produkty w sklepie:
${productList}

Na podstawie odpowiedzi klienta, zaproponuj 1 (maksymalnie 2-3) najlepiej dopasowane produkty i napisz krótką (3-5 zdań), ciepłą i profesjonalną rekomendację po polsku. Wyjaśnij dlaczego ten konkretny produkt jest idealny dla klienta. Na koniec zawsze zaproponuj udział w warsztatach Slow Care, gdzie klient nauczy się tworzyć własną rutynę pielęgnacyjną z naturalnymi olejkami. Nie używaj nagłówków ani punktorów — pisz naturalnym, ciepłym tonem jak doradca w butikowym sklepie z kosmetykami.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Anthropic API error:", error)
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      )
    }

    const data = await response.json()
    const recommendation =
      data.content?.[0]?.text || "Nie udało się wygenerować rekomendacji."

    return NextResponse.json({ recommendation })
  } catch (error) {
    console.error("Quiz recommendation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
