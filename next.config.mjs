import path from 'node:path'

const cspDirectives = [
  'default-src \'self\'',
  'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
  'style-src \'self\' \'unsafe-inline\'',
  'img-src \'self\' data: blob: https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev https://static.wixstatic.com',
  'font-src \'self\' data:',
  'connect-src \'self\'',
  'frame-ancestors \'none\'',
  'base-uri \'self\'',
  'form-action \'self\'',
  'object-src \'none\'',
  'upgrade-insecure-requests',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
  webpack(config) {
    if (!config.resolve)
      config.resolve = {}
    if (!config.resolve.alias)
      config.resolve.alias = {}
    config.resolve.alias['next-intl/config'] = path.resolve(process.cwd(), './src/i18n/request.ts')
    return config
  },
  turbopack: {
    resolveAlias: {
      'next-intl/config': './src/i18n/request.ts',
    },
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Content-Security-Policy', value: cspDirectives.join('; ') },
        ],
      },
    ]
  },
}

export default nextConfig
