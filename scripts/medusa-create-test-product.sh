#!/usr/bin/env bash
# Create a published 1 PLN test product (manage_inventory off, in the default
# sales channel + shipping profile) so you can run a real end-to-end BLIK test
# cheaply (1 zł + shipping). Price is in major units (Medusa standard).
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-create-test-product.sh
#
# Optional: PRICE (default 1), TITLE (default "Produkt testowy (1 zł)")

set -euo pipefail
: "${MEDUSA_URL:?}" ; : "${MEDUSA_EMAIL:?}"
PRICE="${PRICE:-1}"
TITLE="${TITLE:-Produkt testowy (1 zł)}"
if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD; echo
fi
AUTH=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os;print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" -H "Content-Type: application/json" \
  -d "$AUTH" | python3 -c "import json,sys;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ login failed" >&2; exit 1; }

echo "→ Resolving default sales channel + shipping profile"
SC_ID=$(curl -sSf "$MEDUSA_URL/admin/sales-channels?limit=100&fields=id,name" -H "Authorization: Bearer $TOKEN" \
  | python3 -c "
import json,sys
scs=json.load(sys.stdin).get('sales_channels',[])
d=[s for s in scs if 'default' in (s.get('name') or '').lower()]
print((d[0] if d else scs[0])['id'] if scs else '')")
SP_ID=$(curl -sSf "$MEDUSA_URL/admin/shipping-profiles?limit=100&fields=id,name,type" -H "Authorization: Bearer $TOKEN" \
  | python3 -c "
import json,sys
sps=json.load(sys.stdin).get('shipping_profiles',[])
d=[s for s in sps if (s.get('type') or '')=='default'] or [s for s in sps if 'default' in (s.get('name') or '').lower()]
print((d[0] if d else sps[0])['id'] if sps else '')")
echo "  sales_channel=$SC_ID  shipping_profile=$SP_ID"
[[ -z "$SC_ID" ]] && { echo "✗ no sales channel found" >&2; exit 1; }

BODY=$(TITLE="$TITLE" PRICE="$PRICE" SC_ID="$SC_ID" SP_ID="$SP_ID" python3 -c "
import json, os
body = {
  'title': os.environ['TITLE'],
  'handle': 'produkt-testowy',
  'status': 'published',
  'options': [{'title': 'Wariant', 'values': ['Standardowy']}],
  'variants': [{
    'title': 'Standardowy',
    'manage_inventory': False,
    'options': {'Wariant': 'Standardowy'},
    'prices': [{'currency_code': 'pln', 'amount': float(os.environ['PRICE'])}],
  }],
  'sales_channels': [{'id': os.environ['SC_ID']}],
}
if os.environ.get('SP_ID'):
    body['shipping_profile_id'] = os.environ['SP_ID']
print(json.dumps(body))
")

echo "→ Creating product \"$TITLE\" @ $PRICE zł"
RESP=$(curl -sS -X POST "$MEDUSA_URL/admin/products" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$BODY")
HANDLE=$(echo "$RESP" | python3 -c "import json,sys; print((json.load(sys.stdin).get('product') or {}).get('handle',''))" 2>/dev/null || echo "")

if [[ -n "$HANDLE" ]]; then
  echo "✓ Created: /pl/products/$HANDLE  (published, manage_inventory off, $PRICE zł)"
else
  echo "✗ Create failed. Response:" >&2
  echo "$RESP" | python3 -m json.tool >&2 || echo "$RESP" >&2
  exit 1
fi
