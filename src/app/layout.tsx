import type { ReactNode } from 'react'

/**
 * Root layout required by Next.js App Router for routes outside [locale]
 * (API, robots, sitemap). Locale-specific HTML/fonts live in [locale]/layout.
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  return children
}
