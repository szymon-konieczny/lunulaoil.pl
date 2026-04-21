import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

type PatternType = "keyword" | "regex" | "exact"

const TriggerCreatePage = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    ig_post_id: "",
    pattern_type: "keyword" as PatternType,
    pattern: "",
    product_handle: "",
    dm_template:
      "Cześć! Link do produktu: {product_url}\n\nJeśli nie chcesz więcej wiadomości, odpisz STOP.",
    rate_limit_hours: 24,
    country_code: "pl",
  })

  const update = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/admin/instagram/triggers", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ig_post_id: form.ig_post_id,
          pattern_type: form.pattern_type,
          pattern: form.pattern,
          product_handle: form.product_handle,
          dm_template: form.dm_template,
          rate_limit_hours: Number(form.rate_limit_hours) || 24,
          metadata: form.country_code
            ? { country_code: form.country_code }
            : null,
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      toast.success("Trigger utworzony")
      navigate("/instagram/triggers")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Błąd")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container className="flex flex-col gap-y-6 p-6">
      <Heading>Nowy trigger</Heading>
      <form onSubmit={submit} className="flex flex-col gap-y-4 max-w-2xl">
        <div>
          <Label htmlFor="ig_post_id">ID posta Instagrama</Label>
          <Input
            id="ig_post_id"
            value={form.ig_post_id}
            onChange={(e) => update("ig_post_id", e.target.value)}
            placeholder="17841401234567890"
            required
          />
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Media ID z webhook-a `comments`.
          </Text>
        </div>

        <div>
          <Label htmlFor="pattern_type">Typ wzorca</Label>
          <Select
            value={form.pattern_type}
            onValueChange={(v) => update("pattern_type", v as PatternType)}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="keyword">keyword (słowo)</Select.Item>
              <Select.Item value="exact">exact (dokładne)</Select.Item>
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
            placeholder="np. link"
            required
          />
        </div>

        <div>
          <Label htmlFor="product_handle">Handle produktu</Label>
          <Input
            id="product_handle"
            value={form.product_handle}
            onChange={(e) => update("product_handle", e.target.value)}
            placeholder="np. olej-lnianany"
            required
          />
        </div>

        <div>
          <Label htmlFor="country_code">Kod kraju</Label>
          <Input
            id="country_code"
            value={form.country_code}
            onChange={(e) => update("country_code", e.target.value)}
            placeholder="pl"
          />
        </div>

        <div>
          <Label htmlFor="dm_template">Treść DM</Label>
          <Textarea
            id="dm_template"
            rows={5}
            value={form.dm_template}
            onChange={(e) => update("dm_template", e.target.value)}
            required
          />
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Dostępne zmienne: {"{product_name}"}, {"{product_url}"}.
          </Text>
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
          <Button type="submit" isLoading={submitting}>
            Utwórz
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/instagram/triggers")}
          >
            Anuluj
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default TriggerCreatePage
