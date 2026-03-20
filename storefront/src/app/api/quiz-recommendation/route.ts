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
        return `- handle: "${p.handle}" | ${p.title}: ${p.description || "brak opisu"}${tags}`
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
- handles: tablica DOKŁADNIE 3 handle'ów w ŚCISŁEJ KOLEJNOŚCI: [główny produkt, uzupełniający produkt, warsztaty]. WYŁĄCZNIE z powyższej listy.
  1. Główny produkt — najlepiej dopasowany do potrzeb klienta (primary match)
  2. Uzupełniający produkt — komplementarny dodatek wzmacniający rytuał
  3. Warsztaty — najbardziej pasujące warsztaty (Slow Care/Slow Coffee Cream/Slow MakeUp)
- RÓŻNORODNOŚĆ KATEGORII: Produkt 1 i 2 MUSZĄ być z RÓŻNYCH kategorii produktowych. Przykłady dobrych par: krem + olej, krem + serum, olej + mydło, serum + olej. NIGDY nie rekomenduj dwóch produktów z tej samej kategorii (np. krem + krem, olej + olej).
- STRUKTURA REKOMENDACJI: Wybierz 2 najlepsze produkty pielęgnacyjne z RÓŻNYCH kategorii + 1 najbardziej pasujące warsztaty. Zawsze 3 pozycje.
- text: ZWIĘZŁA rekomendacja po polsku (4-6 zdań, NIE więcej). Opisz WSZYSTKIE 3 polecane pozycje (2 produkty + warsztaty) W TEJ SAMEJ KOLEJNOŚCI co handles — najpierw główny produkt, potem uzupełniający, na końcu warsztaty. Odwołaj się do filozofii biozgodności. Pisz naturalnym, POPRAWNYM polskim — jak native speaker. Ton: ciepły doradca w butikowym sklepie.
- BEZWZGLĘDNA SPÓJNOŚĆ handles↔tekst: handles i tekst muszą opisywać IDENTYCZNY zestaw W IDENTYCZNEJ KOLEJNOŚCI. Każdy handle musi być wspomniany w tekście. Przed odpowiedzią ZWERYFIKUJ.
- BEZWZGLĘDNY ZAKAZ: NIE WOLNO wspominać produktów spoza powyższej listy. Złamanie = błąd krytyczny.

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

      const isWorkshop = (p: QuizProduct) =>
        p.title.toLowerCase().includes("slow") ||
        p.title.toLowerCase().includes("warsztaty")

      // Extract distinctive name fragments from product title for text matching
      // Returns multi-word phrases and unique brand names, NOT generic words
      const titleSignatures = (title: string): string[] => {
        const sigs: string[] = []
        // Brand/product line names (CamelCase, *Code, ALL CAPS multi-word)
        const brandWords = title.match(/[A-Z][a-z]+[A-Z]\w+|\w+Code|[A-ZĄĆĘŁŃÓŚŹŻ]{2,}(?:\s+[A-ZĄĆĘŁŃÓŚŹŻ]{2,})+/g)
        if (brandWords) sigs.push(...brandWords)
        // Named product lines: "Geranium Glow", "Clear Ritual", "Rose Alchemy", etc.
        const namedLine = title.match(/^(.+?)(?:\s*[—–]\s*|$)/)?.[1]
        if (namedLine && namedLine.length > 3) sigs.push(namedLine.trim())
        // Subtitle after dash: "Moon Touch Cream", "Pure Touch Cream"
        const subtitle = title.match(/[—–]\s*(.+?)(?:\s+\d+ml)?$/)?.[1]
        if (subtitle && subtitle.length > 3) sigs.push(subtitle.trim())
        return sigs.map((s) => s.toLowerCase())
      }

      // Find earliest position of product mention in recommendation text
      const firstMentionIndex = (product: QuizProduct): number => {
        const lower = text.toLowerCase()
        const sigs = titleSignatures(product.title)
        if (sigs.length === 0) return -1
        const positions = sigs
          .map((sig) => lower.indexOf(sig))
          .filter((pos) => pos >= 0)
        // Must match at least one distinctive signature
        if (positions.length === 0) return -1
        return Math.min(...positions)
      }

      // Find products mentioned in text, sorted by order of appearance
      const mentionedProducts = products
        .map((p) => ({ product: p, position: firstMentionIndex(p) }))
        .filter((m) => m.position >= 0)
        .sort((a, b) => a.position - b.position)

      const mentionedSkincare = mentionedProducts
        .filter((m) => !isWorkshop(m.product))
        .map((m) => m.product.handle)
      const mentionedWorkshop = mentionedProducts
        .find((m) => isWorkshop(m.product))
        ?.product.handle

      // Fallbacks from AI handles or product list for unfilled slots
      const validAiHandles = handles.filter((h) =>
        products.some((p) => p.handle === h)
      )
      const fallbackSkincare = [
        ...validAiHandles.filter((h) => {
          const p = products.find((pr) => pr.handle === h)
          return p && !isWorkshop(p)
        }),
        ...products.filter((p) => !isWorkshop(p)).map((p) => p.handle),
      ]
      const fallbackWorkshop =
        validAiHandles.find((h) => {
          const p = products.find((pr) => pr.handle === h)
          return p && isWorkshop(p)
        }) || products.find((p) => isWorkshop(p))?.handle

      // Assemble: text-mentioned first, then fallbacks — deduplicated
      const allSkincare = [...mentionedSkincare, ...fallbackSkincare]
      const seen = new Set<string>()
      const skincare = allSkincare.filter((h) => {
        if (seen.has(h)) return false
        seen.add(h)
        return true
      }).slice(0, 2)
      const workshop = mentionedWorkshop || fallbackWorkshop
      const finalHandles = [...skincare, ...(workshop ? [workshop] : [])]

      return NextResponse.json({
        recommendation: text,
        handles: finalHandles,
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
