'use client'

import { useTranslations } from 'next-intl'

export function MaterialsSection() {
  const t = useTranslations('Index')

  return (
    <section className="materials" id="materiales">
      <div className="container">
        <div className="catalog-header reveal">
          <h2>{t('materials.title')}</h2>
          <p>{t('materials.desc')}</p>
        </div>
        <div className="materials-grid">
          <div className="material-card reveal reveal-d1">
            <svg className="material-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="8" y="12" width="32" height="28" rx="1" />
              <path d="M14 20h20M14 28h14M14 36h8" opacity="0.6" />
            </svg>
            <h3>{t('materials.m1')}</h3>
            <p>{t('materials.m1d')}</p>
          </div>
          <div className="material-card reveal reveal-d2">
            <svg className="material-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M24 4v40M16 8c4 4 12 4 16 0M12 16c6 4 18 4 24 0M10 24c7 4 21 4 28 0M12 32c6 4 18 4 24 0M16 40c4 4 12 4 16 0" />
            </svg>
            <h3>{t('materials.m2')}</h3>
            <p>{t('materials.m2d')}</p>
          </div>
          <div className="material-card reveal reveal-d3">
            <svg className="material-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 8l24 0M8 8c0 20 8 32 16 36C32 40 40 28 40 8" />
              <path d="M16 16c0 12 4 20 8 24 4-4 8-12 8-24" opacity="0.5" />
            </svg>
            <h3>{t('materials.m3')}</h3>
            <p>{t('materials.m3d')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
