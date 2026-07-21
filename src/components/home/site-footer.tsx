'use client'

import { useTranslations } from 'next-intl'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  IG_URL,
  LOGO_DARK,
  LOGO_LIGHT,
  WA_BASE,
} from '@/lib/site'
import { smoothScrollTo } from '@/lib/smooth-scroll'

export function SiteFooter() {
  const t = useTranslations('Index')

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="nav-logo">
              <img
                src={LOGO_DARK}
                alt="CAFCO"
                className="nav-logo-img footer-logo-img footer-logo-dark"
              />
              <img
                src={LOGO_LIGHT}
                alt=""
                aria-hidden="true"
                className="nav-logo-img footer-logo-img footer-logo-light"
              />
            </span>
            <p>{t('footer.brandDesc')}</p>
          </div>
          <div className="footer-col">
            <h4>{t('footer.c1t')}</h4>
            <ul>
              <li>
                <a href="#modelos" onClick={e => smoothScrollTo('#modelos', e)}>
                  {t('footer.c1l1')}
                </a>
              </li>
              <li>
                <a href="#modelos" onClick={e => smoothScrollTo('#modelos', e)}>
                  {t('footer.c1l2')}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.c2t')}</h4>
            <ul>
              <li>
                <a href="#nosotros" onClick={e => smoothScrollTo('#nosotros', e)}>
                  {t('footer.c2l1')}
                </a>
              </li>
              <li>
                <a href="#materiales" onClick={e => smoothScrollTo('#materiales', e)}>
                  {t('footer.c2l2')}
                </a>
              </li>
              <li>
                <a href="#preparacion" onClick={e => smoothScrollTo('#preparacion', e)}>
                  {t('footer.c2l3')}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('footer.c3t')}</h4>
            <ul>
              <li>
                <a href={IG_URL} target="_blank" rel="noopener noreferrer">
                  {t('footer.instagram')}
                </a>
              </li>
              <li>
                <a href={WA_BASE} target="_blank" rel="noopener noreferrer">
                  {t('footer.whatsapp')}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <a href={`tel:${CONTACT_PHONE_TEL}`}>{CONTACT_PHONE}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.bott')}</p>
          <div className="footer-payment">
            <span>{t('footer.paySinpe')}</span>
            <span>{t('footer.payTransfer')}</span>
            <span>{t('footer.payCash')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
