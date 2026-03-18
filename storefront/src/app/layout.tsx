import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Open_Sans, Playfair_Display } from "next/font/google"
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
    default: "Lunula Oil — BIO olejki i naturalna pielęgnacja",
    template: "%s | Lunula Oil & More",
  },
  description:
    "Najwyższej jakości naturalne olejki i starannie dobrane surowce kosmetyczne z Maroka, Hiszpanii i Francji. Unikalne aromaty, konsystencje i działanie.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Lunula Oil & More",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="pl"
      data-mode="light"
      className={`${openSans.variable} ${playfair.variable}`}
    >
      <body className="bg-brand-background text-brand-text font-sans antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
