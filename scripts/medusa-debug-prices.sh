#!/usr/bin/env bash
# READ-ONLY diagnostic: dump the raw JSON shape of a product's variant prices
# and a price-list's prices, so we can see the correct field paths for this
# Medusa version. Prints raw JSON only — writes nothing.
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-debug-prices.sh

set -euo pipefail
: "${MEDUSA_URL:?}" ; : "${MEDUSA_EMAIL:?}"
if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD; echo
fi

AUTH_PAYLOAD=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os; print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" -H "Content-Type: application/json" \
  -d "$AUTH_PAYLOAD" | python3 -c "import json,sys; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ login failed" >&2; exit 1; }
echo "✓ logged in"

echo ""
echo "=== A) product via fields=*variants.prices ==="
curl -sS "$MEDUSA_URL/admin/products?limit=1&fields=id,handle,thumbnail,*variants.prices" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -80

echo ""
echo "=== B) product via fields=*variants.price_set.prices ==="
curl -sS "$MEDUSA_URL/admin/products?limit=1&fields=id,handle,*variants.price_set.prices" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -80

echo ""
echo "=== C) price-lists list ==="
curl -sS "$MEDUSA_URL/admin/price-lists?limit=5" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -40

echo ""
echo "=== D) first price-list prices ==="
PLID=$(curl -sS "$MEDUSA_URL/admin/price-lists?limit=1" -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import json,sys; pls=json.load(sys.stdin).get('price_lists',[]); print(pls[0]['id'] if pls else '')")
echo "price_list_id=$PLID"
[[ -n "$PLID" ]] && curl -sS "$MEDUSA_URL/admin/price-lists/$PLID/prices?limit=3" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -50
