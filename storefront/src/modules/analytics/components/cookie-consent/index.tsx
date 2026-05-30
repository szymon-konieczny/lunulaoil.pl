"use client"

import { useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  OPEN_EVENT,
  applyConsent,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@modules/analytics/lib/consent"

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    // First visit (no stored choice) → show the banner.
    if (!readConsent()) {
      setVisible(true)
    }

    // Footer "Zarządzaj zgodami" link reopens the banner in settings mode.
    const handleOpen = () => {
      const current = readConsent()
      setAnalytics(current ? current.analytics : true)
      setMarketing(current ? current.marketing : true)
      setShowSettings(true)
      setVisible(true)
    }

    window.addEventListener(OPEN_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_EVENT, handleOpen)
  }, [])

  const persist = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const state: ConsentState = {
      analytics: nextAnalytics,
      marketing: nextMarketing,
      ts: Date.now(),
    }
    writeConsent(state)
    applyConsent(state)
    setVisible(false)
    setShowSettings(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1000] p-4 small:p-6 flex justify-center pointer-events-none"
      role="dialog"
      aria-live="polite"
      aria-label="Zgoda na pliki cookies"
      data-testid="cookie-consent"
    >
      <div className="pointer-events-auto w-full max-w-3xl bg-brand-surface border border-brand-border rounded-large shadow-lg p-6 small:p-8">
        <h2 className="font-heading text-xl text-brand-text mb-2">
          Dbamy o Twoją prywatność
        </h2>
        <p className="text-sm text-brand-text-muted leading-relaxed">
          Używamy plików cookies niezbędnych do działania sklepu oraz — za Twoją
          zgodą — cookies analitycznych (Google Analytics) i marketingowych.
          Szczegóły znajdziesz w{" "}
          <LocalizedClientLink
            href="/polityka-prywatnosci"
            className="text-brand-accent underline hover:no-underline"
          >
            Polityce prywatności
          </LocalizedClientLink>
          .
        </p>

        {showSettings && (
          <div className="mt-5 flex flex-col gap-3 border-t border-brand-border pt-5">
            <label className="flex items-start gap-3 opacity-70 cursor-not-allowed">
              <input type="checkbox" checked disabled className="mt-1 accent-brand-accent" />
              <span>
                <span className="block text-sm font-semibold text-brand-text">
                  Niezbędne
                </span>
                <span className="block text-xs text-brand-text-muted">
                  Wymagane do działania sklepu (koszyk, sesja, bezpieczeństwo).
                  Zawsze aktywne.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 accent-brand-accent"
                data-testid="consent-analytics"
              />
              <span>
                <span className="block text-sm font-semibold text-brand-text">
                  Analityczne
                </span>
                <span className="block text-xs text-brand-text-muted">
                  Statystyki odwiedzin (Google Analytics), pomagają ulepszać sklep.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 accent-brand-accent"
                data-testid="consent-marketing"
              />
              <span>
                <span className="block text-sm font-semibold text-brand-text">
                  Marketingowe
                </span>
                <span className="block text-xs text-brand-text-muted">
                  Personalizacja reklam i pomiar ich skuteczności.
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-6 flex flex-col small:flex-row gap-3 small:justify-end">
          {showSettings ? (
            <button
              type="button"
              onClick={() => persist(analytics, marketing)}
              className="order-1 small:order-3 px-5 py-2.5 rounded-rounded bg-brand-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              data-testid="consent-save"
            >
              Zapisz wybór
            </button>
          ) : (
            <button
              type="button"
              onClick={() => persist(true, true)}
              className="order-1 small:order-3 px-5 py-2.5 rounded-rounded bg-brand-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              data-testid="consent-accept-all"
            >
              Akceptuję wszystkie
            </button>
          )}

          <button
            type="button"
            onClick={() => persist(false, false)}
            className="order-2 px-5 py-2.5 rounded-rounded border border-brand-border text-brand-text text-sm font-semibold hover:bg-brand-background transition-colors"
            data-testid="consent-reject"
          >
            Tylko niezbędne
          </button>

          {!showSettings && (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="order-3 small:order-1 px-5 py-2.5 rounded-rounded text-brand-text-muted text-sm font-semibold hover:text-brand-text transition-colors"
              data-testid="consent-settings"
            >
              Ustawienia
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
