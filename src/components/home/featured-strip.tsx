'use client'

import { useTranslations } from 'next-intl'

const FEATURES = ['f1', 'f2', 'f3', 'f4'] as const

export function FeaturedStrip() {
  const t = useTranslations('Index')

  return (
    <div className="featured-strip">
      {FEATURES.map(key => (
        <div className="featured-strip-item" key={key}>
          <h3>{t(`features.${key}Title`)}</h3>
          <p>{t(`features.${key}Desc`)}</p>
        </div>
      ))}
    </div>
  )
}
