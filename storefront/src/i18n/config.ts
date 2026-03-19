export const DEFAULT_LOCALE = "pl" as const

export const SUPPORTED_LOCALES = ["pl"] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]
