import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev' },
      { protocol: 'https', hostname: 'static.wixstatic.com' },
    ],
  },
  webpack(config) {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    config.resolve.alias['next-intl/config'] = path.resolve(process.cwd(), './src/i18n/request.ts');
    return config;
  },
  turbopack: {
    resolveAlias: {
      'next-intl/config': './src/i18n/request.ts'
    }
  }
};

export default nextConfig;
