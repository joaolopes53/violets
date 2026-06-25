import { useState, useCallback, useRef, useEffect } from 'react'
import { images, categories } from '../data/gallery'
import './Galeria.css'

export default function Galeria() {
  const [active, setActive] = useState('todos')
  const [lightbox, setLightbox] = useState(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  
  const buttonsRef = useRef({})
  const touchStart = useRef(0)
  const touchEnd = useRef(0)

  const filtered = active === 'todos' ? images : images.filter(i => i.cat === active)

  const openLightbox = useCallback((idx) => setLightbox(idx), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox(i => (i - 1 + filtered.length) % filtered.length), [filtered.length])
  const next = useCallback(() => setLightbox(i => (i + 1) % filtered.length), [filtered.length])

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }, [closeLightbox, prev, next])

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
    <div className="galeria" onKeyDown={handleKey} tabIndex={-1}>
      {/* Header */}
      <div className="galeria__header">
        <div className="galeria__header-inner">
          <span className="section-label">Portfólio</span>
          <h1>O nosso <em>trabalho</em></h1>
          <p>Cada projeto conta uma história. Descubra os espaços que transformámos.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="galeria__filters">
        <div className="galeria__filters-inner">
          {categories.map(cat => (
            <button
              key={cat.id}
              ref={el => buttonsRef.current[cat.id] = el}
              className={`filter-btn${active === cat.id ? ' filter-btn--active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
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

      {/* Masonry Grid */}
      <div className="galeria__wrap">
        <div className="masonry">
          {filtered.map((img, idx) => (
            <div
              className="masonry__item"
              key={img.src}
              onClick={() => openLightbox(idx)}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="masonry__overlay">
                <span className="masonry__zoom">&#x2B;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="Fechar">✕</button>
          <button className="lightbox__prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Anterior">‹</button>
          <div 
            className="lightbox__img-wrap" 
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img src={filtered[lightbox].src} alt={filtered[lightbox].alt} />
            <p className="lightbox__caption">{filtered[lightbox].alt}</p>
          </div>
          <button className="lightbox__next" onClick={e => { e.stopPropagation(); next() }} aria-label="Próximo">›</button>
        </div>
      )}
    </div>
  )
}
