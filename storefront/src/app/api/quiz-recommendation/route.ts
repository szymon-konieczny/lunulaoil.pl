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
      .map((p) => {
        const tags = p.tags.length ? ` [${p.tags.join(", ")}]` : ""
        return `- ${p.title}: ${p.description || "brak opisu"}${tags}`
      })
      .join("\n")

    const prompt = `Jesteś ekspertem od biozgodnej pielęgnacji w sklepie Lunula Botanique. Specjalizujesz się w trzech liniach produktów:
1. Biozgodna Pielęgnacja Twarzy — HialCode (kwas hialuronowy), SqualaneCode (skwalan), JojobaCode (olej jojoba)
2. Kremy Rytualne — Geranium Glow, Golden Glow, Rose Alchemy, Clear Ritual
3. Oleje Lunula Oil — naturalne olejki do pielęgnacji twarzy, ciała i włosów
4. Mydła rytualne Lunula Slavic Soap — Rusałka, Różyczka, Mokosza

Filozofia marki: biozgodność — składniki rozpoznawalne przez skórę, które wspierają jej naturalne procesy zamiast je zaburzać. Karmienie skóry tym, co ona już zna.

Klient wypełnił quiz doboru kosmetyków z następującymi odpowiedziami:

${formattedAnswers}

Dostępne produkty w sklepie:
${productList}

Na podstawie odpowiedzi klienta, zaproponuj 1 (maksymalnie 2-3) najlepiej dopasowane produkty i napisz krótką (3-5 zdań), ciepłą i profesjonalną rekomendację po polsku. Wyjaśnij dlaczego ten konkretny produkt jest idealny dla klienta — odwołuj się do filozofii biozgodności. Sugeruj łączenie produktów (np. HialCode + SqualaneCode). Na koniec zaproponuj udział w warsztatach Slow Care. Nie używaj nagłówków ani punktorów — pisz naturalnym, ciepłym tonem jak doradca w butikowym sklepie z kosmetykami. WAŻNE: Nie wymyślaj imienia klienta — nie znasz go. Zwracaj się bezosobowo lub w drugiej osobie (np. "Twoja skóra", "dla Ciebie").`

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
