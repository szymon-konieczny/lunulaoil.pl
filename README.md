# Lunula Botanique

E-commerce store built with **Medusa.js v2** (`backend/`, port 9000) and
**Next.js 15** (`storefront/`, port 8000). See `backend/README.md` and
`storefront/README.md` for per-app setup.

## Payments (Paynow)

Custom Paynow (mBank) provider in `backend/src/modules/paynow` + storefront
routes `/store/paynow/{charge,status,payment-methods}`. An order is created
when the cart completes, which can happen on three paths:

1. **Inline BLIK** — checkout polls the payment status, then `placeOrder`.
2. **Redirect methods** — buyer lands on `/{country}/paynow-return?cart_id=…`,
   which polls and calls `placeOrder`.
3. **Paynow notification webhook** — `POST /hooks/payment/paynow_paynow`
   (Medusa built-in). **The URL must be configured in the Paynow merchant
   panel, separately per environment**:
   `https://api.lunulaoil.pl/hooks/payment/paynow_paynow`.

Because the buyer may never return (path 2) and the webhook is delivered
through the in-memory event bus (no retries, lost on a deploy-restart), the
scheduled job `paynow-reconcile-orders` (every 10 min) sweeps carts from the
last 72 h that have a CONFIRMED Paynow payment but no order, and completes
them. Its `paynow-reconcile:` log lines are the alert channel — an `error`
there means money was taken and the order still can't be created (check
inventory / shipping validation in the message).

## Admin scripts (`scripts/`)

One-off maintenance utilities that talk to the Medusa **admin API**. They need
`curl` and `python3`, and these environment variables:

| Var | Description |
| --- | --- |
| `MEDUSA_URL` | Backend base URL — `https://api.lunulaoil.pl` (no `/app`) |
| `MEDUSA_EMAIL` | Admin user email |
| `MEDUSA_PASSWORD` | Admin password — only for `medusa-create-category.sh`; the other scripts prompt for it interactively (kept out of shell history) |

> Tip: `MEDUSA_URL` is the backend API origin (`https://api.lunulaoil.pl`),
> **not** the admin UI path (`/app/...`).

### `medusa-create-category.sh`
Create a product category via the admin API (the admin UI's create-category
form errors out in this Medusa version).

```bash
MEDUSA_URL="…" MEDUSA_EMAIL="…" MEDUSA_PASSWORD="…" \
  ./scripts/medusa-create-category.sh "Zestawy" "zestawy"   # name, handle (optional)
```

### `medusa-disable-inventory-tracking.sh`
Set `manage_inventory=false` on **every** variant, so products are always
purchasable without stock counts. Hide sold-out products by setting their
status to Draft.

```bash
MEDUSA_URL="…" MEDUSA_EMAIL="…" \
  ./scripts/medusa-disable-inventory-tracking.sh
```

### `medusa-set-thumbnails.sh`
Backfill `product.thumbnail` from the product's first image for any product
that has images but no thumbnail (so cart and order line items show the photo
instead of a placeholder).

```bash
MEDUSA_URL="…" MEDUSA_EMAIL="…" \
  ./scripts/medusa-set-thumbnails.sh
```

### `medusa-find-wp-images.sh` (read-only)
List products whose thumbnail or images still point to the old WordPress media
(`/wp-content/`), which 404 now that WordPress is gone. This script only reads.

```bash
MEDUSA_URL="…" MEDUSA_EMAIL="…" \
  ./scripts/medusa-find-wp-images.sh
```

### `medusa-fix-prices.sh`
Divide all product variant prices and B2B price-list prices by 100, to convert
mistakenly ×100-entered values (e.g. `3300`) to true Medusa major units
(`33.00`). Shipping option prices are NOT touched. Run with checkout disabled,
right after deploying the matching code (storefront stops dividing by 100;
Paynow charge restores ×100). Supports `DRY_RUN=1` for a preview.

```bash
DRY_RUN=1 MEDUSA_URL="…" MEDUSA_EMAIL="…" ./scripts/medusa-fix-prices.sh  # preview
MEDUSA_URL="…" MEDUSA_EMAIL="…" ./scripts/medusa-fix-prices.sh            # apply
```

### `medusa-migrate-wp-images.sh`
Automatically fetch every `wp-content` image directly from the old WordPress
VPS (accessible via IP even after DNS was moved), re-upload it to Medusa (R2
storage), and update each product's images array and thumbnail with the new
R2 URL. Safe: only replaces WP URLs; existing R2 URLs are left untouched.

```bash
MEDUSA_URL="…" MEDUSA_EMAIL="…" \
  ./scripts/medusa-migrate-wp-images.sh
```

Optional: `DRY_RUN=1` — runs downloads and uploads but skips the final
product update (useful to check what would change before committing).

```bash
DRY_RUN=1 MEDUSA_URL="…" MEDUSA_EMAIL="…" \
  ./scripts/medusa-migrate-wp-images.sh
```
