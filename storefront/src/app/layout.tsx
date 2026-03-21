import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import Script from "next/script"
import { Open_Sans, Playfair_Display } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "styles/globals.css"

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Lunula Botanique - biozgodna pielęgnacja",
    template: "%s | Lunula Botanique",
  },
  description:
    "Biozgodna pielęgnacja twarzy i ciała. Składniki rozpoznawalne przez skórę, w harmonii z jej naturalnymi procesami.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Lunula Botanique",
  },
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
const COOKIEBOT_ID = process.env.NEXT_PUBLIC_COOKIEBOT_ID

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      data-mode="light"
      className={`${openSans.variable} ${playfair.variable}`}
    >
      <head>
        {/* Google Consent Mode v2 defaults - must load before GTM */}
        {GTM_ID && (
          <Script id="gtm-consent-defaults" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});`}
          </Script>
        )}

        {/* Cookiebot - manages consent banner and updates consent state */}
        {COOKIEBOT_ID && (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid={COOKIEBOT_ID}
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        )}

        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}<title></title>
      </head>
      <body className="bg-brand-background text-brand-text font-sans antialiased">
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <NextIntlClientProvider messages={messages}>
          <main className="relative">{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
