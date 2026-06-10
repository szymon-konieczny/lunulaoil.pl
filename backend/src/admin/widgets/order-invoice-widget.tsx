import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Copy, Heading, Text } from "@medusajs/ui"

const formatNip = (nip: string) =>
  nip.length === 10
    ? `${nip.slice(0, 3)}-${nip.slice(3, 6)}-${nip.slice(6, 8)}-${nip.slice(8)}`
    : nip

const OrderInvoiceWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const metadata = (data.metadata ?? {}) as Record<string, unknown>
  const requested = metadata.invoice_requested === "true"
  const company =
    typeof metadata.invoice_company === "string" ? metadata.invoice_company : ""
  const nip =
    typeof metadata.invoice_nip === "string" ? metadata.invoice_nip : ""

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Faktura VAT</Heading>
      </div>
      <div className="px-6 py-4">
        {requested ? (
          <div className="flex flex-col gap-y-3">
            <div>
              <Text size="small" className="text-ui-fg-subtle">
                Nazwa firmy
              </Text>
              <div className="flex items-center gap-x-2">
                <Text size="small">{company || "—"}</Text>
                {company ? <Copy content={company} /> : null}
              </div>
            </div>
            <div>
              <Text size="small" className="text-ui-fg-subtle">
                NIP
              </Text>
              <div className="flex items-center gap-x-2">
                <Text size="small">{formatNip(nip) || "—"}</Text>
                {nip ? <Copy content={nip} /> : null}
              </div>
            </div>
          </div>
        ) : (
          <Text size="small" className="text-ui-fg-subtle">
            Klient nie poprosił o fakturę VAT.
          </Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
})

export default OrderInvoiceWidget
