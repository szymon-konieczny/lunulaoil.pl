#!/usr/bin/env bash
# CORRECTIVE one-off: set each product variant's prices to the correct ABSOLUTE
# major-unit values (NOT dividing again). Fixes the earlier re-pricing that
# dropped one currency per multi-currency variant because prices were sent
# without currency_code (Medusa kept only the last entry).
#
# This sets PLN (+EUR where applicable) per handle, keyed by currency_code so
# both currencies are upserted correctly.
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" MEDUSA_EMAIL="admin@lunulaoil.pl" \
#     ./scripts/medusa-restore-prices.sh
#   DRY_RUN=1 ... for a preview.

set -euo pipefail
: "${MEDUSA_URL:?}" ; : "${MEDUSA_EMAIL:?}"
DRY_RUN="${DRY_RUN:-0}"
if [[ -z "${MEDUSA_PASSWORD:-}" ]]; then
  read -rs -p "Medusa admin password for $MEDUSA_EMAIL: " MEDUSA_PASSWORD; echo
fi
AUTH=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os;print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" -H "Content-Type: application/json" \
  -d "$AUTH" | python3 -c "import json,sys;print(json.load(sys.stdin).get('token',''))" 2>/dev/null)
[[ -z "$TOKEN" ]] && { echo "✗ login failed" >&2; exit 1; }
[[ "$DRY_RUN" == "1" ]] && echo "⚠  DRY_RUN=1 — nothing will be written"

# handle -> prices (major units). Format: "pln=AMT[,eur=AMT]"
declare -a MAP=(
  "pelnia-ksiezyca-250ml|pln=221"
  "wschod-slonca-250ml|pln=149"
  "ksiezyc-w-nowiu-250ml|pln=139"
  "ragnar-250ml|pln=149"
  "magnolia-250ml|pln=139"
  "slow-care-warsztaty|pln=180"
  "green-witch-divine-250ml|pln=149"
  "slow-care-skrypty|pln=139"
  "poranna-rosa-250ml|pln=139"
  "slow-coffee-cream|pln=190"
  "slow-care-pro|pln=490"
  "wiedzmywbiznesie|pln=199"
  "golden-glow-solar-touch-cream|pln=139,eur=32"
  "clear-ritual-pure-touch-cream|pln=119,eur=28"
  "rose-alchemy-phyto-renew-cream|pln=149,eur=35"
  "geranium-glow-moon-touch-cream|pln=129,eur=30"
  "hialcode|pln=69,eur=19"
  "rozyczka-mydlo-rytualne|pln=33,eur=8"
  "jojobacode|pln=59,eur=16"
  "squalanecode|pln=56,eur=14"
  "rusalka-mydlo-rytualne|pln=33,eur=8"
  "mokosza-mydlo-rytualne|pln=33,eur=8"
  "jojobacode-gold-100ml|pln=88,eur=21"
)

OK=0; FAIL=0
for entry in "${MAP[@]}"; do
  HANDLE="${entry%%|*}"
  SPEC="${entry##*|}"
  # Build prices JSON from SPEC (pln=33,eur=8)
  PRICES=$(SPEC="$SPEC" python3 -c "
import json,os
out=[]
for part in os.environ['SPEC'].split(','):
    cur,amt = part.split('=')
    out.append({'currency_code':cur,'amount':float(amt)})
print(json.dumps(out))
")
  # Resolve product id + ALL variant ids
  PROD=$(curl -sSf "$MEDUSA_URL/admin/products?handle=$HANDLE&fields=id,variants.id" \
    -H "Authorization: Bearer $TOKEN")
  read -r PID VIDS < <(echo "$PROD" | python3 -c "
import json,sys
p=json.load(sys.stdin).get('products',[])
if not p: print(' '); sys.exit()
pid=p[0]['id']; vids=' '.join(v['id'] for v in (p[0].get('variants') or []))
print(pid+'\t'+vids)
" | tr '\t' ' ')

  if [[ -z "${PID:-}" ]]; then
    echo "  ✗ $HANDLE — product not found" >&2; FAIL=$((FAIL+1)); continue
  fi

  for VID in $VIDS; do
    if [[ "$DRY_RUN" == "1" ]]; then
      echo "  (dry) $HANDLE / $VID -> $PRICES"; OK=$((OK+1)); continue
    fi
    if curl -sf -X POST "$MEDUSA_URL/admin/products/$PID/variants/$VID" \
        -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
        -d "{\"prices\":$PRICES}" >/dev/null 2>&1; then
      echo "  ✓ $HANDLE / $VID -> $PRICES"; OK=$((OK+1))
    else
      echo "  ✗ $HANDLE / $VID update failed" >&2; FAIL=$((FAIL+1))
    fi
  done
done

echo ""
SUF=""; [[ "$DRY_RUN" == "1" ]] && SUF=" (DRY_RUN — nothing written)"
echo "✓ Done — ok=$OK failed=$FAIL$SUF"
[[ "$FAIL" -gt 0 ]] && exit 1 || exit 0
