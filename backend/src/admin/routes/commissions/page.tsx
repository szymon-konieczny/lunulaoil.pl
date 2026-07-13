import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ReceiptPercent } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Table,
  Text,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"

type Basis = "net" | "gross" | "discount" | "total"

type CommissionRow = {
  code: string
  orders: number
  paidOrders: number
  net: number
  gross: number
  discount: number
  total: number
}

type CommissionReport = {
  from: string
  to: string
  onlyPaid: boolean
  currency: string
  ordersScanned: number
  ordersWithCode: number
  capped: boolean
  rows: CommissionRow[]
}

const BASIS_LABEL: Record<Basis, string> = {
  net: "Obrót po rabacie (produkty)",
  gross: "Obrót przed rabatem (produkty)",
  discount: "Kwota rabatu",
  total: "Wartość zamówień (z wysyłką/VAT)",
}

const toISODate = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const monthRange = (offset: number): { from: string; to: string } => {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const last =
    offset === 0 ? now : new Date(now.getFullYear(), now.getMonth() + offset + 1, 0)
  return { from: toISODate(first), to: toISODate(last) }
}

const CommissionsPage = () => {
  const initial = monthRange(0)
  const [from, setFrom] = useState<string>(initial.from)
  const [to, setTo] = useState<string>(initial.to)
  const [onlyPaid, setOnlyPaid] = useState<boolean>(false)
  const [basis, setBasis] = useState<Basis>("net")
  const [rate, setRate] = useState<string>("10")
  const [rateByCode, setRateByCode] = useState<Record<string, string>>({})

  const [data, setData] = useState<CommissionReport | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ from, to, only_paid: String(onlyPaid) })
    fetch(`/admin/commissions?${params.toString()}`, { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as CommissionReport
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "error"))
      .finally(() => setLoading(false))
  }, [from, to, onlyPaid])

  const currency = data?.currency || "PLN"
  const fmt = useMemo(() => {
    const nf = new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency,
    })
    return (n: number) => nf.format(n)
  }, [currency])

  const globalRate = Number(rate) || 0
  const effectiveRate = (code: string): number => {
    const override = rateByCode[code]
    if (override === undefined || override === "") return globalRate
    return Number(override) || 0
  }
  const commissionFor = (row: CommissionRow): number =>
    (row[basis] * effectiveRate(row.code)) / 100

  const totals = useMemo(() => {
    const rows = data?.rows ?? []
    return rows.reduce(
      (acc, r) => {
        acc.orders += r.orders
        acc.paidOrders += r.paidOrders
        acc.net += r.net
        acc.gross += r.gross
        acc.discount += r.discount
        acc.total += r.total
        acc.commission += commissionFor(r)
        return acc
      },
      {
        orders: 0,
        paidOrders: 0,
        net: 0,
        gross: 0,
        discount: 0,
        total: 0,
        commission: 0,
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, basis, rate, rateByCode])

  const exportCsv = () => {
    if (!data) return
    const sep = ";"
    const dec = (n: number) => n.toFixed(2).replace(".", ",")
    const header = [
      "Kod",
      "Zamówienia",
      "Zamówienia opłacone",
      "Obrót po rabacie",
      "Obrót przed rabatem",
      "Kwota rabatu",
      "Wartość zamówień (brutto)",
      "Stawka %",
      "Prowizja",
    ].join(sep)
    const lines = data.rows.map((r) =>
      [
        r.code,
        r.orders,
        r.paidOrders,
        dec(r.net),
        dec(r.gross),
        dec(r.discount),
        dec(r.total),
        dec(effectiveRate(r.code)),
        dec(commissionFor(r)),
      ].join(sep)
    )
    const totalLine = [
      "RAZEM",
      totals.orders,
      totals.paidOrders,
      dec(totals.net),
      dec(totals.gross),
      dec(totals.discount),
      dec(totals.total),
      "",
      dec(totals.commission),
    ].join(sep)
    const meta = [
      `Prowizje dystrybutorów`,
      `Okres:${sep}${from} .. ${to}`,
      `Podstawa prowizji:${sep}${BASIS_LABEL[basis]}`,
      `Tylko opłacone:${sep}${onlyPaid ? "tak" : "nie"}`,
      `Waluta:${sep}${currency}`,
      "",
    ].join("\n")
    const csv = `﻿${meta}\n${header}\n${lines.join("\n")}\n${totalLine}\n`
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prowizje_${from}_${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading>Prowizje dystrybutorów</Heading>
          <Text className="text-ui-fg-subtle">
            Rozliczenie oparte na wykorzystaniu kodów promocyjnych w zamówieniach.
          </Text>
        </div>
        <Button
          size="small"
          variant="secondary"
          onClick={exportCsv}
          disabled={!data || data.rows.length === 0}
        >
          Eksport CSV
        </Button>
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-y-1">
          <Label size="small" htmlFor="from">
            Od
          </Label>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label size="small" htmlFor="to">
            Do
          </Label>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="small"
            variant="transparent"
            onClick={() => {
              const r = monthRange(0)
              setFrom(r.from)
              setTo(r.to)
            }}
          >
            Bieżący miesiąc
          </Button>
          <Button
            size="small"
            variant="transparent"
            onClick={() => {
              const r = monthRange(-1)
              setFrom(r.from)
              setTo(r.to)
            }}
          >
            Poprzedni miesiąc
          </Button>
        </div>

        <div className="flex flex-col gap-y-1 w-64">
          <Label size="small">Podstawa prowizji</Label>
          <Select value={basis} onValueChange={(v) => setBasis(v as Basis)}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="net">{BASIS_LABEL.net}</Select.Item>
              <Select.Item value="gross">{BASIS_LABEL.gross}</Select.Item>
              <Select.Item value="total">{BASIS_LABEL.total}</Select.Item>
              <Select.Item value="discount">{BASIS_LABEL.discount}</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div className="flex flex-col gap-y-1 w-28">
          <Label size="small" htmlFor="rate">
            Stawka %
          </Label>
          <Input
            id="rate"
            type="number"
            min="0"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="only_paid"
            checked={onlyPaid}
            onCheckedChange={setOnlyPaid}
          />
          <Label size="small" htmlFor="only_paid">
            Tylko opłacone
          </Label>
        </div>
      </div>

      {error && (
        <Text className="text-ui-fg-error">
          Nie udało się wczytać danych: {error}
        </Text>
      )}

      {data && (
        <>
          <div className="flex flex-wrap items-center gap-2 text-ui-fg-subtle text-sm">
            <Badge size="small">
              Zamówień w okresie: {data.ordersScanned}
            </Badge>
            <Badge size="small">Z kodem: {data.ordersWithCode}</Badge>
            <span>
              Prowizja = {globalRate}% × „{BASIS_LABEL[basis]}"
              {onlyPaid ? " (tylko opłacone)" : ""}
            </span>
            {data.capped && (
              <Badge size="small" color="orange">
                Wyniki częściowe (limit zamówień)
              </Badge>
            )}
          </div>

          {loading && <Text className="text-ui-fg-subtle">Ładowanie…</Text>}

          {data.rows.length === 0 ? (
            <Text className="text-ui-fg-subtle">
              Brak zamówień z kodami promocyjnymi w wybranym okresie.
            </Text>
          ) : (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Kod</Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Zamówienia
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Po rabacie
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Przed rabatem
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Rabat
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Wartość zam.
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Stawka %
                  </Table.HeaderCell>
                  <Table.HeaderCell className="text-right">
                    Prowizja
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.rows.map((r) => (
                  <Table.Row key={r.code}>
                    <Table.Cell className="font-medium">{r.code}</Table.Cell>
                    <Table.Cell className="text-right">
                      {r.orders}
                      {onlyPaid ? "" : ` (${r.paidOrders} opł.)`}
                    </Table.Cell>
                    <Table.Cell className="text-right">{fmt(r.net)}</Table.Cell>
                    <Table.Cell className="text-right">{fmt(r.gross)}</Table.Cell>
                    <Table.Cell className="text-right">
                      {fmt(r.discount)}
                    </Table.Cell>
                    <Table.Cell className="text-right">{fmt(r.total)}</Table.Cell>
                    <Table.Cell className="text-right">
                      <Input
                        className="w-20 text-right"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder={String(globalRate)}
                        value={rateByCode[r.code] ?? ""}
                        onChange={(e) =>
                          setRateByCode((prev) => ({
                            ...prev,
                            [r.code]: e.target.value,
                          }))
                        }
                      />
                    </Table.Cell>
                    <Table.Cell className="text-right font-semibold">
                      {fmt(commissionFor(r))}
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row className="bg-ui-bg-subtle font-semibold">
                  <Table.Cell>RAZEM</Table.Cell>
                  <Table.Cell className="text-right">{totals.orders}</Table.Cell>
                  <Table.Cell className="text-right">{fmt(totals.net)}</Table.Cell>
                  <Table.Cell className="text-right">
                    {fmt(totals.gross)}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {fmt(totals.discount)}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {fmt(totals.total)}
                  </Table.Cell>
                  <Table.Cell />
                  <Table.Cell className="text-right">
                    {fmt(totals.commission)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          )}

          <div className="rounded-lg border border-ui-border-base bg-ui-bg-subtle p-4 text-sm text-ui-fg-subtle">
            <Text size="small" weight="plus" className="text-ui-fg-base">
              Jak to liczymy
            </Text>
            <ul className="mt-2 list-disc pl-5 flex flex-col gap-y-1">
              <li>
                Liczone są złożone zamówienia (bez wersji roboczych i anulowanych)
                z danego okresu, które użyły kodu.
              </li>
              <li>
                „Po rabacie" i „Przed rabatem" dotyczą wartości produktów (bez
                wysyłki). „Wartość zam." to pełna kwota z wysyłką i VAT.
              </li>
              <li>
                Do potwierdzenia z klientką:{" "}
                <strong>podstawa prowizji</strong>, <strong>stawka %</strong>,
                czy liczymy <strong>tylko opłacone</strong> oraz traktowanie
                zwrotów. Ustawienia zmieniasz powyżej — wynik przelicza się na
                bieżąco.
              </li>
            </ul>
          </div>
        </>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Prowizje",
  icon: ReceiptPercent,
})

export default CommissionsPage
