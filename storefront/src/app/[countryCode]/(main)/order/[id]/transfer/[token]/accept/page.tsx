import { acceptTransferRequest } from "@lib/data/orders"
import { Heading, Text } from "@medusajs/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: { id: string; token: string }
}) {
  const { id, token } = params

  const { success, error } = await acceptTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              Zamówienie przeniesione!
            </Heading>
            <Text className="text-zinc-600">
              Zamówienie {id} zostało pomyślnie przeniesione do nowego właściciela.
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              Wystąpił błąd podczas akceptowania przeniesienia. Spróbuj ponownie.
            </Text>
            {error && (
              <Text className="text-red-500">Komunikat błędu: {error}</Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
