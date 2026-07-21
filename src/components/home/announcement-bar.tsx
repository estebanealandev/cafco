'use client'

import { useTranslations } from 'next-intl'
import { IG_URL, WA_BASE } from '@/lib/site'

export function AnnouncementBar() {
  const t = useTranslations('Index')
  const [left, right] = t('announcement').split('·').map(s => s.trim())

  return (
    <div className="announcement">
      <div className="announcement-track">
        {Array.from({ length: 4 }).fill(null).map((_, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <span key={`ann-item-${i}`} className="announcement-item">
            {left}
            <span className="announcement-dot">•</span>
            {right}
            &nbsp;
            <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
              {t('announcementWa')}
            </a>
            &nbsp;
            {t('announcementAnd')}
            &nbsp;
            <a href={IG_URL} target="_blank" rel="noopener noreferrer">
              {t('announcementIg')}
            </a>
            <span className="announcement-dot">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
