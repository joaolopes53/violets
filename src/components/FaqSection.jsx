import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { useReveal } from '../hooks/useReveal'
import './FaqSection.css'

export default function FaqSection() {
  const { t, language } = useLanguage()
  const [faqRef, faqVisible] = useReveal()
  const [openIndex, setOpenIndex] = useState(null)

  const faqItems = useMemo(() => {
    const rawItems = t('faq.items')
    return Array.isArray(rawItems) ? rawItems : []
  }, [t])

  // Dynamic injection of FAQPage Schema.org (JSON-LD) for rich snippets / AEO
  useEffect(() => {
    if (!faqItems.length) return

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': 'https://violetsdesign.com/#faq',
      'mainEntity': faqItems.map(item => ({
        '@type': 'Question',
        'name': item.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.a
        }
      }))
    }

    const scriptId = 'faq-jsonld-schema'
    let scriptEl = document.getElementById(scriptId)
    if (!scriptEl) {
      scriptEl = document.createElement('script')
      scriptEl.id = scriptId
      scriptEl.type = 'application/ld+json'
      document.head.appendChild(scriptEl)
    }
    scriptEl.textContent = JSON.stringify(schemaData)

    return () => {
      const el = document.getElementById(scriptId)
      if (el) el.remove()
    }
  }, [faqItems, language])

  const toggleItem = (idx) => {
    setOpenIndex(prev => (prev === idx ? null : idx))
  }

  return (
    <section ref={faqRef} className={`faq-section reveal ${faqVisible ? 'reveal--visible' : ''}`} id="faq" aria-labelledby="faq-title">
      <div className="faq-section__inner">
        <div className="section-header faq-section__header">
          <span className="section-label">{t('faq.tag')}</span>
          <h2 id="faq-title">
            {t('faq.titlePre')} <em>{t('faq.titleEm')}</em>
          </h2>
          <p className="faq-section__subtitle">{t('faq.subtitle')}</p>
        </div>

        <div className="faq-section__list">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`faq-item${isOpen ? ' faq-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                >
                  <span className="faq-item__question-text">{item.q}</span>
                  <span className="faq-item__icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className="faq-item__content"
                  hidden={!isOpen}
                >
                  <p className="faq-item__answer-text">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
