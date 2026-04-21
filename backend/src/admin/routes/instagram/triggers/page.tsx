import {
  Badge,
  Button,
  Container,
  Heading,
  Table,
  Text,
  toast,
} from "@medusajs/ui"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"

type Trigger = {
  id: string
  ig_post_id: string
  pattern_type: "keyword" | "regex" | "exact"
  pattern: string
  product_handle: string
  is_active: boolean
  rate_limit_hours: number
  created_at: string
}

const TriggersListPage = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/instagram/triggers?limit=200", {
        credentials: "include",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { triggers: Trigger[] }
      setTriggers(data.triggers)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const toggleActive = async (t: Trigger) => {
    try {
      const res = await fetch(`/admin/instagram/triggers/${t.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ is_active: !t.is_active }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success(t.is_active ? "Trigger wyłączony" : "Trigger włączony")
      load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd zapisu")
    }
  }

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <Heading>Triggery</Heading>
        <Button size="small" asChild>
          <Link to="/instagram/triggers/create">Dodaj trigger</Link>
        </Button>
      </div>

      {error && <Text className="text-ui-fg-error">{error}</Text>}
      {loading && <Text>Ładowanie…</Text>}

      {!loading && triggers.length === 0 && (
        <Text className="text-ui-fg-subtle">Brak triggerów.</Text>
      )}

      {triggers.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Post</Table.HeaderCell>
              <Table.HeaderCell>Typ</Table.HeaderCell>
              <Table.HeaderCell>Wzorzec</Table.HeaderCell>
              <Table.HeaderCell>Produkt</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Akcje</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {triggers.map((t) => (
              <Table.Row key={t.id}>
                <Table.Cell className="font-mono text-xs">
                  {t.ig_post_id}
                </Table.Cell>
                <Table.Cell>{t.pattern_type}</Table.Cell>
                <Table.Cell className="font-mono">{t.pattern}</Table.Cell>
                <Table.Cell>{t.product_handle}</Table.Cell>
                <Table.Cell>
                  <Badge color={t.is_active ? "green" : "grey"}>
                    {t.is_active ? "aktywny" : "wyłączony"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => toggleActive(t)}
                    >
                      {t.is_active ? "Wyłącz" : "Włącz"}
                    </Button>
                    <Button size="small" variant="secondary" asChild>
                      <Link to={`/instagram/triggers/${t.id}`}>Edytuj</Link>
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export default TriggersListPage
