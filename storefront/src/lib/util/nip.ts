const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7]

/** Strips spaces and dashes, e.g. "525-224-84-81" -> "5252248481". */
export function normalizeNip(input: string): string {
  return input.replace(/[\s-]/g, "")
}

/** Polish NIP: 10 digits, mod-11 checksum with weights 6,5,7,2,3,4,5,6,7. */
export function isValidNip(input: string): boolean {
  const nip = normalizeNip(input)
  if (!/^\d{10}$/.test(nip)) {
    return false
  }
  // e.g. 0000000000 passes the checksum arithmetic but is not a real NIP
  if (/^(\d)\1{9}$/.test(nip)) {
    return false
  }
  const sum = NIP_WEIGHTS.reduce((acc, w, i) => acc + w * Number(nip[i]), 0)
  const check = sum % 11
  return check !== 10 && check === Number(nip[9])
}

/** Formats a normalized NIP for display, e.g. "5252248481" -> "525-224-84-81". */
export function formatNip(nip: string): string {
  return nip.length === 10
    ? `${nip.slice(0, 3)}-${nip.slice(3, 6)}-${nip.slice(6, 8)}-${nip.slice(8)}`
    : nip
}
