#!/bin/sh
# Fix Medusa JS SDK localStorage issue with Node.js 22 / Turbopack SSR
# Node 22 provides a broken localStorage object that crashes Medusa SDK's hasStorage check
SDK_ESM="node_modules/@medusajs/js-sdk/dist/esm/client.js"
SDK_CJS="node_modules/@medusajs/js-sdk/dist/client.js"

for f in "$SDK_ESM" "$SDK_CJS"; do
  if [ -f "$f" ]; then
    # Use a temp file for sed compatibility across macOS and Linux
    sed 's/const hasStorage = (storage) => {/const hasStorage = (storage) => { try {/' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    sed 's/    if (typeof window !== "undefined") {/    if (typeof window !== "undefined" \&\& window[storage] \&\& typeof window[storage].getItem === "function") {/' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
    sed '/^    return false;/{
N
s/    return false;\n};/    return false;\n} catch(e) { return false; }\n};/
}' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done
echo "Medusa SDK localStorage patch applied"
