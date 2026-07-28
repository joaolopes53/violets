import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { categories, galleryItems } from '../data/gallery'
import './Galeria.css'

export default function Galeria() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('todos')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const filterButtonsRef = useRef({})
  const lightboxCloseRef = useRef(null)
  const previousTriggerRef = useRef(null)
  const previousOverflowRef = useRef('')
  const lightboxOpenRef = useRef(false)
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

  const filteredItems = activeCategory === 'todos'
    ? galleryItems
    : galleryItems.filter(item => item.cat === activeCategory)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const previousImage = useCallback(() => {
    setLightboxIndex(index => (index - 1 + filteredItems.length) % filteredItems.length)
  }, [filteredItems.length])
  const nextImage = useCallback(() => {
    setLightboxIndex(index => (index + 1) % filteredItems.length)
  }, [filteredItems.length])

  const openLightbox = index => {
    previousTriggerRef.current = document.activeElement
    setLightboxIndex(index)
  }

  useEffect(() => {
    if (lightboxIndex !== null) {
      if (!lightboxOpenRef.current) {
        previousOverflowRef.current = document.body.style.overflow
        lightboxOpenRef.current = true
        window.requestAnimationFrame(() => lightboxCloseRef.current?.focus())
      }
      document.body.style.overflow = 'hidden'
      return undefined
    }

    if (lightboxOpenRef.current) {
      document.body.style.overflow = previousOverflowRef.current
      lightboxOpenRef.current = false
      previousTriggerRef.current?.focus?.()
      previousTriggerRef.current = null
    }
    return undefined
  }, [lightboxIndex])

  useEffect(() => {
    return () => {
      if (lightboxOpenRef.current) {
        document.body.style.overflow = previousOverflowRef.current
        previousTriggerRef.current?.focus?.()
      }
    }
  }, [])

  useEffect(() => {
    if (lightboxIndex === null) return undefined

    const onKeyDown = event => {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') previousImage()
      if (event.key === 'ArrowRight') nextImage()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, closeLightbox, previousImage, nextImage])

  useEffect(() => {
    setLightboxIndex(null)
  }, [activeCategory])

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = filterButtonsRef.current[activeCategory]
      if (!activeButton) return

      setIndicatorStyle({ left: activeButton.offsetLeft, width: activeButton.offsetWidth })
    }

    const frame = window.requestAnimationFrame(updateIndicator)
    window.addEventListener('resize', updateIndicator)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeCategory])

  const handleTouchStart = event => {
    touchStart.current = event.targetTouches[0].clientX
    touchEnd.current = touchStart.current
  }

  const handleTouchMove = event => {
    touchEnd.current = event.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    const distance = touchStart.current - touchEnd.current
    if (Math.abs(distance) > 50) {
      if (distance > 0) nextImage()
      else previousImage()
    }
    touchStart.current = 0
    touchEnd.current = 0
  }

  return (
    <div className="gallery-page">
      <header className="gallery-page__header">
        <div className="container">
          <span className="eyebrow">V / 03</span>
          <h1>{t('gallery.headerTitlePre')} <em>{t('gallery.headerTitleEm')}</em></h1>
          <p>{t('home.projectsNote')}</p>
        </div>
      </header>

      <nav className="gallery-filters" aria-label={t('gallery.filterLabel')}>
        <div className="gallery-filters__inner container">
          {categories.map(category => {
            const count = category.id === 'todos'
              ? galleryItems.length
              : galleryItems.filter(item => item.cat === category.id).length
            const isActive = activeCategory === category.id

            return (
              <button
                type="button"
                key={category.id}
                ref={element => { filterButtonsRef.current[category.id] = element }}
                className={isActive ? 'is-active' : ''}
                aria-pressed={isActive}
                onClick={() => {
                  setActiveCategory(category.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <span>{t(`gallery.categories.${category.id}`)}</span>
                <small>{String(count).padStart(2, '0')}</small>
              </button>
            )
          })}
          <span className="gallery-filters__indicator" style={{ left: indicatorStyle.left, width: indicatorStyle.width }} aria-hidden="true" />
        </div>
      </nav>

      <main className="gallery-grid container" aria-live="polite">
        {filteredItems.map((item, index) => (
          <button
            type="button"
            className="gallery-grid__item"
            key={item.id}
            onClick={() => openLightbox(index)}
            aria-label={`${t('gallery.lightbox.viewImage')}: ${t(`gallery.alts.${item.alt}`)}`}
          >
            <span className="gallery-grid__image">
              <img src={item.src} alt={t(`gallery.alts.${item.alt}`)} loading="lazy" />
              <span className="gallery-grid__index">{String(index + 1).padStart(2, '0')}</span>
            </span>
            <span className="gallery-grid__meta">
              <span>{t(`gallery.categories.${item.cat}`)}</span>
              <strong>{t(`gallery.alts.${item.alt}`)}</strong>
              <i aria-hidden="true">↗</i>
            </span>
          </button>
        ))}
      </main>

      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t('gallery.lightbox.label')} onClick={closeLightbox}>
          <div className="lightbox__topline" onClick={event => event.stopPropagation()}>
            <span>{String(lightboxIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}</span>
            <button ref={lightboxCloseRef} type="button" onClick={closeLightbox} aria-label={t('gallery.lightbox.close')}>×</button>
          </div>

          <button type="button" className="lightbox__previous" onClick={event => { event.stopPropagation(); previousImage() }} aria-label={t('gallery.lightbox.prev')}>←</button>

          <figure
            className="lightbox__figure"
            onClick={event => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img src={filteredItems[lightboxIndex].src} alt={t(`gallery.alts.${filteredItems[lightboxIndex].alt}`)} />
            <figcaption>
              <span>{t(`gallery.categories.${filteredItems[lightboxIndex].cat}`)}</span>
              <strong>{t(`gallery.alts.${filteredItems[lightboxIndex].alt}`)}</strong>
            </figcaption>
          </figure>

          <button type="button" className="lightbox__next" onClick={event => { event.stopPropagation(); nextImage() }} aria-label={t('gallery.lightbox.next')}>→</button>
        </div>
      )}
    </div>
  )
}
