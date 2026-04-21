const DEFAULT_BASE = "https://lunulaoil.pl"
const DEFAULT_COUNTRY = "pl"

const stripTrailingSlash = (s: string): string => s.replace(/\/+$/, "")
const stripLeadingSlash = (s: string): string => s.replace(/^\/+/, "")

export const getStorefrontBaseUrl = (): string =>
  stripTrailingSlash((process.env.STOREFRONT_URL ?? DEFAULT_BASE).trim())

export const buildProductUrl = (
  handle: string,
  countryCode?: string | null
): string => {
  const cc = (countryCode ?? DEFAULT_COUNTRY).trim().toLowerCase() || DEFAULT_COUNTRY
  const cleanHandle = stripLeadingSlash(stripTrailingSlash(handle.trim()))
  return `${getStorefrontBaseUrl()}/${cc}/products/${cleanHandle}`
}
