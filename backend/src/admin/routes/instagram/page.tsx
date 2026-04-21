import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import {
  Badge,
  Button,
  Container,
  Heading,
  Text,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type Summary = {
  day: { sent: number; failed: number; other: number }
  week: { sent: number; failed: number; other: number }
  success_rate_week: number | null
  triggers: { active: number; total: number }
  enabled: boolean
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col gap-y-1">
    <Text size="small" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Heading level="h2">{value}</Heading>
  </div>
)

const InstagramBotPage = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/instagram/summary", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as Summary
      })
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : "error"))
  }, [])

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Heading>Instagram bot</Heading>
          <Text className="text-ui-fg-subtle">
            Automatyczne DM-y do komentujących wybrane posty.
          </Text>
        </div>
        <Badge color={summary?.enabled ? "green" : "grey"}>
          {summary?.enabled ? "Włączony" : "Wyłączony"}
        </Badge>
      </div>

      {error && (
        <Text className="text-ui-fg-error">
          Nie udało się wczytać podsumowania: {error}
        </Text>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="DM-y / 24h" value={summary.day.sent} />
            <Stat label="DM-y / 7 dni" value={summary.week.sent} />
            <Stat
              label="Skuteczność (7 dni)"
              value={
                summary.success_rate_week === null
                  ? "—"
                  : `${summary.success_rate_week}%`
              }
            />
            <Stat
              label="Aktywne triggery"
              value={`${summary.triggers.active} / ${summary.triggers.total}`}
            />
          </div>

          {summary.day.failed > 0 && (
            <Text className="text-ui-fg-error">
              Nieudane w ciągu 24h: {summary.day.failed}
            </Text>
          )}
        </>
      )}

      <div className="flex gap-2">
        <Button size="small" variant="secondary" asChild>
          <Link to="/instagram/triggers">Triggery</Link>
        </Button>
        <Button size="small" variant="secondary" asChild>
          <Link to="/instagram/logs">Log DM-ów</Link>
        </Button>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Instagram bot",
  icon: ChatBubbleLeftRight,
})

export default InstagramBotPage
