#!/usr/bin/env bash
# Backfill product.thumbnail from the product's first image for any product that
# has images but no thumbnail. Without a thumbnail, cart line items / order
# summaries fall back to a placeholder icon.
#
# Usage:
#   MEDUSA_URL="https://your-backend.up.railway.app" \
#   MEDUSA_EMAIL="admin@example.com" \
#   ./scripts/medusa-set-thumbnails.sh
#   (you'll be prompted for the password)

set -euo pipefail

: "${MEDUSA_URL:?set MEDUSA_URL, e.g. https://backend.up.railway.app}"
: "${MEDUSA_EMAIL:?set MEDUSA_EMAIL}"

if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD
  echo
fi
[[ -z "$MEDUSA_PASSWORD" ]] && { echo "✗ MEDUSA_PASSWORD required" >&2; exit 1; }

echo "→ Logging in to $MEDUSA_URL as $MEDUSA_EMAIL"
TOKEN=$(curl -sSf -X POST "$MEDUSA_URL/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$MEDUSA_EMAIL\",\"password\":\"$MEDUSA_PASSWORD\"}" \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['token'])")

[[ -z "$TOKEN" ]] && { echo "✗ Login failed — no token returned" >&2; exit 1; }

LIMIT=100
OFFSET=0
OK=0
FAIL=0

echo "→ Backfilling thumbnails (products with images but no thumbnail)"
while :; do
  PAGE=$(curl -sSf "$MEDUSA_URL/admin/products?limit=$LIMIT&offset=$OFFSET&fields=id,title,thumbnail,images.url" \
    -H "Authorization: Bearer $TOKEN")
  COUNT=$(echo "$PAGE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('count',0))")
  ROWS=$(echo "$PAGE" | python3 -c "
import json, sys
for p in json.load(sys.stdin).get('products', []):
    thumb = p.get('thumbnail')
    imgs = p.get('images') or []
    first = imgs[0].get('url') if imgs else None
    if (not thumb) and first:
        print(p['id'] + '\t' + first)
")

  if [[ -n "$ROWS" ]]; then
    while IFS=$'\t' read -r PID URL; do
      [[ -z "$PID" ]] && continue
      if curl -sf -X POST "$MEDUSA_URL/admin/products/$PID" \
          -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
          -d "{\"thumbnail\":\"$URL\"}" >/dev/null 2>&1; then
        OK=$((OK + 1))
        echo "  ✓ $PID"
      else
        FAIL=$((FAIL + 1))
        echo "  ✗ $PID" >&2
      fi
    done <<< "$ROWS"
  fi

  OFFSET=$((OFFSET + LIMIT))
  [[ "$COUNT" -eq 0 || "$OFFSET" -ge "$COUNT" ]] && break
done

echo "✓ Done — thumbnails set on $OK products, failed=$FAIL"
[[ "$FAIL" -gt 0 ]] && exit 1 || exit 0
