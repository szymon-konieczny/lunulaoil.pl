import Script from "next/script"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * Google Analytics 4 (gtag.js) wired to Google Consent Mode v2.
 *
 * Defaults to `denied` for all storage, so GA loads but sets no cookies and
 * does not track until the user accepts via the custom <CookieConsent> banner.
 * Returning visitors who already consented are bootstrapped from localStorage
 * so there is no measurement gap on the first paint.
 *
 * Renders nothing unless NEXT_PUBLIC_GA_ID is set (white-label friendly).
 */
const GoogleAnalytics = () => {
  if (!GA_ID) return null

  return (
    <>
      <Script id="ga-consent-default" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});
try {
  var c = JSON.parse(localStorage.getItem('lunula-cookie-consent') || 'null');
  if (c) {
    gtag('consent', 'update', {
      'analytics_storage': c.analytics ? 'granted' : 'denied',
      'ad_storage': c.marketing ? 'granted' : 'denied',
      'ad_user_data': c.marketing ? 'granted' : 'denied',
      'ad_personalization': c.marketing ? 'granted' : 'denied'
    });
  }
} catch (e) {}`}
      </Script>

      <Script
        id="ga-gtag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}

export default GoogleAnalytics
