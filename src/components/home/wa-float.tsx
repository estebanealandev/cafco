'use client'

import { useTranslations } from 'next-intl'
import { WaIcon } from '@/components/icons/wa-icon'
import { WA_BASE } from '@/lib/site'

export function WaFloat() {
  const t = useTranslations('Index')

  return (
    <a
      href={`${WA_BASE}?text=Hola%2C%20quiero%20información%20sobre%20CAFCO`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label={t('footer.whatsapp')}
    >
      <WaIcon size={28} />
    </a>
  )
}
