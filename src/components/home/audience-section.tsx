'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { WaIcon } from '@/components/icons/wa-icon'
import { productImages, WA_BASE } from '@/lib/site'

export function AudienceSection() {
  const t = useTranslations('Index')

  return (
    <section className="audience">
      <div className="container">
        <div className="audience-grid">
          <div className="audience-left reveal">
            <h2 dangerouslySetInnerHTML={{ __html: t.raw('audience.title') }}></h2>
            <div className="audience-negatives">
              <p>{t('audience.neg1')}</p>
              <p>{t('audience.neg2')}</p>
              <p>{t('audience.neg3')}</p>
              <p>{t('audience.neg4')}</p>
            </div>
            <ul className="audience-positives">
              <li>{t('audience.pos1')}</li>
              <li>{t('audience.pos2')}</li>
              <li>{t('audience.pos3')}</li>
              <li>{t('audience.pos4')}</li>
              <li>{t('audience.pos5')}</li>
            </ul>
            <div className="audience-cta">
              <p>{t('audience.cta')}</p>
              <a
                href={`${WA_BASE}?text=Hola%2C%20quiero%20ordenar%20mi%20chorreador%20CAFCO`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-sm"
              >
                <WaIcon size={14} />
                {' '}
                {t('audience.ctaBtn')}
              </a>
            </div>
          </div>
          <div className="audience-image reveal reveal-d2">
            <Image
              src={productImages.audienceImg}
              alt="Chorreadores CAFCO A01 y A02 juntos"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
