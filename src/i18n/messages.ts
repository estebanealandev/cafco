import type { Locale } from './config'
import de from './messages/de.json'
import en from './messages/en.json'
import es from './messages/es.json'
import fr from './messages/fr.json'

type Widen<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: Widen<T[K]> }
    : T

export type Messages = Widen<typeof es>

const messages: Record<Locale, Messages> = { es, en, de, fr }

export function getMessages(locale: Locale): Messages {
  return messages[locale]
}
