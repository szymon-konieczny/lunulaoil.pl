#!/usr/bin/env bash
# Divide ALL product prices (and B2B price-list prices) by 100, converting them
# from the mistakenly-entered ×100 values (e.g. 3300) to true Medusa major units
# (33.00). Shipping option prices are NOT touched (already correct).
#
# Run AFTER deploying the code changes that stop dividing by 100 on the storefront
# and restore ×100 in the Paynow charge — and with checkout temporarily disabled.
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-fix-prices.sh
#   (prompts for password)
#
# Optional:
#   DRY_RUN=1   show every old→new price change but DON'T write anything

set -euo pipefail

: "${MEDUSA_URL:?set MEDUSA_URL, e.g. https://api.lunulaoil.pl}"
: "${MEDUSA_EMAIL:?set MEDUSA_EMAIL}"
DRY_RUN="${DRY_RUN:-0}"

if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD
  echo
fi
[[ -z "$MEDUSA_PASSWORD" ]] && { echo "✗ MEDUSA_PASSWORD required" >&2; exit 1; }

echo "→ Logging in to $MEDUSA_URL as $MEDUSA_EMAIL"
AUTH_PAYLOAD=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os; print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "$AUTH_PAYLOAD" \
  | python3 -c "import json,sys; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ Login failed — check email/password (HTTP 401 = wrong credentials)" >&2; exit 1; }

[[ "$DRY_RUN" == "1" ]] && echo "⚠  DRY_RUN=1 — no prices will be written"

OK=0; FAIL=0; SKIP=0

# ---------------------------------------------------------------------------
# 1) Product variant BASE prices (variants.prices — excludes price-list prices)
# ---------------------------------------------------------------------------
echo "→ Re-pricing product variants (÷100)"
LIMIT=100; OFFSET=0
PFIELDS="id,handle,variants.id,variants.prices.id,variants.prices.amount,variants.prices.currency_code"

while :; do
  PAGE=$(curl -sSf "$MEDUSA_URL/admin/products?limit=$LIMIT&offset=$OFFSET&fields=$PFIELDS" \
    -H "Authorization: Bearer $TOKEN")
  COUNT=$(echo "$PAGE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('count',0))")

  # one line per variant with prices:  pid <TAB> vid <TAB> label <TAB> body
  ROWS=$(echo "$PAGE" | python3 -c "
import json, sys
from decimal import Decimal, ROUND_HALF_UP
def half(a): return float((Decimal(str(a))/Decimal(100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
for p in json.load(sys.stdin).get('products', []):
    pid = p['id']
    for v in (p.get('variants') or []):
        prices = v.get('prices') or []
        if not prices:
            continue
        new_prices, labels = [], []
        for pr in prices:
            na = half(pr['amount'])
            new_prices.append({'id': pr['id'], 'amount': na})
            labels.append('%s %s->%s' % (pr.get('currency_code','?'), pr['amount'], na))
        body = json.dumps({'prices': new_prices})
        label = (p.get('handle') or pid) + ' [' + ', '.join(labels) + ']'
        print(pid + '\t' + v['id'] + '\t' + label + '\t' + body)
")

  if [[ -n "$ROWS" ]]; then
    while IFS=$'\t' read -r PID VID LABEL BODY; do
      [[ -z "$VID" ]] && continue
      if [[ "$DRY_RUN" == "1" ]]; then
        echo "  (dry) $LABEL"; OK=$((OK+1)); continue
      fi
      if curl -sf -X POST "$MEDUSA_URL/admin/products/$PID/variants/$VID" \
          -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
          -d "$BODY" >/dev/null 2>&1; then
        echo "  ✓ $LABEL"; OK=$((OK+1))
      else
        echo "  ✗ $LABEL" >&2; FAIL=$((FAIL+1))
      fi
    done <<< "$ROWS"
  fi

  OFFSET=$((OFFSET+LIMIT))
  [[ "$COUNT" -eq 0 || "$OFFSET" -ge "$COUNT" ]] && break
done

# ---------------------------------------------------------------------------
# 2) B2B price-list prices — update via /prices/batch ({update:[{id,amount,variant_id}]})
# ---------------------------------------------------------------------------
echo "→ Re-pricing price lists (÷100)"
LISTS=$(curl -sSf "$MEDUSA_URL/admin/price-lists?limit=100&fields=id,title" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "
import json,sys
for pl in json.load(sys.stdin).get('price_lists', []):
    print(pl['id'] + '\t' + (pl.get('title') or ''))
")

if [[ -n "$LISTS" ]]; then
  while IFS=$'\t' read -r PLID PLTITLE; do
    [[ -z "$PLID" ]] && continue
    PRICES=$(curl -sSf "$MEDUSA_URL/admin/price-lists/$PLID/prices?limit=1000&fields=id,amount,currency_code,price_set.variant.id" \
      -H "Authorization: Bearer $TOKEN" 2>/dev/null || echo "")
    BODY=$(echo "$PRICES" | python3 -c "
import json, sys
from decimal import Decimal, ROUND_HALF_UP
def half(a): return float((Decimal(str(a))/Decimal(100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
try:
    prices = json.load(sys.stdin).get('prices') or []
except Exception:
    print(''); sys.exit()
out = []
for pr in prices:
    vid = (((pr.get('price_set') or {}).get('variant')) or {}).get('id')
    if 'id' in pr and 'amount' in pr and vid:
        out.append({'id': pr['id'], 'amount': half(pr['amount']), 'variant_id': vid})
print(json.dumps({'update': out}) if out else '')
" 2>/dev/null || echo "")

    NUM=$(echo "$BODY" | python3 -c "import json,sys
try: print(len(json.load(sys.stdin).get('update',[])))
except: print(0)" 2>/dev/null || echo 0)

    if [[ -z "$BODY" || "$NUM" == "0" ]]; then
      echo "  ⚠  $PLTITLE — no prices found, skipping"; SKIP=$((SKIP+1)); continue
    fi
    if [[ "$DRY_RUN" == "1" ]]; then
      echo "  (dry) price-list \"$PLTITLE\": $NUM prices ÷100"; OK=$((OK+1)); continue
    fi
    if curl -sf -X POST "$MEDUSA_URL/admin/price-lists/$PLID/prices/batch" \
        -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d "$BODY" >/dev/null 2>&1; then
      echo "  ✓ price-list \"$PLTITLE\": $NUM prices ÷100"; OK=$((OK+1))
    else
      echo "  ✗ price-list \"$PLTITLE\" update failed" >&2; FAIL=$((FAIL+1))
    fi
  done <<< "$LISTS"
else
  echo "  (no price lists)"
fi

echo ""
SUFFIX=""; [[ "$DRY_RUN" == "1" ]] && SUFFIX=" (DRY_RUN — nothing written)"
echo "✓ Done — updated=$OK skipped=$SKIP failed=$FAIL$SUFFIX"
[[ "$FAIL" -gt 0 ]] && exit 1 || exit 0
