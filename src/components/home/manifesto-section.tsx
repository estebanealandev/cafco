'use client'

import { useTranslations } from 'next-intl'

export function ManifestoSection() {
  const t = useTranslations('Index')

  return (
    <section className="manifesto">
      <div className="container">
        <div className="manifesto-inner reveal">
          <h2 dangerouslySetInnerHTML={{ __html: t.raw('manifesto') }}></h2>
        </div>
      </div>
    </section>
  )
}
