'use client'

import { useTranslations } from 'next-intl'

export function TestimonialsSection() {
  const t = useTranslations('Index')

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonial-inner reveal">
          <blockquote className="testimonial-quote">
            {t('testimonials.q1')}
          </blockquote>
          <p className="testimonial-author">{t('testimonials.a1')}</p>
        </div>
      </div>
    </section>
  )
}
