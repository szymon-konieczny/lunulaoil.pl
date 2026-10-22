#!/bin/sh
# Fix Medusa JS SDK localStorage issue with Node.js 22 / Turbopack SSR
#
# Node 22 exposes a `localStorage` global that is not usable unless the runtime
# was started with --localstorage-file. The SDK's `hasStorage` only checks
# `storage in window`, so it reports storage as available and the SDK then
# crashes on first use. The patch below makes `hasStorage` confirm the object is
# actually usable, and never throw.
#
# The replacement matches the whole `hasStorage` function verbatim. That matters:
# this used to be three line-wise `sed` substitutions, and one of them rewrote
# every `if (typeof window !== "undefined") {` in the file. It therefore also hit
# the identically shaped line in the neighbouring `toBase64`, where `storage` is
# not in scope (it is a parameter of `hasStorage`), leaving `toBase64` throwing
# `ReferenceError: storage is not defined` in the browser. Matching the whole
# block keeps the patch inside `hasStorage` and makes it idempotent for free:
# once applied, the text it matches on is gone.
set -e

node - \
  "node_modules/@medusajs/js-sdk/dist/esm/client.js" \
  "node_modules/@medusajs/js-sdk/dist/client.js" <<'PATCH_EOF'
const fs = require("fs")

const ORIGINAL = [
  'const hasStorage = (storage) => {',
  '    if (typeof window !== "undefined") {',
  '        return storage in window;',
  '    }',
  '    return false;',
  '};',
].join("\n")

const PATCHED = [
  'const hasStorage = (storage) => {',
  '    try {',
  '        if (typeof window !== "undefined" && window[storage] && typeof window[storage].getItem === "function") {',
  '            return storage in window;',
  '        }',
  '        return false;',
  '    } catch (e) {',
  '        return false;',
  '    }',
  '};',
].join("\n")

// Shape left behind by the older sed-based revision of this patch, which also
// corrupted `toBase64`. Such a tree cannot be repaired in place, so say so.
const STALE = 'const hasStorage = (storage) => { try {'

let patched = 0

for (const file of process.argv.slice(2)) {
  if (!fs.existsSync(file)) {
    continue
  }

  const source = fs.readFileSync(file, "utf8")

  if (source.includes(PATCHED)) {
    continue
  }

  if (source.includes(STALE)) {
    console.error(
      `Medusa SDK localStorage patch: ${file} still carries the old patch, ` +
        `which also broke toBase64. Run: rm -rf node_modules && npm ci`
    )
    process.exit(1)
  }

  if (!source.includes(ORIGINAL)) {
    console.error(
      `Medusa SDK localStorage patch: hasStorage is not in the expected shape ` +
        `in ${file}. The SDK changed — review patches/fix-medusa-sdk-localstorage.sh ` +
        `before shipping, the Node 22 localStorage crash is no longer guarded.`
    )
    process.exit(1)
  }

  fs.writeFileSync(file, source.replace(ORIGINAL, PATCHED))
  patched++
}

console.log(
  patched > 0
    ? `Medusa SDK localStorage patch applied (${patched} file(s))`
    : "Medusa SDK localStorage patch already applied"
)
PATCH_EOF
