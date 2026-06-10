"use client"

import { isValidNip } from "@lib/util/nip"
import { HttpTypes } from "@medusajs/types"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import React, { useEffect, useRef, useState } from "react"

const InvoiceRequest = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const metadata = (cart?.metadata ?? {}) as Record<string, unknown>

  const [requestInvoice, setRequestInvoice] = useState(
    metadata.invoice_requested === "true"
  )
  // Prefill from persisted cart values only — the address forms keep their
  // live "Firma" input in sibling component state that is not reachable here.
  const [company, setCompany] = useState(
    (typeof metadata.invoice_company === "string" &&
      metadata.invoice_company) ||
      cart?.billing_address?.company ||
      cart?.shipping_address?.company ||
      ""
  )
  const [nip, setNip] = useState(
    typeof metadata.invoice_nip === "string" ? metadata.invoice_nip : ""
  )

  const nipRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nipRef.current?.setCustomValidity(
      requestInvoice && nip && !isValidNip(nip)
        ? "Nieprawidłowy numer NIP. Wpisz 10 cyfr (dozwolone spacje i myślniki)."
        : ""
    )
  }, [nip, requestInvoice])

  return (
    <div className="my-8">
      <Checkbox
        label="Chcę fakturę VAT"
        name="request_invoice"
        id="request-invoice-checkbox"
        checked={requestInvoice}
        onChange={() => setRequestInvoice(!requestInvoice)}
        data-testid="request-invoice-checkbox"
      />
      {requestInvoice && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            label="Nazwa firmy"
            name="invoice_company"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            maxLength={200}
            data-testid="invoice-company-input"
          />
          <Input
            ref={nipRef}
            label="NIP"
            name="invoice_nip"
            inputMode="numeric"
            autoComplete="off"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            required
            data-testid="invoice-nip-input"
          />
        </div>
      )}
    </div>
  )
}

export default InvoiceRequest
