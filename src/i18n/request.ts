import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

type AppLocale = (typeof routing.locales)[number]

function isAppLocale(locale: string): locale is AppLocale {
  return (routing.locales as readonly string[]).includes(locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = typeof requested === 'string' && isAppLocale(requested)
    ? requested
    : routing.defaultLocale

  const messagesModule = await import(`../../messages/${locale}.json`) as {
    default: Record<string, unknown>
  }

  return {
    locale,
    messages: messagesModule.default,
  }
})
