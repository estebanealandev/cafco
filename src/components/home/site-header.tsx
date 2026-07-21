'use client'

import { useTranslations } from 'next-intl'
import { useState, useSyncExternalStore } from 'react'
import { WaIcon } from '@/components/icons/wa-icon'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { MobileNav } from '@/components/ui/mobile-nav'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { LOGO_LIGHT, NAV_SECTIONS, WA_BASE } from '@/lib/site'
import { smoothScrollTo } from '@/lib/smooth-scroll'

const SECTION_IDS = NAV_SECTIONS.map(s => s.id)

function subscribeScroll(onStoreChange: () => void) {
  window.addEventListener('scroll', onStoreChange, { passive: true })
  return () => window.removeEventListener('scroll', onStoreChange)
}

export function SiteHeader() {
  const t = useTranslations('Index')
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 10,
    () => false,
  )
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeId = useScrollSpy(SECTION_IDS)

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="mainNav">
        <div className="nav-inner">
          <ul className="nav-links">
            {NAV_SECTIONS.map(section => (
              <li key={section.id}>
                <a
                  href={section.href}
                  className={activeId === section.id ? 'is-active' : undefined}
                  onClick={e => smoothScrollTo(section.href, e)}
                >
                  {t(section.labelKey)}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#inicio"
            className="nav-logo"
            onClick={e => smoothScrollTo('#inicio', e)}
          >
            <img
              src={LOGO_LIGHT}
              alt="CAFCO"
              className="nav-logo-img"
            />
          </a>
          <div className="nav-actions">
            <a
              href={WA_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-wa"
            >
              <WaIcon />
              {' '}
              {t('nav.order')}
            </a>
            <ThemeToggle />
            <LocaleSwitcher />
            <button
              type="button"
              className="menu-toggle"
              aria-label={t('nav.menuAria')}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <div className="menu-toggle-lines">
                <span></span>
                <span></span>
              </div>
              {t('nav.menu')}
            </button>
          </div>
        </div>
      </nav>
      <MobileNav
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        activeId={activeId}
      />
    </>
  )
}
