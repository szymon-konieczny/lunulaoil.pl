# Lunula Botanique

E-commerce store built with **Medusa.js v2** (`backend/`, port 9000) and
**Next.js 15** (`storefront/`, port 8000). See `backend/README.md` and
`storefront/README.md` for per-app setup.

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
