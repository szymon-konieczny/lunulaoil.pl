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
      <QuizWizard allProducts={response.products} />
    </div>
  )
}
