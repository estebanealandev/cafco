import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { Newsreader, Source_Sans_3 } from 'next/font/google'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getSiteUrl } from '@/lib/site-url'
import '@/app/globals.css'

/**
 * Display / headings — Newsreader (OFL)
 * Closest open alternative to WatchHouse's Tiempos Headline:
 * contemporary transitional serif, optical sizing, editorial presence.
 */
const displayFont = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

/**
 * Body / UI — Source Sans 3 (OFL)
 * Closest open alternative to WatchHouse's Balto:
 * clean neo-grotesque with true light weights and excellent multilingual coverage.
 */
const bodyFont = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})

type Locale = (typeof routing.locales)[number]

const siteName = 'CAFCO'
const defaultDescription
  = 'Chorreadores de café artesanales en concreto y madera. Diseño costarricense para una experiencia de café elevada.'

const localeTitles: Record<Locale, string> = {
  es: 'CAFCO | Chorreadores de café artesanales',
  en: 'CAFCO | Artisanal coffee brewers',
  de: 'CAFCO | Handgefertigte Kaffeebereiter',
  fr: 'CAFCO | Cafetieres artisanales',
}

const localeDescriptions: Record<Locale, string> = {
  es: defaultDescription,
  en: 'Artisanal concrete and wood coffee brewers. Costa Rican design for an elevated coffee experience.',
  de: 'Handgefertigte Kaffeebereiter aus Beton und Holz. Costa-ricanisches Design fuer ein gehobenes Kaffeeerlebnis.',
  fr: 'Cafetieres artisanales en beton et bois. Design costaricien pour une experience cafe elevee.',
}

const openGraphLocales: Record<Locale, string> = {
  es: 'es_CR',
  en: 'en_US',
  de: 'de_DE',
  fr: 'fr_FR',
}

function isSupportedLocale(locale: string): locale is Locale {
  return (routing.locales as readonly string[]).includes(locale)
}

function getLanguageAlternates() {
  const languages: Record<string, string> = {
    'x-default': `/${routing.defaultLocale}`,
  }

  for (const locale of routing.locales) {
    languages[locale] = `/${locale}`
  }

  return languages
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params
  const locale = isSupportedLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale
  const title = localeTitles[locale]
  const description = localeDescriptions[locale]

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title,
      description,
      siteName,
      url: `/${locale}`,
      type: 'website',
      locale: openGraphLocales[locale],
      alternateLocale: routing.locales
        .filter(alternateLocale => alternateLocale !== locale)
        .map(alternateLocale => openGraphLocales[alternateLocale]),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

async function getMessages(locale: string): Promise<Record<string, unknown>> {
  try {
    const messagesModule = await import(`../../../messages/${locale}.json`) as {
      default: Record<string, unknown>
    }
    return messagesModule.default
  }
  catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error)
    notFound()
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const messages = await getMessages(locale)

  return (
    <html
      lang={locale}
      className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cafco-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev" />
        <link rel="dns-prefetch" href="https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev" />
        <link rel="preconnect" href="https://static.wixstatic.com" />
        <link rel="dns-prefetch" href="https://static.wixstatic.com" />
      </head>
      <body>
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone="UTC"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
