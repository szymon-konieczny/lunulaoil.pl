export const themeConfig = {
  // Brand
  name: "Lunula Oil & More",
  tagline: "BIO olejki — naturalna pielęgnacja",
  description:
    "Najwyższej jakości naturalne olejki i starannie dobrane surowce kosmetyczne z Maroka, Hiszpanii i Francji. Unikalne aromaty, konsystencje i działanie.",
  url: "https://lunulaoil.pl",
  locale: "pl",

  // Logo
  logo: {
    src: "/logo.png",
    alt: "Lunula Oil",
    width: 100,
    height: 100,
  },

  // Colors (CSS variable names — actual values in globals.css)
  colors: {
    primary: "var(--color-primary)",
    primaryLight: "var(--color-primary-light)",
    primaryDark: "var(--color-primary-dark)",
    accent: "var(--color-accent)",
    accentLight: "var(--color-accent-light)",
    background: "var(--color-background)",
    surface: "var(--color-surface)",
    text: "var(--color-text)",
    textMuted: "var(--color-text-muted)",
  },

  // Typography
  fonts: {
    heading: '"Open Sans", "system-ui", sans-serif',
    body: '"Open Sans", "system-ui", sans-serif',
  },

  // Social
  social: {
    instagram: "https://www.instagram.com/lunulaoil/",
    facebook: "",
  },

  // Contact
  contact: {
    email: "kontakt@lunulaoil.pl",
    phone: "+48 509 085 064",
  },

  // Features (white-label feature flags)
  features: {
    b2b: process.env.NEXT_PUBLIC_ENABLE_B2B === "true",
    subscriptions: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS === "true",
    workshops: process.env.NEXT_PUBLIC_ENABLE_WORKSHOPS === "true",
    instagramBot: process.env.NEXT_PUBLIC_ENABLE_IG_BOT === "true",
    newsletter: true,
  },

  // SEO
  seo: {
    titleTemplate: "%s | Lunula Oil & More",
    defaultTitle: "Lunula Oil — BIO olejki i naturalna pielęgnacja",
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: "Lunula Oil & More",
    },
  },
} as const

export type ThemeConfig = typeof themeConfig
