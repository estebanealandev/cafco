import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: { tsconfigPath: 'tsconfig.json' },
  nextjs: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
  formatters: { css: true, html: true },
  ignores: [
    'infra/**',
    'docker/**',
    'scripts/**',
    'docs/**',
    'systemd/**',
    'pm2/**',
    '.next/**',
    'coverage/**',
    'parsed_body.txt',
    'parse_html.js',
  ],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'ts/no-explicit-any': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
    // Allow process.env in Next.js app/runtime code
    'node/prefer-global/process': 'off',
    // next-intl rich text + local marketing copy use trusted HTML strings
    'react-dom/no-dangerously-set-innerhtml': 'off',
    // Logo assets intentionally use raw <img> for external SVG
    'next/no-img-element': 'off',
    // next-intl t.raw() and JSON message trees are loosely typed
    'ts/no-unsafe-assignment': 'off',
  },
})
