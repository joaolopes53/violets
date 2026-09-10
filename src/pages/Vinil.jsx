import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'
import { assetUrl } from '../utils/assetUrl'
import {
  thicknesses,
  catalogProducts,
  completedWorks,
  woodProducts,
  deckItems
} from '../data/vinil'
import './Vinil.css'

const TAB_IDS = ['vinil', 'obras', 'madeiras', 'deck']

function getValidTab(tabParam) {
  return TAB_IDS.includes(tabParam) ? tabParam : 'vinil'
}

function TechnicalSheetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

export default function Vinil() {
  const { t, language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentTab = getValidTab(searchParams.get('tab'))
  const [selectedThickness, setSelectedThickness] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  const tablistRef = useRef(null)
  const pillsRef = useRef(null)
  const lightboxRef = useRef(null)
  const closeBtnRef = useRef(null)
  const triggerRef = useRef(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useSeo({
    title: language === 'en'
      ? 'Trevo Vinyl SPC & Wood Flooring | Violets — Interior Design Madeira'
      : 'Pavimentos Vinílicos Trevo Vinyl SPC & Madeiras | Violets — Madeira',
    description: language === 'en'
      ? 'Explore Trevo Vinyl SPC rigid core flooring, noble wood finishes and composite decking. Bespoke supply and installation in Madeira.'
      : 'Conheça os pavimentos vinílicos Trevo Vinyl SPC, madeiras nobres e deck compósito. Fornecimento e instalação especializada na Madeira.',
    canonicalPath: '/vinil'
  })

  const setTab = useCallback((newTab) => {
    const nextParams = new URLSearchParams(searchParams)
    if (newTab === 'vinil') {
      nextParams.delete('tab')
    } else {
      nextParams.set('tab', newTab)
    }
    setSearchParams(nextParams, { replace: true })
    setLightboxIndex(null)
  }, [searchParams, setSearchParams])

  const handleHeroExplore = (e) => {
    e.preventDefault()
    if (currentTab !== 'vinil') {
      setTab('vinil')
    }
    const target = document.getElementById('catalogo-vinil')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Keyboard navigation for WAI-ARIA tabs (ArrowLeft, ArrowRight, Home, End)
  const handleTablistKeyDown = (e) => {
    const currentIndex = TAB_IDS.indexOf(currentTab)
    let nextIndex = null

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % TAB_IDS.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + TAB_IDS.length) % TAB_IDS.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = TAB_IDS.length - 1
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const nextTab = TAB_IDS[nextIndex]
      setTab(nextTab)
      const tabButtons = tablistRef.current?.querySelectorAll('[role="tab"]')
      tabButtons?.[nextIndex]?.focus()
    }
  }

  // Keyboard navigation for thickness radiogroup
  const handlePillsKeyDown = (e) => {
    const currentIndex = thicknesses.findIndex(th => th.id === selectedThickness)
    let nextIndex = null

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % thicknesses.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + thicknesses.length) % thicknesses.length
    }

    if (nextIndex !== null) {
      e.preventDefault()
      setSelectedThickness(thicknesses[nextIndex].id)
      const pillButtons = pillsRef.current?.querySelectorAll('[role="radio"]')
      pillButtons?.[nextIndex]?.focus()
    }
  }

  const isFirstTabRender = useRef(true)
  useEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false
      return
    }
    const container = tablistRef.current
    const activeTabEl = container?.querySelector('[role="tab"][aria-selected="true"]')
    if (container && activeTabEl) {
      const targetScroll = activeTabEl.offsetLeft - (container.clientWidth / 2) + (activeTabEl.clientWidth / 2)
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [currentTab])

  const isFirstPillRender = useRef(true)
  useEffect(() => {
    if (isFirstPillRender.current) {
      isFirstPillRender.current = false
      return
    }
    const container = pillsRef.current
    const activePillEl = container?.querySelector('[role="radio"][aria-checked="true"]')
    if (container && activePillEl) {
      const targetScroll = activePillEl.offsetLeft - (container.clientWidth / 2) + (activePillEl.clientWidth / 2)
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [selectedThickness])

  // Filter products by thickness
  const filteredProducts = selectedThickness === 'all'
    ? catalogProducts
    : catalogProducts.filter(p => p.thicknessSlug === selectedThickness)

  // Lightbox handlers
  const openLightbox = (index, e) => {
    triggerRef.current = e?.currentTarget || null
    setLightboxIndex(index)
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const nextLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % completedWorks.length))
  }, [])

  const prevLightbox = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + completedWorks.length) % completedWorks.length))
  }, [])

  // Lock body scroll and set initial focus on open; restore focus on close
  const isLightboxOpen = lightboxIndex !== null
  useEffect(() => {
    if (isLightboxOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      closeBtnRef.current?.focus()
      return () => {
        document.body.style.overflow = prevOverflow
      }
    } else if (triggerRef.current) {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [isLightboxOpen])

  // Lightbox keyboard navigation and modal focus trap
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
      if (e.key === 'ArrowLeft') prevLightbox()

      if (e.key === 'Tab') {
        const focusableElements = Array.from(
          lightboxRef.current?.querySelectorAll('button:not([disabled])') ?? []
        ).filter(el => el.getClientRects().length > 0)

        if (focusableElements.length === 0) return

        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox, nextLightbox, prevLightbox])

  // Touch gesture handling with vertical drift threshold and coordinate cleanup
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
    touchStartY.current = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].screenX - touchStartX.current
    const deltaY = e.changedTouches[0].screenY - touchStartY.current

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) prevLightbox()
      else nextLightbox()
    }
    touchStartX.current = 0
    touchStartY.current = 0
  }

  const handleTouchCancel = () => {
    touchStartX.current = 0
    touchStartY.current = 0
  }

  return (
    <div className="vinil-page">
      {/* Hero Section */}
      <header className="vinil-hero">
        <div className="vinil-hero__inner">
          <span className="vinil-hero__tag">{t('vinil.heroTag')}</span>
          <h1 className="vinil-hero__title">
            {t('vinil.heroTitlePre')} <em>{t('vinil.heroTitleEm')}</em>
          </h1>
          <p className="vinil-hero__desc">
            {t('vinil.heroDesc')}
          </p>

          <div className="vinil-hero__badges">
            <span className="vinil-badge vinil-badge--highlight">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {t('vinil.priceOnDemand')}
            </span>
            <span className="vinil-badge">{t('vinil.partnerBadge')}</span>
          </div>

          <div className="vinil-hero__actions">
            <a
              href="#catalogo-vinil"
              className="vinil-btn vinil-btn--primary"
              onClick={handleHeroExplore}
            >
              {t('vinil.exploreCatalog')}
            </a>
            <Link to="/#contacto" className="vinil-btn vinil-btn--secondary">
              {t('vinil.askQuote')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation ("Separadores") */}
      <div className="vinil-nav-bar" id="catalogo-vinil">
        <div
          ref={tablistRef}
          className="vinil-nav-bar__inner"
          role="tablist"
          aria-label={t('vinil.tabsAriaLabel')}
          onKeyDown={handleTablistKeyDown}
        >
          <button
            type="button"
            role="tab"
            id="vinil-tab-vinil"
            aria-controls="vinil-panel-vinil"
            aria-selected={currentTab === 'vinil'}
            tabIndex={currentTab === 'vinil' ? 0 : -1}
            className={`vinil-tab-btn${currentTab === 'vinil' ? ' active' : ''}`}
            onClick={() => setTab('vinil')}
          >
            {t('vinil.tabs.vinilSpc')}
          </button>
          <button
            type="button"
            role="tab"
            id="vinil-tab-obras"
            aria-controls="vinil-panel-obras"
            aria-selected={currentTab === 'obras'}
            tabIndex={currentTab === 'obras' ? 0 : -1}
            className={`vinil-tab-btn${currentTab === 'obras' ? ' active' : ''}`}
            onClick={() => setTab('obras')}
          >
            {t('vinil.tabs.completedWorks')}
          </button>
          <button
            type="button"
            role="tab"
            id="vinil-tab-madeiras"
            aria-controls="vinil-panel-madeiras"
            aria-selected={currentTab === 'madeiras'}
            tabIndex={currentTab === 'madeiras' ? 0 : -1}
            className={`vinil-tab-btn${currentTab === 'madeiras' ? ' active' : ''}`}
            onClick={() => setTab('madeiras')}
          >
            {t('vinil.tabs.woods')}
          </button>
          <button
            type="button"
            role="tab"
            id="vinil-tab-deck"
            aria-controls="vinil-panel-deck"
            aria-selected={currentTab === 'deck'}
            tabIndex={currentTab === 'deck' ? 0 : -1}
            className={`vinil-tab-btn${currentTab === 'deck' ? ' active' : ''}`}
            onClick={() => setTab('deck')}
          >
            {t('vinil.tabs.deck')}
          </button>
        </div>
      </div>

      <div className="vinil-content-container">
        {/* TAB 1: PAVIMENTO VINILICO SPC */}
        <section
          id="vinil-panel-vinil"
          role="tabpanel"
          aria-labelledby="vinil-tab-vinil"
          tabIndex={0}
          hidden={currentTab !== 'vinil'}
          className="vinil-spc-section"
        >
          {/* SPC Presentation */}
            <div className="vinil-spc-intro">
              <div className="vinil-spc-intro__content">
                <span className="vinil-section-tag">{t('vinil.spcTitle')}</span>
                <h2 id="spc-heading" className="vinil-section-title">
                  {t('vinil.spcSubtitle')}
                </h2>
                <p className="vinil-section-text">{t('vinil.spcDesc1')}</p>
                <p className="vinil-section-text">{t('vinil.spcDesc2')}</p>

                <div className="vinil-price-callout">
                  <div className="vinil-price-callout__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <strong>{t('vinil.priceOnDemand')}</strong>
                    <p>{t('vinil.priceCustomNote')}</p>
                  </div>
                </div>
              </div>

              {/* SPC Features Grid */}
              <div className="vinil-advantages-grid" aria-label={t('vinil.advantagesTitle')}>
                <div className="vinil-adv-card">
                  <div className="vinil-adv-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <h3 className="vinil-adv-card__title">{t('vinil.advWaterTitle')}</h3>
                  <p className="vinil-adv-card__desc">{t('vinil.advWaterDesc')}</p>
                </div>

                <div className="vinil-adv-card">
                  <div className="vinil-adv-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <h3 className="vinil-adv-card__title">{t('vinil.advDurableTitle')}</h3>
                  <p className="vinil-adv-card__desc">{t('vinil.advDurableDesc')}</p>
                </div>

                <div className="vinil-adv-card">
                  <div className="vinil-adv-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </div>
                  <h3 className="vinil-adv-card__title">{t('vinil.advAcousticTitle')}</h3>
                  <p className="vinil-adv-card__desc">{t('vinil.advAcousticDesc')}</p>
                </div>

                <div className="vinil-adv-card">
                  <div className="vinil-adv-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="vinil-adv-card__title">{t('vinil.advClickTitle')}</h3>
                  <p className="vinil-adv-card__desc">{t('vinil.advClickDesc')}</p>
                </div>

                <div className="vinil-adv-card">
                  <div className="vinil-adv-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" />
                      <line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                  </div>
                  <h3 className="vinil-adv-card__title">{t('vinil.advMaintenanceTitle')}</h3>
                  <p className="vinil-adv-card__desc">{t('vinil.advMaintenanceDesc')}</p>
                </div>

                <div className="vinil-adv-card">
                  <div className="vinil-adv-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <h3 className="vinil-adv-card__title">{t('vinil.advDesignTitle')}</h3>
                  <p className="vinil-adv-card__desc">{t('vinil.advDesignDesc')}</p>
                </div>
              </div>
            </div>

            {/* Thickness Filter & Product Grid */}
            <div className="vinil-catalog-wrap">
              <div className="vinil-catalog-header">
                <div>
                  <h2 className="vinil-section-title">
                    {t('vinil.catalogTitlePre')} <em>{t('vinil.catalogTitleEm')}</em>
                  </h2>
                  <p className="vinil-section-text">{t('vinil.catalogSubtitle')}</p>
                </div>

                {/* Sub-filter by thickness with roving tabindex */}
                <div
                  ref={pillsRef}
                  className="vinil-thickness-pills"
                  role="radiogroup"
                  aria-label={t('vinil.thicknessFilter')}
                  onKeyDown={handlePillsKeyDown}
                >
                  {thicknesses.map((th) => {
                    const isChecked = selectedThickness === th.id
                    return (
                      <button
                        key={th.id}
                        type="button"
                        role="radio"
                        aria-checked={isChecked}
                        tabIndex={isChecked ? 0 : -1}
                        className={`vinil-pill-btn${isChecked ? ' active' : ''}`}
                        onClick={() => setSelectedThickness(th.id)}
                      >
                        {th.labelKey ? t(th.labelKey) : th.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Dynamic thickness description */}
              {selectedThickness !== 'all' && t(`vinil.thicknessDescriptions.${selectedThickness}`) && (
                <div className="vinil-thickness-banner">
                  <span className="vinil-thickness-banner__tag">
                    {t('vinil.thicknessPrefix')} {selectedThickness.replace('-', '.')}
                  </span>
                  <p>{t(`vinil.thicknessDescriptions.${selectedThickness}`)}</p>
                </div>
              )}

              {/* Products Grid with empty state fallback */}
              {filteredProducts.length === 0 ? (
                <div className="vinil-empty-state">
                  <p>{t('vinil.emptyFilter')}</p>
                </div>
              ) : (
                <div className="vinil-products-grid">
                  {filteredProducts.map((prod) => (
                    <article key={prod.id} className="vinil-product-card">
                      <div className="vinil-product-card__thumb">
                        {prod.image ? (
                          <img
                            src={assetUrl(prod.image)}
                            alt={`${prod.name} ${prod.thickness}`}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="vinil-product-card__placeholder">
                            <span>{prod.name}</span>
                          </div>
                        )}
                        <span className="vinil-product-card__badge">{prod.thickness}</span>
                      </div>

                      <div className="vinil-product-card__info">
                        <h3 className="vinil-product-card__name">{prod.name}</h3>
                        <div className="vinil-product-card__meta">
                          <span className="vinil-product-card__code">{t('vinil.modelCode')} Trevo SPC</span>
                          <span className="vinil-product-card__price">{t('vinil.priceOnDemand')}</span>
                        </div>

                        <div className="vinil-product-card__footer">
                          {prod.pdfUrl ? (
                            <a
                              href={assetUrl(prod.pdfUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vinil-pdf-btn"
                              aria-label={`${t('vinil.technicalSheet')} (${t('vinil.downloadPdf')}) — ${prod.name} (${prod.thickness})`}
                            >
                              <TechnicalSheetIcon />
                              <span>{t('vinil.technicalSheet')}</span>
                            </a>
                          ) : (
                            <button
                              type="button"
                              className="vinil-pdf-btn vinil-pdf-btn--disabled"
                              disabled
                              aria-label={`${t('vinil.sheetOnDemand')} — ${prod.name} (${prod.thickness})`}
                              title={t('vinil.sheetOnDemand')}
                            >
                              <TechnicalSheetIcon />
                              <span>{t('vinil.technicalSheet')}</span>
                            </button>
                          )}

                          <Link to="/#contacto" className="vinil-quote-link">
                            {t('vinil.requestQuote')}
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* SPC vs WPC Tech Note */}
            <div className="vinil-comparison-box">
              <div className="vinil-comparison-box__inner">
                <span className="vinil-section-tag">{t('vinil.spcVsWpcTitle')}</span>
                <h3 className="vinil-comparison-box__title">{t('vinil.spcVsWpcSubtitle')}</h3>
                <div className="vinil-comparison-grid">
                  <div className="vinil-comparison-col">
                    <span className="vinil-tech-badge">SPC (Stone Plastic Composite)</span>
                    <p>{t('vinil.spcVsWpcDesc1')}</p>
                  </div>
                  <div className="vinil-comparison-col">
                    <span className="vinil-tech-badge">WPC (Wood Plastic Composite)</span>
                    <p>{t('vinil.spcVsWpcDesc2')}</p>
                  </div>
                </div>
                <p className="vinil-comparison-note">{t('vinil.spcVsWpcConsult')}</p>
              </div>
            </div>
          </section>

        {/* TAB 2: TRABALHOS CONCLUÍDOS */}
        <section
          id="vinil-panel-obras"
          role="tabpanel"
          aria-labelledby="vinil-tab-obras"
          tabIndex={0}
          hidden={currentTab !== 'obras'}
          className="vinil-works-section"
        >
            <div className="vinil-works-header">
              <span className="vinil-section-tag">{t('vinil.worksTag')}</span>
              <h2 id="works-heading" className="vinil-section-title">
                {t('vinil.worksTitlePre')} <em>{t('vinil.worksTitleEm')}</em>
              </h2>
              <p className="vinil-section-text">{t('vinil.worksSubtitle')}</p>
              <p className="vinil-works-hint">{t('vinil.worksZoom')}</p>
            </div>

            <div className="vinil-works-grid">
              {completedWorks.map((work, idx) => (
                <button
                  key={work.id}
                  type="button"
                  className="vinil-work-card"
                  onClick={(e) => openLightbox(idx, e)}
                  aria-label={`${language === 'en' ? work.titleEn : work.titlePt} — ${t('vinil.worksZoom')}`}
                >
                  <div className="vinil-work-card__media">
                    <img
                      src={assetUrl(work.image)}
                      alt={language === 'en' ? work.titleEn : work.titlePt}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="vinil-work-card__overlay">
                      <span className="vinil-work-card__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9" />
                          <polyline points="9 21 3 21 3 15" />
                          <line x1="21" y1="3" x2="14" y2="10" />
                          <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                      </span>
                      <span className="vinil-work-card__title">
                        {language === 'en' ? work.titleEn : work.titlePt}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

        {/* TAB 3: MADEIRAS (SOB CONSULTA) */}
        <section
          id="vinil-panel-madeiras"
          role="tabpanel"
          aria-labelledby="vinil-tab-madeiras"
          tabIndex={0}
          hidden={currentTab !== 'madeiras'}
          className="vinil-woods-section"
        >
            <div className="vinil-woods-header">
              <span className="vinil-section-tag">{t('vinil.woodsSectionTag')}</span>
              <h2 id="woods-heading" className="vinil-section-title">
                {t('vinil.woodsTitlePre')} <em>{t('vinil.woodsTitleEm')}</em>
              </h2>
              <p className="vinil-section-text">{t('vinil.woodsSubtitle')}</p>
            </div>

            <div className="vinil-woods-grid">
              {woodProducts.map((wood) => (
                <div key={wood.id} className="vinil-wood-card">
                  <div className="vinil-wood-card__img">
                    <img
                      src={assetUrl(wood.image)}
                      alt={wood.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="vinil-wood-card__body">
                    <h3 className="vinil-wood-card__title">{wood.name}</h3>
                    <span className="vinil-wood-card__badge">{t('vinil.priceOnDemand')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="vinil-woods-cta-box">
              <h3>{t('vinil.woodsTitlePre')} {t('vinil.woodsTitleEm')} — {t('vinil.woodsCustomTitle')}</h3>
              <p>{t('vinil.woodsCustomDesc')}</p>
              <Link to="/#contacto" className="vinil-btn vinil-btn--primary">
                {t('vinil.woodsCta')}
              </Link>
            </div>
          </section>

        {/* TAB 4: DECK COMPÓSITO (SOB CONSULTA) */}
        <section
          id="vinil-panel-deck"
          role="tabpanel"
          aria-labelledby="vinil-tab-deck"
          tabIndex={0}
          hidden={currentTab !== 'deck'}
          className="vinil-deck-section"
        >
            <div className="vinil-deck-header">
              <div className="vinil-badge vinil-badge--highlight">{t('vinil.deckBadge')}</div>
              <h2 id="deck-heading" className="vinil-section-title">
                {t('vinil.deckTitlePre')} <em>{t('vinil.deckTitleEm')}</em>
              </h2>
              <p className="vinil-section-text">{t('vinil.deckSubtitle')}</p>
            </div>

            <div className="vinil-deck-cards">
              {deckItems.map((deck) => (
                <div key={deck.id} className="vinil-deck-card">
                  <div className="vinil-deck-card__content">
                    <span className="vinil-section-tag">{t('vinil.deckTag')}</span>
                    <h3 className="vinil-deck-card__title">{t(deck.titleKey)}</h3>
                    <p className="vinil-deck-card__desc">{t(deck.descKey)}</p>

                    <div className="vinil-deck-features">
                      {(Array.isArray(t(deck.featuresKey)) ? t(deck.featuresKey) : []).map((feat, i) => (
                        <div key={i} className="vinil-deck-feature-item">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="vinil-deck-card__footer">
                      <span className="vinil-badge vinil-badge--highlight">{t('vinil.priceOnDemand')}</span>
                      <Link to="/#contacto" className="vinil-btn vinil-btn--primary">
                        {t('vinil.deckCta')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        {/* FAQ Section */}
        <section className="vinil-faq-section" aria-labelledby="faq-heading">
          <div className="vinil-faq-header">
            <span className="vinil-section-tag">{t('vinil.faqTag')}</span>
            <h2 id="faq-heading" className="vinil-section-title">
              {t('vinil.faqTitlePre')} <em>{t('vinil.faqTitleEm')}</em>
            </h2>
          </div>

          <div className="vinil-faq-list">
            {t('vinil.faqItems').map((item, idx) => {
              const isOpen = openFaq === idx
              const btnId = `faq-btn-${idx}`
              const ansId = `faq-answer-${idx}`
              return (
                <div key={idx} className={`vinil-faq-item${isOpen ? ' open' : ''}`}>
                  <h3 className="vinil-faq-heading">
                    <button
                      type="button"
                      id={btnId}
                      className="vinil-faq-question"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-controls={ansId}
                    >
                      <span>{item.q}</span>
                      <svg className="vinil-faq-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </h3>
                  <div
                    id={ansId}
                    className="vinil-faq-answer"
                    role="region"
                    aria-labelledby={btnId}
                    aria-hidden={!isOpen}
                  >
                    <div className="vinil-faq-answer__inner">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="vinil-cta-banner">
          <div className="vinil-cta-banner__inner">
            <h2 className="vinil-cta-banner__title">{t('vinil.ctaBannerTitle')}</h2>
            <p className="vinil-cta-banner__desc">{t('vinil.ctaBannerText')}</p>
            <div className="vinil-cta-banner__actions">
              <Link to="/#contacto" className="vinil-btn vinil-btn--primary">
                {t('vinil.ctaBannerBtn')}
              </Link>
              <a href="https://wa.me/351910008669" target="_blank" rel="noopener noreferrer" className="vinil-btn vinil-btn--secondary">
                {t('vinil.whatsappDirect')}
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Modal for Completed Works */}
      {lightboxIndex !== null && (
        <div
          ref={lightboxRef}
          className="vinil-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('vinil.lightbox.dialogLabel')}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <div className="vinil-lightbox__backdrop" onClick={closeLightbox} aria-hidden="true" />
          
          <button
            ref={closeBtnRef}
            type="button"
            className="vinil-lightbox__close"
            onClick={closeLightbox}
            aria-label={t('vinil.lightbox.close')}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            type="button"
            className="vinil-lightbox__arrow vinil-lightbox__arrow--prev"
            onClick={prevLightbox}
            aria-label={t('vinil.lightbox.prev')}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="vinil-lightbox__figure">
            <img
              src={assetUrl(completedWorks[lightboxIndex].image)}
              alt={language === 'en' ? completedWorks[lightboxIndex].titleEn : completedWorks[lightboxIndex].titlePt}
              className="vinil-lightbox__img"
            />
            <div className="vinil-lightbox__caption">
              <span>{language === 'en' ? completedWorks[lightboxIndex].titleEn : completedWorks[lightboxIndex].titlePt}</span>
              <span className="vinil-lightbox__counter">{lightboxIndex + 1} / {completedWorks.length}</span>
            </div>
          </div>

          <button
            type="button"
            className="vinil-lightbox__arrow vinil-lightbox__arrow--next"
            onClick={nextLightbox}
            aria-label={t('vinil.lightbox.next')}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
