'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { productImages } from '@/lib/site'

export function StorySection() {
  const t = useTranslations('Index')

  return (
    <section className="story container" id="nosotros">
      <div className="story-grid">
        <div className="story-image reveal">
          <Image
            src={productImages.storyImg}
            alt="Detalle de textura del concreto CAFCO"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
          />
        </div>
        <div className="story-content reveal reveal-d2">
          <p className="eyebrow">{t('story.eyebrow')}</p>
          <h2 dangerouslySetInnerHTML={{ __html: t.raw('story.title') }}></h2>
          <p>{t('story.p1')}</p>
          <p>{t('story.p2')}</p>
          <div className="story-values">
            <div className="story-value">
              <div className="number">{t('story.v1n')}</div>
              <label>{t('story.v1l')}</label>
            </div>
            <div className="story-value">
              <div className="number">{t('story.v2n')}</div>
              <label>{t('story.v2l')}</label>
            </div>
            <div className="story-value">
              <div className="number">{t('story.v3n')}</div>
              <label>{t('story.v3l')}</label>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
