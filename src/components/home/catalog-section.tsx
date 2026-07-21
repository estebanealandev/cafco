'use client'

import type { TabKey } from '@/lib/site'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'
import { WaIcon } from '@/components/icons/wa-icon'
import { useReveal } from '@/hooks/use-reveal'
import { allProducts, WA_BASE } from '@/lib/site'

export function CatalogSection() {
  const t = useTranslations('Index')
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  useReveal([activeTab])

  const visibleProducts
    = activeTab === 'all'
      ? allProducts
      : allProducts.filter(p => p.model === activeTab)

  return (
    <section className="catalog container" id="modelos">
      <div className="catalog-header reveal">
        <h2>{t('catalog.title')}</h2>
        <p>{t('catalog.desc')}</p>
      </div>
      <div className="catalog-tabs reveal" role="tablist" aria-label={t('catalog.title')}>
        {(['all', 'a01', 'a02'] as TabKey[]).map(tab => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`catalog-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all'
              ? t('catalog.tabAll')
              : tab === 'a01'
                ? t('catalog.tabA01')
                : t('catalog.tabA02')}
          </button>
        ))}
      </div>

      {visibleProducts.map((product, i) => {
        const p = t.raw(`products.${product.key}`) as Record<string, string>
        return (
          <div
            className="product-card reveal"
            key={product.key}
            data-model={product.model}
          >
            <div className="product-card-gallery">
              <Image
                src={product.img}
                alt={`CAFCO ${product.key}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {p.badge && <span className="product-badge">{p.badge}</span>}
            </div>
            <div className="product-card-info">
              <p className="product-eyebrow">{p.eyebrow}</p>
              <h3 dangerouslySetInnerHTML={{ __html: p.name }}></h3>
              <p className="product-card-tagline">{p.tagline}</p>
              <p className="product-card-desc">{p.desc}</p>
              <div className="product-includes">
                <h4>{p.includesTitle}</h4>
                <ul>
                  <li>{p.include1}</li>
                  <li>{p.include2}</li>
                  <li>{p.include3}</li>
                </ul>
              </div>
              <div className="product-price-row">
                <span className="product-price">{p.price}</span>
                <span className="product-price-note">{p.priceNote}</span>
              </div>
              <div className="product-card-actions">
                <a
                  href={`${WA_BASE}?text=${product.waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa btn-sm"
                >
                  <WaIcon size={14} />
                  {' '}
                  {p.cta}
                </a>
              </div>
            </div>
          </div>
        )
      })}

      <div className="compare reveal">
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              <th>{t('compare.hA01v60')}</th>
              <th>{t('compare.hA01bag')}</th>
              <th>{t('compare.hA02v60')}</th>
              <th>{t('compare.hA02bag')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('compare.scale')}</td>
              <td>{t('compare.sharing')}</td>
              <td>{t('compare.sharing')}</td>
              <td>{t('compare.personal')}</td>
              <td>{t('compare.personal')}</td>
            </tr>
            <tr>
              <td>{t('compare.weight')}</td>
              <td>{t('compare.weightA01')}</td>
              <td>{t('compare.weightA01')}</td>
              <td>{t('compare.weightA02')}</td>
              <td>{t('compare.weightA02')}</td>
            </tr>
            <tr>
              <td>{t('compare.wood')}</td>
              <td>{t('compare.teca')}</td>
              <td>{t('compare.teca')}</td>
              <td>{t('compare.teca')}</td>
              <td>{t('compare.teca')}</td>
            </tr>
            <tr>
              <td>{t('compare.filter')}</td>
              <td>{t('compare.dripperV60')}</td>
              <td>{t('compare.clothBag')}</td>
              <td>{t('compare.dripperV60')}</td>
              <td>{t('compare.clothBag')}</td>
            </tr>
            <tr>
              <td>{t('compare.price')}</td>
              <td className="price-cell">{t('compare.priceA01v60')}</td>
              <td className="price-cell">{t('compare.priceA01bag')}</td>
              <td className="price-cell">{t('compare.priceA02v60')}</td>
              <td className="price-cell">{t('compare.priceA02bag')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
