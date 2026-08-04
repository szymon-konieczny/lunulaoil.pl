#!/usr/bin/env bash
# Add a missing product option to a product. A product with zero options cannot
# get variants: the product module builds a ProductOptionValue with no `value`
# and MikroORM rejects it, so POST /admin/products/:id/variants returns 500
# ("Value for ProductOptionValue.value is required, 'undefined' found") — which
# in the admin UI looks like "prices won't save".
#
# Idempotent: refuses to touch a product that already has options.
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-add-product-option.sh [handle]
#
# Defaults restore what 'wiedzmywbiznesie' had before its option was soft-deleted
# on 2026-08-04 ("Wariant" / "Premium"). The unique indexes on product_option and
# product_option_value are partial (WHERE deleted_at IS NULL), so reusing the old
# names does not collide with the soft-deleted rows.
#
# Optional: OPTION_TITLE (default "Wariant"), OPTION_VALUES (comma-separated,
# default "Premium")

set -euo pipefail
: "${MEDUSA_URL:?}" ; : "${MEDUSA_EMAIL:?}"
HANDLE="${1:-wiedzmywbiznesie}"
OPTION_TITLE="${OPTION_TITLE:-Wariant}"
OPTION_VALUES="${OPTION_VALUES:-Premium}"
if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD; echo
fi
AUTH=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os;print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" -H "Content-Type: application/json" \
  -d "$AUTH" | python3 -c "import json,sys;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ login failed" >&2; exit 1; }

echo "→ Resolving product '$HANDLE'"
INFO=$(curl -sSf "$MEDUSA_URL/admin/products?handle=$HANDLE&fields=id,title,*options,*options.values" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "
import json,sys
ps=json.load(sys.stdin).get('products',[])
if not ps:
    print('\t\t'); raise SystemExit
p=ps[0]
opts='; '.join(o['title']+' ['+', '.join(v['value'] for v in (o.get('values') or []))+']'
               for o in (p.get('options') or []))
print('\t'.join([p['id'], p.get('title',''), opts]))")
PID=$(printf '%s' "$INFO" | cut -f1)
PTITLE=$(printf '%s' "$INFO" | cut -f2)
POPTS=$(printf '%s' "$INFO" | cut -f3)
[[ -z "$PID" ]] && { echo "✗ no product with handle '$HANDLE'" >&2; exit 1; }
echo "  $PID — $PTITLE"

if [[ -n "$POPTS" ]]; then
  echo "✓ Product already has options: $POPTS"
  echo "  Nothing to do — variants can be created from the admin UI."
  exit 0
fi

echo "→ Product has NO options; adding \"$OPTION_TITLE\" [$OPTION_VALUES]"
BODY=$(OPTION_TITLE="$OPTION_TITLE" OPTION_VALUES="$OPTION_VALUES" python3 -c "
import json, os
print(json.dumps({
  'title': os.environ['OPTION_TITLE'],
  'values': [v.strip() for v in os.environ['OPTION_VALUES'].split(',') if v.strip()],
}))")
RESP=$(curl -sS -X POST "$MEDUSA_URL/admin/products/$PID/options" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$BODY")

CHECK=$(curl -sSf "$MEDUSA_URL/admin/products/$PID?fields=id,*options,*options.values" \
  -H "Authorization: Bearer $TOKEN" | python3 -c "
import json,sys
p=json.load(sys.stdin).get('product',{})
print('; '.join(o['title']+' ['+', '.join(v['value'] for v in (o.get('values') or []))+']'
                for o in (p.get('options') or [])))")

if [[ -n "$CHECK" ]]; then
  echo "✓ Options now: $CHECK"
  echo "  Create the variant in the admin — prices will save."
else
  echo "✗ Add option failed. Response:" >&2
  echo "$RESP" | python3 -m json.tool >&2 || echo "$RESP" >&2
  exit 1
fi
