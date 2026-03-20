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

Na podstawie odpowiedzi, wybierz produkty i napisz rekomendację.

ODPOWIEDZ W FORMACIE JSON:
{
  "handles": ["handle-produktu-1", "handle-produktu-2"],
  "text": "Treść rekomendacji..."
}

ZASADY:
- handles: tablica handle'ów DOKŁADNIE tych produktów, o których piszesz w tekście — WYŁĄCZNIE z powyższej listy
- text: ZWIĘZŁA rekomendacja po polsku (4-6 zdań, NIE więcej). Wyjaśnij krótko dlaczego produkty są idealne — odwołaj się do filozofii biozgodności. Możesz zasugerować łączenie polecanych produktów. Na koniec jednym zdaniem zaproponuj warsztaty Slow Care (jeśli są na liście, DODAJ ich handle do handles). Pisz naturalnym, POPRAWNYM polskim — bez kośławych konstrukcji, jak native speaker. Ton: ciepły doradca w butikowym sklepie.
- BEZWZGLĘDNA SPÓJNOŚĆ handles↔tekst: handles i tekst muszą opisywać IDENTYCZNY zestaw produktów. Nie wolno umieszczać w handles produktu, o którym nie piszesz. Nie wolno pisać o produkcie, którego nie ma w handles. Przed odpowiedzią ZWERYFIKUJ tę spójność.
- BEZWZGLĘDNY ZAKAZ: NIE WOLNO wspominać w tekście ŻADNYCH produktów, których nie ma na powyższej liście "Dostępne produkty w sklepie". Złamanie tej zasady to błąd krytyczny.

BEZWZGLĘDNE ZASADY FORMY TEKSTU:
- Zwracaj się WYŁĄCZNIE na "Ty" (np. "Twoja skóra", "dla Ciebie", "polecam Ci")
- NIGDY nie używaj formy "Pani/Pan"
- NIGDY nie wymyślaj imienia
- NIE zaczynaj od zwrotu grzecznościowego
- Pisz z szacunkiem, ale bezpośrednio i po przyjacielsku

Odpowiedz TYLKO poprawnym JSON-em, bez żadnego innego tekstu.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
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
    const rawText = data.content?.[0]?.text || ""

    try {
      // Strip markdown code fences if present (e.g. ```json ... ```)
      const cleanText = rawText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim()
      const parsed = JSON.parse(cleanText)
      const text = parsed.text || rawText
      const handles: string[] = parsed.handles || []

      // Only keep handles that exist in the product catalog
      const validHandles = handles.filter((handle: string) =>
        products.some((p) => p.handle === handle)
      )

      return NextResponse.json({
        recommendation: text,
        handles: validHandles,
      })
    } catch {
      // Fallback: AI returned plain text instead of JSON
      return NextResponse.json({
        recommendation: rawText || "Nie udało się wygenerować rekomendacji.",
        handles: [],
      })
    }
  } catch (error) {
    console.error("Quiz recommendation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
