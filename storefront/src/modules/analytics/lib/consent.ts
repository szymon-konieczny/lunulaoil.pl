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

/** Push the user's choice into Google Consent Mode v2. */
export const applyConsent = (state: Pick<ConsentState, "analytics" | "marketing">): void => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  })
}

/** Reopen the consent banner (used by the footer link). */
export const openCookieSettings = (): void => {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(OPEN_EVENT))
}
