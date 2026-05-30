"use client"

/**
 * Client-side cookie-consent state — single source of truth for the custom
 * (Cookiebot-free) consent banner and for driving Google Consent Mode v2.
 *
 * Categories mirror the privacy policy (sekcja VIII): Niezbędne (always on),
 * Analityczne (Google Analytics), Marketingowe (ads personalization).
 */

export type ConsentState = {
  analytics: boolean
  marketing: boolean
  ts: number
}

// NOTE: keep STORAGE_KEY in sync with the inline bootstrap script in
// modules/analytics/components/google-analytics (it reads localStorage directly).
export const STORAGE_KEY = "lunula-cookie-consent"

// Window event used by the footer "Zarządzaj zgodami" link to reopen the banner.
export const OPEN_EVENT = "lunula:open-cookie-settings"

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

export const readConsent = (): ConsentState | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed?.analytics !== "boolean") return null
    return parsed as ConsentState
  } catch {
    return null
  }
}

export const writeConsent = (state: ConsentState): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode / blocked) — ignore
  }
}

// First-party cookies (readable/removable from our origin) per category.
// Analytics: _ga, _ga_<id>, _gid, _gat*. Marketing: _gcl_* (Google Ads linker).
// Third-party ad cookies (doubleclick.net) can't be deleted via JS — Consent
// Mode "denied" stops those instead.
const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid"]
const MARKETING_COOKIE_PREFIXES = ["_gcl_"]

const deleteCookie = (name: string): void => {
  const host = window.location.hostname
  const domains = new Set<string>(["", host, `.${host}`])
  const parts = host.split(".")
  if (parts.length > 2) domains.add(`.${parts.slice(-2).join(".")}`) // e.g. .lunulaoil.pl
  const expiry = "expires=Thu, 01 Jan 1970 00:00:00 GMT"
  domains.forEach((d) => {
    document.cookie = `${name}=; ${expiry}; path=/${d ? `; domain=${d}` : ""}`
  })
}

/** Physically remove first-party cookies for categories the user just denied. */
export const clearConsentCookies = (
  state: Pick<ConsentState, "analytics" | "marketing">
): void => {
  if (typeof document === "undefined") return
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter(Boolean)
  const prefixes: string[] = [
    ...(state.analytics ? [] : ANALYTICS_COOKIE_PREFIXES),
    ...(state.marketing ? [] : MARKETING_COOKIE_PREFIXES),
  ]
  if (!prefixes.length) return
  names
    .filter((n) => prefixes.some((p) => n === p || n.startsWith(p)))
    .forEach(deleteCookie)
}

/** Push the user's choice into Google Consent Mode v2 and tidy up cookies. */
export const applyConsent = (state: Pick<ConsentState, "analytics" | "marketing">): void => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.marketing ? "granted" : "denied",
      ad_user_data: state.marketing ? "granted" : "denied",
      ad_personalization: state.marketing ? "granted" : "denied",
    })
  }
  // Remove existing cookies for any category the user has now declined.
  clearConsentCookies(state)
}

/** Reopen the consent banner (used by the footer link). */
export const openCookieSettings = (): void => {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(OPEN_EVENT))
}
