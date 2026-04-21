import {
  Badge,
  Button,
  Container,
  Heading,
  Select,
  Table,
  Text,
} from "@medusajs/ui"
import { useCallback, useEffect, useState } from "react"

type LogRow = {
  id: string
  trigger_id: string | null
  ig_user_id: string
  ig_username: string | null
  ig_comment_id: string
  comment_text: string
  product_handle: string
  product_url: string
  dm_message_id: string | null
  status:
    | "sent"
    | "failed"
    | "rate_limited"
    | "duplicate"
    | "opted_out"
    | "no_match"
  error: string | null
  created_at: string
}

const STATUS_COLORS: Record<LogRow["status"], "green" | "red" | "grey" | "orange" | "blue"> = {
  sent: "green",
  failed: "red",
  rate_limited: "orange",
  duplicate: "grey",
  opted_out: "grey",
  no_match: "blue",
}

const PAGE_SIZE = 50

const LogsPage = () => {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String(offset),
    })
    if (status) params.set("status", status)
    const res = await fetch(`/admin/instagram/logs?${params}`, {
      credentials: "include",
    })
    if (res.ok) {
      const data = (await res.json()) as { logs: LogRow[]; count: number }
      setLogs(data.logs)
      setCount(data.count)
    }
    setLoading(false)
  }, [offset, status])

  useEffect(() => {
    load()
  }, [load])

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <Heading>Log DM-ów</Heading>

      <div className="flex items-center gap-4">
        <div className="w-64">
          <Select
            value={status || "all"}
            onValueChange={(v) => {
              setOffset(0)
              setStatus(v === "all" ? "" : v)
            }}
          >
            <Select.Trigger>
              <Select.Value placeholder="Filtruj status" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Wszystkie</Select.Item>
              <Select.Item value="sent">sent</Select.Item>
              <Select.Item value="failed">failed</Select.Item>
              <Select.Item value="rate_limited">rate_limited</Select.Item>
              <Select.Item value="duplicate">duplicate</Select.Item>
              <Select.Item value="opted_out">opted_out</Select.Item>
              <Select.Item value="no_match">no_match</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <Text size="small" className="text-ui-fg-subtle">
          {count} wpisów
        </Text>
      </div>

      {loading && <Text>Ładowanie…</Text>}

      {!loading && logs.length === 0 && (
        <Text className="text-ui-fg-subtle">Brak wpisów.</Text>
      )}

      {logs.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Data</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Użytkownik</Table.HeaderCell>
              <Table.HeaderCell>Komentarz</Table.HeaderCell>
              <Table.HeaderCell>Produkt</Table.HeaderCell>
              <Table.HeaderCell>Błąd</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {logs.map((l) => (
              <Table.Row key={l.id}>
                <Table.Cell className="text-xs">
                  {new Date(l.created_at).toLocaleString("pl-PL")}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={STATUS_COLORS[l.status]}>{l.status}</Badge>
                </Table.Cell>
                <Table.Cell className="text-xs">
                  {l.ig_username ?? l.ig_user_id}
                </Table.Cell>
                <Table.Cell className="max-w-xs truncate" title={l.comment_text}>
                  {l.comment_text}
                </Table.Cell>
                <Table.Cell>{l.product_handle}</Table.Cell>
                <Table.Cell className="text-ui-fg-error text-xs max-w-xs truncate" title={l.error ?? ""}>
                  {l.error ?? ""}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <div className="flex items-center gap-2">
        <Button
          size="small"
          variant="secondary"
          disabled={offset === 0}
          onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
        >
          ←
        </Button>
        <Text size="small">
          {offset + 1}–{Math.min(offset + PAGE_SIZE, count)} / {count}
        </Text>
        <Button
          size="small"
          variant="secondary"
          disabled={offset + PAGE_SIZE >= count}
          onClick={() => setOffset(offset + PAGE_SIZE)}
        >
          →
        </Button>
      </div>
    </Container>
  )
}

export default LogsPage
