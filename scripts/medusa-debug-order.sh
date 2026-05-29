#!/usr/bin/env bash
# READ-ONLY: dump the latest order's item + total fields so we can see which
# amount fields are actually populated (unit_price, quantity, totals).
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-debug-order.sh

set -euo pipefail
: "${MEDUSA_URL:?}" ; : "${MEDUSA_EMAIL:?}"
if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD; echo
fi
AUTH=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os;print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" -H "Content-Type: application/json" \
  -d "$AUTH" | python3 -c "import json,sys;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ login failed" >&2; exit 1; }

echo "=== latest order (admin REST, calculated) ==="
curl -sS "$MEDUSA_URL/admin/orders?limit=1&order=-created_at&fields=id,display_id,total,item_total,shipping_total,currency_code,items.title,items.product_title,items.unit_price,items.quantity,items.total,items.detail.quantity,shipping_methods.name,shipping_methods.amount" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
