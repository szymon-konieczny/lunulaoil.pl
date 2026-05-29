#!/usr/bin/env bash
# READ-ONLY diagnostic: list products whose thumbnail or any image still points
# to the old WordPress media (URL contains "wp-content"). Those 404 now that
# WordPress is gone, so they render as a placeholder in the store/cart.
# Replace the images for the listed products in the admin (upload -> R2).
#
# Usage:
#   MEDUSA_URL="https://your-backend.up.railway.app" \
#   MEDUSA_EMAIL="admin@example.com" \
#   ./scripts/medusa-find-wp-images.sh
#   (you'll be prompted for the password; this script only reads, never writes)

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
FOUND=0
TOTAL=0

echo "→ Scanning products for wp-content image URLs"
printf "%-42s %-45s %s\n" "HANDLE" "TITLE" "WP REFERENCES"
printf "%-42s %-45s %s\n" "------" "-----" "-------------"
while :; do
  PAGE=$(curl -sSf "$MEDUSA_URL/admin/products?limit=$LIMIT&offset=$OFFSET&fields=id,handle,title,thumbnail,images.url" \
    -H "Authorization: Bearer $TOKEN")
  TOTAL=$(echo "$PAGE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('count',0))")
  ROWS=$(echo "$PAGE" | python3 -c "
import json, sys
for p in json.load(sys.stdin).get('products', []):
    thumb = p.get('thumbnail') or ''
    imgs = [i.get('url') or '' for i in (p.get('images') or [])]
    wp_thumb = 'wp-content' in thumb
    wp_imgs = [u for u in imgs if 'wp-content' in u]
    if wp_thumb or wp_imgs:
        refs = []
        if wp_thumb:
            refs.append('thumbnail')
        if wp_imgs:
            refs.append('%d/%d images' % (len(wp_imgs), len(imgs)))
        print((p.get('handle') or p['id']) + '\t' + (p.get('title') or '')[:43] + '\t' + ', '.join(refs))
")

  if [[ -n "$ROWS" ]]; then
    while IFS=$'\t' read -r H T R; do
      [[ -z "$H" ]] && continue
      printf "%-42s %-45s %s\n" "$H" "$T" "$R"
      FOUND=$((FOUND + 1))
    done <<< "$ROWS"
  fi

  OFFSET=$((OFFSET + LIMIT))
  [[ "$TOTAL" -eq 0 || "$OFFSET" -ge "$TOTAL" ]] && break
done

echo "----"
echo "✓ $FOUND of $TOTAL product(s) still reference wp-content images."
echo "  Fix: open each in admin and re-upload its image (upload goes to R2)."
