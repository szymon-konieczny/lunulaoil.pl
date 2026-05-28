#!/usr/bin/env bash
# Disable inventory tracking (manage_inventory=false) on ALL product variants via
# the Medusa admin API, so every product is always purchasable without stock counts.
# The shop owner hides sold-out products manually (set product status to Draft).
#
# Usage:
#   MEDUSA_URL="https://your-backend.up.railway.app" \
#   MEDUSA_EMAIL="admin@example.com" \
#   MEDUSA_PASSWORD="…" \
#   ./scripts/medusa-disable-inventory-tracking.sh
#
# Why this script exists:
#   With inventory tracking on and no stock, add-to-cart fails ("Brak w magazynie").
#   For a handmade shop that doesn't count stock, turning tracking off in bulk is
#   simpler than backfilling stock levels for every variant.

set -euo pipefail

: "${MEDUSA_URL:?set MEDUSA_URL, e.g. https://backend.up.railway.app}"
: "${MEDUSA_EMAIL:?set MEDUSA_EMAIL}"

# Prompt for the password if not provided via env. Keeps it out of the shell
# command/history and avoids quoting issues with special chars (! @ $ etc.).
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

echo "→ Disabling inventory tracking on all variants"
while :; do
  PAGE=$(curl -sSf "$MEDUSA_URL/admin/products?limit=$LIMIT&offset=$OFFSET&fields=id,variants.id" \
    -H "Authorization: Bearer $TOKEN")
  COUNT=$(echo "$PAGE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('count',0))")
  ROWS=$(echo "$PAGE" | python3 -c "
import json, sys
for p in json.load(sys.stdin).get('products', []):
    for v in (p.get('variants') or []):
        print(p['id'] + '\t' + v['id'])
")

  [[ -z "$ROWS" ]] && break

  while IFS=$'\t' read -r PID VID; do
    [[ -z "$VID" ]] && continue
    if curl -sf -X POST "$MEDUSA_URL/admin/products/$PID/variants/$VID" \
        -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d '{"manage_inventory":false}' >/dev/null 2>&1; then
      OK=$((OK + 1))
      echo "  ✓ $VID"
    else
      FAIL=$((FAIL + 1))
      echo "  ✗ $VID" >&2
    fi
  done <<< "$ROWS"

  OFFSET=$((OFFSET + LIMIT))
  [[ "$OFFSET" -ge "$COUNT" ]] && break
done

echo "✓ Done — tracking disabled on $OK variants, failed=$FAIL"
[[ "$FAIL" -gt 0 ]] && exit 1 || exit 0
