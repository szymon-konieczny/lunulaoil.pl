export type QuizStep = {
  id: string
  question: string
  subtitle?: string
  type: "single" | "multiple"
  options: QuizOption[]
}

export type QuizOption = {
  value: string
  label: string
  description?: string
  icon?: string
}

export type QuizAnswers = Record<string, string | string[]>

export const quizSteps: QuizStep[] = [
  {
    id: "skin_type",
    question: "Jaki jest Twój typ skóry?",
    subtitle: "Wybierz opcję, która najlepiej opisuje Twoją skórę na co dzień.",
    type: "single",
    options: [
      {
        value: "dry",
        label: "Sucha",
        description: "Skóra bywa ściągnięta, łuszczy się, brakuje jej nawilżenia",
        icon: "🏜️",
      },
      {
        value: "oily",
        label: "Tłusta",
        description: "Skóra się świeci, pojawiają się zaskórniki i rozszerzone pory",
        icon: "💧",
      },
      {
        value: "combination",
        label: "Mieszana",
        description: "Strefa T tłusta, policzki suche lub normalne",
        icon: "⚖️",
      },
      {
        value: "normal",
        label: "Normalna",
        description: "Skóra jest gładka, bez wyraźnych problemów",
        icon: "✨",
      },
      {
        value: "sensitive",
        label: "Wrażliwa",
        description: "Skóra łatwo się podrażnia, czerwieni, reaguje na kosmetyki",
        icon: "🌸",
      },
    ],
  },
  {
    id: "concerns",
    question: "Co chcesz poprawić?",
    subtitle: "Możesz wybrać kilka opcji.",
    type: "multiple",
    options: [
      {
        value: "aging",
        label: "Zmarszczki i utrata jędrności",
        description: "Skóra traci elastyczność, pojawiają się linie mimiczne",
        icon: "⏳",
      },
      {
        value: "dryness",
        label: "Suchość i łuszczenie",
        description: "Skóra potrzebuje głębokiego odżywienia",
        icon: "🏜️",
      },
      {
        value: "glow",
        label: "Brak blasku",
        description: "Skóra wygląda na zmęczoną i matową",
        icon: "💫",
      },
      {
        value: "imperfections",
        label: "Niedoskonałości",
        description: "Zaskórniki, podrażnienia, nierówny koloryt",
        icon: "🔍",
      },
      {
        value: "scars",
        label: "Blizny i rozstępy",
        description: "Ślady po trądziku, rozstępy, nierówności",
        icon: "🩹",
      },
      {
        value: "hair",
        label: "Pielęgnacja włosów",
        description: "Suche, łamiące się lub zniszczone włosy",
        icon: "💇",
      },
    ],
  },
  {
    id: "body_area",
    question: "Jaki obszar chcesz pielęgnować?",
    subtitle: "Wybierz główny obszar zastosowania.",
    type: "single",
    options: [
      {
        value: "face",
        label: "Twarz",
        description: "Skóra twarzy, okolice oczu, szyja",
        icon: "🧴",
      },
      {
        value: "body",
        label: "Ciało",
        description: "Skóra ciała, dekolt, dłonie",
        icon: "🧖",
      },
      {
        value: "hair",
        label: "Włosy i skóra głowy",
        description: "Pielęgnacja włosów od nasady po końce",
        icon: "💆",
      },
      {
        value: "all",
        label: "Wszędzie!",
        description: "Szukam uniwersalnego produktu",
        icon: "🌿",
      },
    ],
  },
  {
    id: "preference",
    question: "Jaka konsystencja Ci odpowiada?",
    subtitle: "To pomoże dobrać idealną formę produktu.",
    type: "single",
    options: [
      {
        value: "light",
        label: "Lekka i szybko się wchłania",
        description: "Preferuję lekkie olejki i serum",
        icon: "🍃",
      },
      {
        value: "rich",
        label: "Bogata i odżywcza",
        description: "Lubię intensywne odżywienie i ochronę",
        icon: "🍯",
      },
      {
        value: "any",
        label: "Nie mam preferencji",
        description: "Zaufam rekomendacji",
        icon: "🤷",
      },
    ],
  },
]

/**
 * Scoring rules: maps quiz answers to product tag values.
 * Each product in Medusa should have tags like:
 *   skin_type:dry, concern:aging, area:face, texture:light
 *
 * The scoring function checks how many of the user's answers
 * match a product's tags. Products with more matches rank higher.
 */
export type TagMatch = {
  tagPrefix: string
  answerStepId: string
}

export const tagMatchRules: TagMatch[] = [
  { tagPrefix: "skin_type", answerStepId: "skin_type" },
  { tagPrefix: "concern", answerStepId: "concerns" },
  { tagPrefix: "area", answerStepId: "body_area" },
  { tagPrefix: "texture", answerStepId: "preference" },
]
