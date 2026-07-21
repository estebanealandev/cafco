'use client'

import { useTranslations } from 'next-intl'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { theme, toggleTheme, ready } = useTheme()
  const t = useTranslations('Index')

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={t('theme.toggle')}
      title={theme === 'light' ? t('theme.dark') : t('theme.light')}
      data-ready={String(ready)}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === 'light' ? '◐' : '◑'}
      </span>
    </button>
  )
}
