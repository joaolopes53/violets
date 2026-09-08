import { useState, useCallback, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { images, categories } from '../data/gallery'
import { assetUrl } from '../utils/assetUrl'
import { galleryImageSources } from '../utils/galleryImage'
import './Galeria.css'

function getValidCategory(value) {
  return categories.some(category => category.id === value) ? value : 'todos'
}

export default function Galeria() {
  const { t, language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [active, setActive] = useState(() => getValidCategory(categoryParam))
  const [lightbox, setLightbox] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  
  const buttonsRef = useRef({})
  const lightboxRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)
  const wasLightboxOpen = useRef(false)
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

  const filtered = active === 'todos' ? images : images.filter(i => i.cat === active)
  const isLightboxOpen = lightbox !== null && Boolean(filtered[lightbox])

  const openLightbox = useCallback((idx, trigger) => {
    triggerRef.current = trigger
    setLightbox(idx)
  }, [])
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])
  const next = useCallback(() => setLightbox(i => (i + 1) % filtered.length), [filtered.length])

  const selectCategory = (categoryId) => {
    const nextCategory = getValidCategory(categoryId)
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextCategory === 'todos') {
      nextSearchParams.delete('category')
    } else {
      nextSearchParams.set('category', nextCategory)
    }

    setActive(nextCategory)
    setLightbox(null)
    setSearchParams(nextSearchParams, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Keep the selected filter in sync with browser navigation and shared URLs.
  useEffect(() => {
    const nextCategory = getValidCategory(categoryParam)
    setActive(current => current === nextCategory ? current : nextCategory)
  }, [categoryParam])

  // Reset lightbox on filter change
  useEffect(() => {
    setLightbox(null)
  }, [active])

  // Background Scroll Locking
  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isLightboxOpen])

  // Move focus into the dialog on open and back to its trigger on close.
  useEffect(() => {
    if (isLightboxOpen) {
      wasLightboxOpen.current = true
      closeButtonRef.current?.focus()
      return
    }

    if (wasLightboxOpen.current) {
      wasLightboxOpen.current = false
      const trigger = triggerRef.current
      triggerRef.current = null

      if (trigger?.isConnected) {
        trigger.focus()
      }
    }
  }, [isLightboxOpen])

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return
    
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()

      if (e.key !== 'Tab') return

      const focusableElements = Array.from(
        lightboxRef.current?.querySelectorAll('button:not([disabled])') ?? []
      ).filter(element => element.getClientRects().length > 0)

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
    
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isLightboxOpen, closeLightbox, prev, next])

  // Slide Indicator logic
  useEffect(() => {
    const updateIndicator = () => {
      const activeBtn = buttonsRef.current[active]
      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth
        })
      }
    }
    
    // Tiny delay to ensure styles and layouts are resolved
    const timer = setTimeout(updateIndicator, 50)
    window.addEventListener('resize', updateIndicator)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [active])

  // Swipe Gestures
  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEnd.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    const diff = touchStart.current - touchEnd.current
    const minSwipeDistance = 50

    if (diff > minSwipeDistance) {
      next()
    } else if (diff < -minSwipeDistance) {
      prev()
    }

    touchStart.current = 0
    touchEnd.current = 0
  }

  return (
    <div className="galeria">
      {/* Editorial Header */}
      <header className="galeria__header">
        <span className="galeria__hero-tag">{t('gallery.heroTag')}</span>
        <h1 className="galeria__hero-title">
          {t('gallery.heroTitlePre')} <em>{t('gallery.heroTitleEm')}</em> {t('gallery.heroTitlePost')}
        </h1>
        <p className="galeria__hero-desc">{t('gallery.heroDesc')}</p>
      </header>

      {/* Filters */}
      <div className="galeria__filters">
        <div className="galeria__filters-inner">
          {categories.map(cat => (
            <button
              type="button"
              key={cat.id}
              ref={el => buttonsRef.current[cat.id] = el}
              className={`filter-btn${active === cat.id ? ' filter-btn--active' : ''}`}
              onClick={() => selectCategory(cat.id)}
            >
              <span className="filter-btn__text">{t(`gallery.categories.${cat.id}`)}</span>
              <span className="filter-btn__count">
                {cat.id === 'todos' ? images.length : images.filter(i => i.cat === cat.id).length}
              </span>
            </button>
          ))}
          <div 
            className="filter-indicator" 
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`
            }}
          />
        </div>
      </div>

      {/* Organic Masonry Grid (Preserving Natural Proportions) */}
      <div className="galeria__wrap">
        <div className="masonry">
          {filtered.map((img, idx) => {
            const source = galleryImageSources(img.src)

            return (
              <button
                type="button"
                className="masonry__item"
                key={img.src}
                onClick={event => openLightbox(idx, event.currentTarget)}
                aria-label={language === 'pt' ? `Ver imagem: ${img.alt}` : `View image: ${t(`gallery.alts.${img.alt}`)}`}
              >
                <div className="masonry__img-box">
                  <img
                    {...source}
                    alt={t(`gallery.alts.${img.alt}`)}
                    sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="masonry__overlay" aria-hidden="true">
                    <span className="masonry__zoom-icon">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          ref={lightboxRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={closeLightbox}
        >
          <h2 id="lightbox-title" className="visually-hidden">
            {t(`gallery.alts.${filtered[lightbox].alt}`)}
          </h2>
          <div className="lightbox__header" onClick={e => e.stopPropagation()}>
            <span className="lightbox__counter">
              {String(lightbox + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              ref={closeButtonRef}
              className="lightbox__close"
              onClick={closeLightbox}
              aria-label={t('gallery.lightbox.close')}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <button type="button" className="lightbox__prev" onClick={e => { e.stopPropagation(); prev() }} aria-label={t('gallery.lightbox.prev')}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div 
            className="lightbox__img-wrap" 
            key={lightbox}
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img src={assetUrl(filtered[lightbox].src)} alt={t(`gallery.alts.${filtered[lightbox].alt}`)} />
            <div className="lightbox__info-panel">
              <span className="lightbox__cat-badge">
                {t(`gallery.categories.${filtered[lightbox].cat}`)} · Madeira
              </span>
            </div>
          </div>

          <button type="button" className="lightbox__next" onClick={e => { e.stopPropagation(); next() }} aria-label={t('gallery.lightbox.next')}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
