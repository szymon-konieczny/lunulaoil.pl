"use client"

import { openCookieSettings } from "@modules/analytics/lib/consent"

/** Footer link that reopens the cookie-consent banner (RODO: withdraw consent). */
const ManageConsentLink = () => {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="hover:text-brand-accent transition-colors text-left"
      data-testid="manage-consent-link"
    >
      Zarządzaj zgodami
    </button>
  )
}

export default ManageConsentLink
