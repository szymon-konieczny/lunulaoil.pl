import { Metadata } from "next"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import QuizWizard from "@modules/quiz/components/quiz-wizard"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Dobierz kosmetyki — Quiz pielęgnacyjny",
  description:
    "Odpowiedz na kilka pytań, a pomożemy Ci dobrać idealne naturalne kosmetyki do Twoich potrzeb.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function QuizPage(props: Props) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 100 },
  })

  return (
    <div className="content-container py-12 small:py-20 min-h-[80vh]">
      {/* Header — only on quiz steps, QuizWizard handles results header */}
      <div className="text-center mb-12">
        <span className="text-brand-primary text-sm font-medium uppercase tracking-wider">
          Asystent doboru
        </span>
        <h1 className="text-3xl small:text-5xl font-serif font-semibold text-white mt-3 mb-4">
          Znajdź swój idealny kosmetyk
        </h1>
        <p className="text-brand-text-muted max-w-xl mx-auto text-lg">
          Odpowiedz na kilka pytań, a dobierzemy produkty idealnie dopasowane
          do Twojej skóry i potrzeb.
        </p>
      </div>

      <QuizWizard allProducts={response.products} />
    </div>
  )
}
