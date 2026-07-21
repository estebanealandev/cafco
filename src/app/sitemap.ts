import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getSiteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()

  return routing.locales.map(locale => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: locale === routing.defaultLocale ? 1 : 0.9,
  }))
}
