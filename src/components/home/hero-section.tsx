'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { WaIcon } from '@/components/icons/wa-icon'
import { productImages, WA_BASE } from '@/lib/site'
import { smoothScrollTo } from '@/lib/smooth-scroll'

export function HeroSection() {
  const t = useTranslations('Index')

  return (
    <section className="hero" id="inicio">
      <div className="hero-bg">
        <Image
          src={productImages.hero}
          alt="Chorreador CAFCO"
          className="hero-product-image"
          fill
          priority
          sizes="100vw"
          quality={90}
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-eyebrow">{t('hero.eyebrow')}</p>
        <h1 dangerouslySetInnerHTML={{ __html: t.raw('hero.title') }}></h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <div className="hero-ctas">
          <a
            href="#modelos"
            className="btn btn-cta"
            onClick={e => smoothScrollTo('#modelos', e)}
          >
            {t('hero.ctaPrimary')}
          </a>
          <a
            href={`${WA_BASE}?text=Hola%2C%20quiero%20ordenar%20un%20chorreador%20CAFCO`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa btn-lg"
          >
            <WaIcon />
            {' '}
            {t('hero.ctaWa')}
          </a>
        </div>
      </div>
      <a
        href="#modelos"
        className="hero-scroll-arrow"
        aria-label={t('nav.scrollDown')}
        onClick={e => smoothScrollTo('#modelos', e)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
