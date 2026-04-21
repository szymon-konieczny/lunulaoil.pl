import {
  Container,
  Heading,
  Select,
  Table,
  Text,
} from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"

type DayBucket = { day: string; sent: number; failed: number; other: number }
type TopTrigger = { trigger_id: string; sent: number; failed: number }
type AnalyticsResponse = {
  days: number
  daily: DayBucket[]
  top_triggers: TopTrigger[]
}

const DayBars = ({ data }: { data: DayBucket[] }) => {
  const max = useMemo(
    () =>
      Math.max(1, ...data.map((d) => d.sent + d.failed + d.other)),
    [data]
  )
  const barWidth = 24
  const gap = 6
  const height = 160
  const width = data.length * (barWidth + gap)

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height + 30}`}
      className="bg-ui-bg-subtle rounded"
    >
      {data.map((d, i) => {
        const total = d.sent + d.failed + d.other
        const sentH = (d.sent / max) * height
        const failedH = (d.failed / max) * height
        const otherH = (d.other / max) * height
        const x = i * (barWidth + gap) + gap
        const ySent = height - sentH
        const yFailed = ySent - failedH
        const yOther = yFailed - otherH
        return (
          <g key={d.day}>
            <rect
              x={x}
              y={ySent}
              width={barWidth}
              height={sentH}
              fill="#10b981"
            />
            <rect
              x={x}
              y={yFailed}
              width={barWidth}
              height={failedH}
              fill="#ef4444"
            />
            <rect
              x={x}
              y={yOther}
              width={barWidth}
              height={otherH}
              fill="#9ca3af"
            />
            <title>
              {d.day}: sent {d.sent}, failed {d.failed}, other {d.other} (total{" "}
              {total})
            </title>
            <text
              x={x + barWidth / 2}
              y={height + 14}
              fontSize="9"
              textAnchor="middle"
              fill="currentColor"
            >
              {d.day.slice(5)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const Legend = () => (
  <div className="flex gap-4 text-xs">
    <span className="flex items-center gap-1">
      <span className="inline-block w-3 h-3 bg-[#10b981] rounded" /> sent
    </span>
    <span className="flex items-center gap-1">
      <span className="inline-block w-3 h-3 bg-[#ef4444] rounded" /> failed
    </span>
    <span className="flex items-center gap-1">
      <span className="inline-block w-3 h-3 bg-[#9ca3af] rounded" /> inne
    </span>
  </div>
)

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [days, setDays] = useState<number>(14)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/admin/instagram/analytics?days=${days}`, {
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as AnalyticsResponse
      })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "error"))
  }, [days])

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <Heading>Analityka DM-ów</Heading>
        <div className="w-48">
          <Select
            value={String(days)}
            onValueChange={(v) => setDays(Number(v))}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="7">7 dni</Select.Item>
              <Select.Item value="14">14 dni</Select.Item>
              <Select.Item value="30">30 dni</Select.Item>
              <Select.Item value="90">90 dni</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {error && <Text className="text-ui-fg-error">{error}</Text>}

      {data && (
        <>
          <Legend />
          <DayBars data={data.daily} />

          <div>
            <Heading level="h2" className="mb-2">
              Top triggery
            </Heading>
            {data.top_triggers.length === 0 ? (
              <Text className="text-ui-fg-subtle">
                Brak danych w wybranym zakresie.
              </Text>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Trigger</Table.HeaderCell>
                    <Table.HeaderCell>Wysłane</Table.HeaderCell>
                    <Table.HeaderCell>Nieudane</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.top_triggers.map((t) => (
                    <Table.Row key={t.trigger_id}>
                      <Table.Cell className="font-mono text-xs">
                        {t.trigger_id}
                      </Table.Cell>
                      <Table.Cell>{t.sent}</Table.Cell>
                      <Table.Cell>{t.failed}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>
        </>
      )}
    </Container>
  )
}

export default AnalyticsPage
