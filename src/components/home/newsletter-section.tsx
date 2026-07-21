'use client'

import { useTranslations } from 'next-intl'

export function NewsletterSection() {
  const t = useTranslations('Index')

  return (
    <section className="newsletter">
      <div className="container reveal">
        <h2>{t('newsletter.title')}</h2>
        <p>{t('newsletter.desc')}</p>
        <form
          className="newsletter-form"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <label className="sr-only" htmlFor="newsletter-email">
            {t('newsletter.placeholder')}
          </label>
          <input
            id="newsletter-email"
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t('newsletter.placeholder')}
            required
          />
          <button type="submit" className="btn btn-primary">
            {t('newsletter.btn')}
          </button>
        </form>
      </div>
    </section>
  )
}
