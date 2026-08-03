export const LOCALES = ['es', 'en', 'de', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  de: 'DE',
  fr: 'FR',
}

// Open Graph's og:locale expects language_TERRITORY, unlike our plain
// hreflang codes — this is a format requirement, not a targeting decision.
export const OG_LOCALE_MAP: Record<Locale, string> = {
  es: 'es_CR',
  en: 'en_US',
  de: 'de_DE',
  fr: 'fr_FR',
}
