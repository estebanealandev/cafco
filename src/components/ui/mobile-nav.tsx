'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'
import { WaIcon } from '@/components/icons/wa-icon'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { NAV_SECTIONS, WA_BASE } from '@/lib/site'
import { smoothScrollTo } from '@/lib/smooth-scroll'

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeId: string
}

export function MobileNav({ open, onOpenChange, activeId }: MobileNavProps) {
  const t = useTranslations('Index')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu-overlay" />
        <Dialog.Content className="mobile-menu mobile-menu-dialog" id="mobileMenu">
          <Dialog.Title className="sr-only">{t('nav.menu')}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('nav.menuAria')}
          </Dialog.Description>
          <Dialog.Close className="mobile-close" aria-label={t('nav.close')}>
            &#10005;
          </Dialog.Close>
          {NAV_SECTIONS.map(section => (
            <a
              key={section.id}
              href={section.href}
              className={activeId === section.id ? 'is-active' : undefined}
              onClick={(e) => {
                smoothScrollTo(section.href, e)
                onOpenChange(false)
              }}
            >
              {t(section.labelKey)}
            </a>
          ))}
          <div className="mobile-menu-locale">
            <LocaleSwitcher />
          </div>
          <a
            href={WA_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-wa"
          >
            <WaIcon size={18} />
            {' '}
            {t('nav.orderWa')}
          </a>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
