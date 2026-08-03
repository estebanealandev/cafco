import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { SITE_URL } from './src/data/site.ts'
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/config.ts'

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map(locale => [locale, locale])),
      },
      // The bare "/" route is a redirect-only stub, not indexable content.
      filter: page => page !== `${SITE_URL}/`,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
