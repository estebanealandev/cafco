import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: { tsconfigPath: 'tsconfig.json' },
  nextjs: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
  formatters: { css: true, html: true },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'ts/no-explicit-any': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
  },
})
