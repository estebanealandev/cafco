const TRAILING_SLASHES = /\/+$/

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  const base = typeof configured === 'string' && configured.length > 0
    ? configured
    : 'https://cafco.cr'
  return base.replace(TRAILING_SLASHES, '')
}
