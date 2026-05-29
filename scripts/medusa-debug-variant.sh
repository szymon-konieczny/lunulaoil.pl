#!/usr/bin/env bash
# READ-ONLY: dump a product variant's inventory + price fields so we can see why
# add-to-cart fails (out-of-stock vs other). Default handle: rusalka-mydlo-rytualne.
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-debug-variant.sh [handle]

set -euo pipefail
: "${MEDUSA_URL:?}" ; : "${MEDUSA_EMAIL:?}"
HANDLE="${1:-rusalka-mydlo-rytualne}"
if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD; echo
fi
AUTH=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os;print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" -H "Content-Type: application/json" \
  -d "$AUTH" | python3 -c "import json,sys;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ login failed" >&2; exit 1; }

echo "=== product '$HANDLE' variant inventory + price ==="
curl -sS "$MEDUSA_URL/admin/products?handle=$HANDLE&fields=id,handle,status,variants.id,variants.title,variants.manage_inventory,variants.allow_backorder,variants.inventory_quantity,variants.prices.amount,variants.prices.currency_code" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

echo ""
echo "=== sales channels linked to this product ==="
PID=$(curl -sS "$MEDUSA_URL/admin/products?handle=$HANDLE&fields=id" -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import json,sys; p=json.load(sys.stdin).get('products',[]); print(p[0]['id'] if p else '')")
[[ -n "$PID" ]] && curl -sS "$MEDUSA_URL/admin/products/$PID?fields=id,*sales_channels" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "
import json,sys
p=json.load(sys.stdin).get('product',{})
print('sales_channels:', [sc.get('name') for sc in (p.get('sales_channels') or [])])"
