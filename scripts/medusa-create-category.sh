#!/usr/bin/env bash
# Create a Medusa product category via the admin API.
#
# Usage:
#   MEDUSA_URL="https://your-backend.up.railway.app" \
#   MEDUSA_EMAIL="admin@example.com" \
#   MEDUSA_PASSWORD="…" \
#   ./scripts/medusa-create-category.sh "Zestawy" "zestawy"
#
# Args:
#   $1 — display name (e.g. "Zestawy")
#   $2 — handle (URL slug, e.g. "zestawy") — optional, defaults to lowercased name
#
# Why this script exists:
#   The admin UI errors out on the create-category form in this Medusa version.
#   This bypasses the UI and talks to /admin/product-categories directly.

set -euo pipefail

: "${MEDUSA_URL:?set MEDUSA_URL, e.g. https://backend.up.railway.app}"
: "${MEDUSA_EMAIL:?set MEDUSA_EMAIL}"
: "${MEDUSA_PASSWORD:?set MEDUSA_PASSWORD}"

NAME="${1:?provide category name as first arg, e.g. \"Zestawy\"}"
HANDLE="${2:-$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')}"

echo "→ Logging in to $MEDUSA_URL as $MEDUSA_EMAIL"
# Build the JSON payload with python so special chars in the password
# (" \ $ etc.) are escaped correctly instead of breaking the JSON string.
AUTH_PAYLOAD=$(MEDUSA_EMAIL="$MEDUSA_EMAIL" MEDUSA_PASSWORD="$MEDUSA_PASSWORD" python3 -c \
  'import json,os; print(json.dumps({"email":os.environ["MEDUSA_EMAIL"],"password":os.environ["MEDUSA_PASSWORD"]}))')
TOKEN=$(curl -sS -X POST "$MEDUSA_URL/auth/user/emailpass" \
  -H "Content-Type: application/json" \
  -d "$AUTH_PAYLOAD" \
  | python3 -c "import json,sys; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

if [[ -z "$TOKEN" ]]; then
  echo "✗ Login failed — check email/password (HTTP 401 = wrong credentials)" >&2
  exit 1
fi

echo "→ Creating category name=\"$NAME\" handle=\"$HANDLE\""
RESPONSE=$(curl -sS -X POST "$MEDUSA_URL/admin/product-categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"handle\":\"$HANDLE\",\"is_active\":true,\"is_internal\":false}")

ID=$(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('product_category',{}).get('id') or '')")

if [[ -n "$ID" ]]; then
  echo "✓ Created: $ID  ($NAME / $HANDLE)"
else
  echo "✗ Create failed. Response:" >&2
  echo "$RESPONSE" | python3 -m json.tool >&2 || echo "$RESPONSE" >&2
  exit 1
fi
