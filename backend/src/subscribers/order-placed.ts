import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/** Format a major-unit amount as Polish złoty, e.g. 45.99 -> "45,99 zł". */
function pln(amount: unknown): string {
  const n = Number(amount ?? 0)
  return (
    n.toLocaleString("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " zł"
  )
}

function buildHtml(order: any): string {
  // Compute amounts from raw stored fields (unit_price, detail.quantity,
  // shipping_methods.amount) — Medusa's decorated order totals aren't reliably
  // populated via query.graph inside the order.placed subscriber.
  const items = (order.items || []).map((it: any) => {
    const qty = Number(it.detail?.quantity ?? it.quantity ?? 1)
    const unit = Number(it.unit_price ?? 0)
    return {
      name: it.product_title || it.title || "Produkt",
      variant: it.variant_title || "",
      qty,
      lineTotal: unit * qty,
    }
  })

  const itemsTotal = items.reduce((s: number, it: any) => s + it.lineTotal, 0)
  const shippingTotal = (order.shipping_methods || []).reduce(
    (s: number, sm: any) => s + Number(sm.amount ?? 0),
    0
  )
  const grandTotal = itemsTotal + shippingTotal
  const shippingMethod = order.shipping_methods?.[0]?.name || "—"

  const rows = items
    .map(
      (it: any) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${it.name}${
          it.variant ? ` — ${it.variant}` : ""
        }</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${it.qty}×</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${pln(it.lineTotal)}</td>
        </tr>`
    )
    .join("")

  const a = order.shipping_address || {}
  const addr = [
    `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim(),
    a.address_1,
    `${a.postal_code ?? ""} ${a.city ?? ""}`.trim(),
  ]
    .filter(Boolean)
    .join("<br>")

  return `<!DOCTYPE html>
<html lang="pl"><body style="font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;background:#f6f5f1;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;">
    <h1 style="font-size:22px;margin:0 0 4px;">Dziękujemy za zamówienie!</h1>
    <p style="color:#666;margin:0 0 24px;">Zamówienie <strong>#${order.display_id}</strong> zostało przyjęte.</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px;">
      ${rows}
    </table>

    <table style="width:100%;font-size:14px;">
      <tr><td style="padding:2px 0;color:#666;">Produkty</td><td style="padding:2px 0;text-align:right;">${pln(
        itemsTotal
      )}</td></tr>
      <tr><td style="padding:2px 0;color:#666;">Wysyłka (${shippingMethod})</td><td style="padding:2px 0;text-align:right;">${pln(
        shippingTotal
      )}</td></tr>
      <tr><td style="padding:8px 0 0;font-weight:bold;border-top:1px solid #eee;">Razem</td><td style="padding:8px 0 0;text-align:right;font-weight:bold;border-top:1px solid #eee;">${pln(
        grandTotal
      )}</td></tr>
    </table>

    <div style="margin-top:24px;font-size:14px;">
      <p style="color:#666;margin:0 0 4px;font-weight:bold;">Dostawa</p>
      <p style="margin:0;">${addr || "—"}</p>
    </div>

    <p style="margin-top:28px;color:#999;font-size:12px;">Lunula Botanique · biozgodna pielęgnacja</p>
  </div>
</body></html>`
}

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const orderId = event.data?.id
  if (!orderId) {
    return
  }

  // No SMTP configured → notification module not registered. Skip quietly.
  let notificationModule: any
  try {
    notificationModule = container.resolve(Modules.NOTIFICATION)
  } catch {
    logger.warn("order-placed: notification module not configured — skipping email")
    return
  }

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "items.title",
        "items.product_title",
        "items.variant_title",
        "items.unit_price",
        "items.quantity",
        "items.detail.quantity",
        "shipping_methods.name",
        "shipping_methods.amount",
        "shipping_address.first_name",
        "shipping_address.last_name",
        "shipping_address.address_1",
        "shipping_address.postal_code",
        "shipping_address.city",
      ],
      filters: { id: orderId },
    })

    const order = orders?.[0]
    if (!order?.email) {
      logger.warn(`order-placed: order ${orderId} has no email — skipping`)
      return
    }

    await notificationModule.createNotifications({
      to: order.email,
      channel: "email",
      template: "order-placed",
      content: {
        subject: `Potwierdzenie zamówienia #${order.display_id} — Lunula Botanique`,
        html: buildHtml(order),
      },
    })

    logger.info(`order-placed: confirmation email sent to ${order.email} (#${order.display_id})`)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    logger.error(`order-placed: failed to send confirmation email: ${msg}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
