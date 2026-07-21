'use client'

import { useTranslations } from 'next-intl'

const STEPS = ['s1', 's2', 's3', 's4'] as const

export function BrewSection() {
  const t = useTranslations('Index')

  return (
    <section className="brew-guide container" id="preparacion">
      <div className="catalog-header reveal">
        <h2>{t('brew.title')}</h2>
        <p>{t('brew.desc')}</p>
      </div>
      <div className="brew-steps">
        {STEPS.map((step, i) => (
          <div
            className={`brew-step reveal${i < 3 ? ` reveal-d${i + 1}` : ''}`}
            key={step}
          >
            <h3>{t(`brew.${step}`)}</h3>
            <p>{t(`brew.${step}d`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
