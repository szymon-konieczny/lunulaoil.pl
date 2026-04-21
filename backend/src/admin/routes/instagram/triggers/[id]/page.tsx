import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Text,
  Textarea,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

type PatternType = "keyword" | "regex" | "exact"

type Trigger = {
  id: string
  ig_post_id: string
  pattern_type: PatternType
  pattern: string
  product_handle: string
  dm_template: string
  is_active: boolean
  rate_limit_hours: number
  metadata?: Record<string, unknown> | null
}

const TriggerEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Trigger | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/admin/instagram/triggers/${id}`, { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return (await r.json()) as { trigger: Trigger }
      })
      .then((d) => setForm(d.trigger))
      .catch((err) => setError(err instanceof Error ? err.message : "error"))
      .finally(() => setLoading(false))
  }, [id])

  const update = <K extends keyof Trigger>(key: K, value: Trigger[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f))
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch(`/admin/instagram/triggers/${form.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ig_post_id: form.ig_post_id,
          pattern_type: form.pattern_type,
          pattern: form.pattern,
          product_handle: form.product_handle,
          dm_template: form.dm_template,
          is_active: form.is_active,
          rate_limit_hours: Number(form.rate_limit_hours) || 24,
          metadata: form.metadata ?? null,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      toast.success("Zapisano")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!form) return
    const ok = await prompt({
      title: "Usunąć trigger?",
      description: "Tego nie da się cofnąć.",
      confirmText: "Usuń",
      cancelText: "Anuluj",
    })
    if (!ok) return
    try {
      const res = await fetch(`/admin/instagram/triggers/${form.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success("Trigger usunięty")
      navigate("/instagram/triggers")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd")
    }
  }

  if (loading) {
    return (
      <Container className="p-6">
        <Text>Ładowanie…</Text>
      </Container>
    )
  }
  if (error || !form) {
    return (
      <Container className="p-6">
        <Text className="text-ui-fg-error">{error ?? "Nie znaleziono"}</Text>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <Heading>Edycja triggera</Heading>
        <Button variant="danger" onClick={remove}>
          Usuń
        </Button>
      </div>

      <form onSubmit={save} className="flex flex-col gap-y-4 max-w-2xl">
        <div className="flex items-center gap-2">
          <Switch
            checked={form.is_active}
            onCheckedChange={(v) => update("is_active", v)}
          />
          <Label>Aktywny</Label>
        </div>

        <div>
          <Label htmlFor="ig_post_id">ID posta Instagrama</Label>
          <Input
            id="ig_post_id"
            value={form.ig_post_id}
            onChange={(e) => update("ig_post_id", e.target.value)}
          />
        </div>

        <div>
          <Label>Typ wzorca</Label>
          <Select
            value={form.pattern_type}
            onValueChange={(v) => update("pattern_type", v as PatternType)}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="keyword">keyword</Select.Item>
              <Select.Item value="exact">exact</Select.Item>
              <Select.Item value="regex">regex</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div>
          <Label htmlFor="pattern">Wzorzec</Label>
          <Input
            id="pattern"
            value={form.pattern}
            onChange={(e) => update("pattern", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="product_handle">Handle produktu</Label>
          <Input
            id="product_handle"
            value={form.product_handle}
            onChange={(e) => update("product_handle", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dm_template">Treść DM</Label>
          <Textarea
            id="dm_template"
            rows={5}
            value={form.dm_template}
            onChange={(e) => update("dm_template", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="rate_limit_hours">Rate limit (godziny)</Label>
          <Input
            id="rate_limit_hours"
            type="number"
            min={0}
            value={form.rate_limit_hours}
            onChange={(e) =>
              update("rate_limit_hours", Number(e.target.value))
            }
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" isLoading={saving}>
            Zapisz
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/instagram/triggers")}
          >
            Wróć
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default TriggerEditPage
