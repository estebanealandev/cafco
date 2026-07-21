'use client'

import * as Select from '@radix-ui/react-select'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/routing'

const LOCALES = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
  { value: 'fr', label: 'FR' },
  { value: 'de', label: 'DE' },
] as const

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('Index')
  const [isPending, startTransition] = useTransition()

  function onValueChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <Select.Root
      value={locale}
      onValueChange={onValueChange}
      disabled={isPending}
    >
      <Select.Trigger
        className="locale-switcher locale-select-trigger"
        aria-label={t('nav.localeAria')}
      >
        <Select.Value />
        <Select.Icon className="locale-select-chevron" aria-hidden="true">
          ▾
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="locale-select-content"
          position="popper"
          sideOffset={6}
          align="end"
        >
          <Select.Viewport>
            {LOCALES.map(item => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="locale-select-item"
              >
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
