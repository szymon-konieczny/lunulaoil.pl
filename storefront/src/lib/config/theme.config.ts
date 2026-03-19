export const themeConfig = {
  // Brand
  name: "Lunula Botanique",
  tagline: "Biozgodna pielęgnacja — powrót do natury",
  description:
    "Biozgodna pielęgnacja twarzy i ciała. Składniki rozpoznawalne przez skórę, w harmonii z jej naturalnymi procesami.",
  url: "https://lunulaoil.pl",
  locale: "pl",

  // Logo
  logo: {
    src: "/logo-botanique.jpeg",
    alt: "Lunula Botanique",
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
    titleTemplate: "%s | Lunula Botanique",
    defaultTitle: "Lunula Botanique — biozgodna pielęgnacja",
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: "Lunula Botanique",
    },
  },
} as const

export type ThemeConfig = typeof themeConfig
