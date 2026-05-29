#!/usr/bin/env bash
# Migrate wp-content product images from the old WordPress VPS to Medusa (R2).
#
# For each product whose thumbnail or images still contain a wp-content URL:
#   1. Fetches the file directly from the VPS by IP (domain no longer points there)
#   2. Re-uploads it to Medusa's file storage (lands on R2)
#   3. Updates the product's images array and thumbnail with the new R2 URL
#
# Requirements: curl, python3
#
# Usage:
#   MEDUSA_URL="https://api.lunulaoil.pl" \
#   MEDUSA_EMAIL="admin@lunulaoil.pl" \
#   ./scripts/medusa-migrate-wp-images.sh
#   (you'll be prompted for the password)
#
# Optional env:
#   VPS_IP    old WordPress VPS IP  (default: 62.84.188.130)
#   VPS_HOST  Host header to send   (default: lunulaoil.pl)
#   DRY_RUN=1 download+upload but skip the final product update (test run)

set -euo pipefail

VPS_IP="${VPS_IP:-62.84.188.130}"
VPS_HOST="${VPS_HOST:-lunulaoil.pl}"
DRY_RUN="${DRY_RUN:-0}"

: "${MEDUSA_URL:?set MEDUSA_URL, e.g. https://api.lunulaoil.pl}"
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

[[ "$DRY_RUN" == "1" ]] && echo "⚠  DRY_RUN=1 — downloads and uploads will run, but products will NOT be updated"

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# Return the MIME type for a filename based on its extension.
mime_for() {
  local ext="${1##*.}"
  case "${ext,,}" in
    jpg|jpeg) echo "image/jpeg" ;;
    png)      echo "image/png"  ;;
    webp)     echo "image/webp" ;;
    gif)      echo "image/gif"  ;;
    *)        echo "application/octet-stream" ;;
  esac
}

OK_IMG=0; FAIL_IMG=0; OK_PROD=0; FAIL_PROD=0; SKIP_PROD=0
LIMIT=100; OFFSET=0

echo "→ Scanning and migrating WordPress images to R2"

while :; do
  PAGE=$(curl -sSf \
    "$MEDUSA_URL/admin/products?limit=$LIMIT&offset=$OFFSET&fields=id,handle,title,thumbnail,images.url" \
    -H "Authorization: Bearer $TOKEN")
  TOTAL=$(echo "$PAGE" | python3 -c "import json,sys; print(json.load(sys.stdin).get('count',0))")

  # IDs of products that have at least one wp-content URL
  PIDS=$(echo "$PAGE" | python3 -c "
import json, sys
for p in json.load(sys.stdin).get('products', []):
    urls = [p.get('thumbnail') or ''] + [i.get('url','') for i in (p.get('images') or [])]
    if any('wp-content' in u for u in urls):
        print(p['id'])
" || true)

  if [[ -n "$PIDS" ]]; then
    while IFS= read -r PID; do
      [[ -z "$PID" ]] && continue

      # Fetch full product data
      PRAW=$(curl -sSf \
        "$MEDUSA_URL/admin/products/$PID?fields=id,handle,title,thumbnail,images.url" \
        -H "Authorization: Bearer $TOKEN")
      PDATA=$(echo "$PRAW" | python3 -c "
import json,sys; d=json.load(sys.stdin); print(json.dumps(d.get('product') or d))")

      TITLE=$(echo "$PDATA" | python3 -c "import json,sys; print(json.load(sys.stdin).get('title','?'))")
      HANDLE=$(echo "$PDATA" | python3 -c "import json,sys; print(json.load(sys.stdin).get('handle','?'))")
      echo ""
      echo "→ [$HANDLE] $TITLE"

      # Write product JSON to a temp file for later processing
      echo "$PDATA" > "$WORK/${PID}.json"

      # Collect unique wp-content URLs (thumbnail + images)
      WP_URLS=$(echo "$PDATA" | python3 -c "
import json, sys
p = json.load(sys.stdin)
seen = set()
for url in ([p.get('thumbnail') or ''] + [i.get('url','') for i in (p.get('images') or [])]):
    if 'wp-content' in url and url not in seen:
        seen.add(url)
        print(url)
" || true)

      # mapping file: lines of "old_url<TAB>new_url"
      MAPFILE="$WORK/${PID}.map"
      > "$MAPFILE"

      while IFS= read -r WP_URL; do
        [[ -z "$WP_URL" ]] && continue

        # Extract URL path and filename
        WP_PATH=$(python3 -c "
from urllib.parse import urlparse; import sys
print(urlparse('$WP_URL').path)")
        FNAME=$(basename "${WP_PATH%%\?*}")
        MIME=$(mime_for "$FNAME")
        TMPFILE="$WORK/${PID}_${FNAME}"

        # Download from VPS directly (bypassing DNS)
        HTTP=$(curl -ks -o "$TMPFILE" -w "%{http_code}" \
          -H "Host: $VPS_HOST" \
          "https://${VPS_IP}${WP_PATH}" 2>/dev/null || echo "000")

        if [[ "$HTTP" != "200" ]] || [[ ! -s "$TMPFILE" ]]; then
          echo "  ✗ download failed (http=$HTTP): $FNAME"
          FAIL_IMG=$((FAIL_IMG+1))
          continue
        fi

        # Upload to Medusa → R2
        UPLOAD_RESP=$(curl -sf -X POST "$MEDUSA_URL/admin/uploads" \
          -H "Authorization: Bearer $TOKEN" \
          -F "files=@${TMPFILE};filename=${FNAME};type=${MIME}" 2>/dev/null || echo "")

        NEW_URL=$(echo "$UPLOAD_RESP" | python3 -c "
import json,sys
try:
    f=json.load(sys.stdin).get('files',[])
    print(f[0].get('url','') if f else '')
except: print('')" 2>/dev/null || echo "")

        if [[ -z "$NEW_URL" ]]; then
          echo "  ✗ upload failed: $FNAME"
          FAIL_IMG=$((FAIL_IMG+1))
          continue
        fi

        echo "  ✓ $FNAME  →  R2"
        OK_IMG=$((OK_IMG+1))
        printf '%s\t%s\n' "$WP_URL" "$NEW_URL" >> "$MAPFILE"

      done <<< "$WP_URLS"

      # Skip product update if nothing was successfully migrated
      if [[ ! -s "$MAPFILE" ]]; then
        echo "  ⚠  no images migrated — skipping product update"
        SKIP_PROD=$((SKIP_PROD+1))
        continue
      fi

      # Build the PATCH: swap WP URLs for new R2 URLs in images array + thumbnail
      PATCH=$(MAPFILE="$MAPFILE" PFILE="$WORK/${PID}.json" python3 -c "
import json, os

with open(os.environ['PFILE'])  as f: p = json.load(f)
with open(os.environ['MAPFILE']) as f:
    mapping = {}
    for line in f:
        line = line.rstrip('\n')
        if '\t' in line:
            old, new = line.split('\t', 1)
            mapping[old] = new

old_thumb  = p.get('thumbnail') or ''
old_imgs   = p.get('images') or []

new_thumb = mapping.get(old_thumb, old_thumb)
new_imgs  = [{'url': mapping.get(i.get('url',''), i.get('url',''))} for i in old_imgs]

# If product had a WP thumbnail but empty images array, seed images from thumbnail
if not new_imgs and new_thumb:
    new_imgs = [{'url': new_thumb}]

print(json.dumps({'thumbnail': new_thumb, 'images': new_imgs}))
")

      if [[ "$DRY_RUN" == "1" ]]; then
        echo "  (dry-run) would PATCH: $(echo "$PATCH" | python3 -c "import json,sys; d=json.load(sys.stdin); print('thumbnail=%s images=%d' % (bool(d.get('thumbnail')), len(d.get('images',[]))))")"
        OK_PROD=$((OK_PROD+1))
        continue
      fi

      if curl -sf -X POST "$MEDUSA_URL/admin/products/$PID" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d "$PATCH" >/dev/null 2>&1; then
        echo "  ✓ product updated"
        OK_PROD=$((OK_PROD+1))
      else
        echo "  ✗ product update failed"
        FAIL_PROD=$((FAIL_PROD+1))
      fi

    done <<< "$PIDS"
  fi

  OFFSET=$((OFFSET + LIMIT))
  [[ "$TOTAL" -eq 0 || "$OFFSET" -ge "$TOTAL" ]] && break
done

echo ""
echo "✓ Done"
echo "  Images : migrated=$OK_IMG  failed=$FAIL_IMG"
echo "  Products: updated=$OK_PROD  skipped=$SKIP_PROD  failed=$FAIL_PROD"
[[ "$FAIL_IMG" -gt 0 || "$FAIL_PROD" -gt 0 ]] && exit 1 || exit 0
