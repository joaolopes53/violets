import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../hooks/useLanguage'
import { images } from '../data/gallery'
import './Home.css'

const preview = images.slice(0, 6)

export default function Home() {
  const { t } = useLanguage()

  const localizedServices = [
    {
      title: t('home.services.cozinhasTitle'),
      desc: t('home.services.cozinhasDesc'),
      image: '/gallery/cozinhas/COZINHA 1.jpeg'
    },
    {
      title: t('home.services.designTitle'),
      desc: t('home.services.designDesc'),
      image: '/gallery/design/103514716_1596011003908635_5885864849083847190_n.jpg'
    },
    {
      title: t('home.services.portasTitle'),
      desc: t('home.services.portasDesc'),
      image: '/gallery/portas/1.jpeg'
    },
    {
      title: t('home.services.escadariasTitle'),
      desc: t('home.services.escadariasDesc'),
      image: '/gallery/escadarias/3.jpeg'
    },
    {
      title: t('home.services.vinilTitle'),
      desc: t('home.services.vinilDesc'),
      image: '/gallery/vinil/2.jpeg'
    },
    {
      title: t('home.services.roupeirosTitle'),
      desc: t('home.services.roupeirosDesc'),
      image: '/gallery/roupeiros/2.jpeg'
    }
  ]

  // Scroll reveal hooks
  const [aboutRef, aboutVisible] = useReveal()
  const [servicesRef, servicesVisible] = useReveal()
  const [previewRef, previewVisible] = useReveal()
  const [ctaRef, ctaVisible] = useReveal()

  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const handleScroll = () => {
    if (!trackRef.current) return
    const track = trackRef.current

    // Update active dot index
    const children = track.children
    if (children.length > 0) {
      let closestIndex = 0
      let minDiff = Infinity
      const trackLeft = track.getBoundingClientRect().left

      for (let i = 0; i < children.length; i++) {
        const childLeft = children[i].getBoundingClientRect().left
        const diff = Math.abs(childLeft - trackLeft)
        if (diff < minDiff) {
          minDiff = diff
          closestIndex = i
        }
      }
      setActiveIndex(closestIndex)
    }

    // Update boundary states
    setIsAtStart(track.scrollLeft <= 5)
    setIsAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 5)
  }

  useEffect(() => {
    const track = trackRef.current
    if (track) {
      track.addEventListener('scroll', handleScroll, { passive: true })
      // Initial check
      handleScroll()

      // Re-run on resize
      window.addEventListener('resize', handleScroll)

      return () => {
        track.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [])

  const scrollToCard = (index) => {
    if (!trackRef.current) return
    const track = trackRef.current
    const child = track.children[index]
    if (child) {
      track.scrollTo({
        left: child.offsetLeft - track.offsetLeft,
        behavior: 'smooth'
      })
    }
  }

  const scrollPrev = () => {
    if (!trackRef.current) return
    const track = trackRef.current
    const cardWidth = track.children[0]?.offsetWidth || track.offsetWidth
    const gap = 24
    track.scrollBy({
      left: -(cardWidth + gap),
      behavior: 'smooth'
    })
  }

  const scrollNext = () => {
    if (!trackRef.current) return
    const track = trackRef.current
    const cardWidth = track.children[0]?.offsetWidth || track.offsetWidth
    const gap = 24
    track.scrollBy({
      left: cardWidth + gap,
      behavior: 'smooth'
    })
  }

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />

        <div className="hero__content">
          <h1 className="hero__title">
            {t('home.heroTitlePre')}<br />
            <em>{t('home.heroTitleEm')}</em>
          </h1>
          <p className="hero__desc">
            {t('home.heroDesc')}
          </p>
          <div className="hero__actions">
            <Link to="/galeria" className="btn btn--primary">{t('home.heroBtnProjects')}</Link>
            <Link to="/contacto" className="btn btn--ghost">{t('home.heroBtnContact')}</Link>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          {/* Real Violets logo revealed with a clipPath animation */}
          <div className="hero__logo-reveal">
            <img src="/logo.svg" alt="Violets Logo" className="hero__logo-img" />
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className={`about reveal ${aboutVisible ? 'reveal--visible' : ''}`}>
        <div className="about__inner">
          <div className="about__label">{t('home.aboutLabel')}</div>
          <div className="about__grid">
            <div className="about__text">
              <h2>{t('home.aboutTitlePre')}<br /><em>{t('home.aboutTitleEm')}</em></h2>
              <p>
                {t('home.aboutP1')}
              </p>
              <p>
                {t('home.aboutP2')}
              </p>
              <Link to="/contacto" className="about__cta">
                {t('home.aboutCta')} <span>→</span>
              </Link>
            </div>
            <div className="about__stats">
              <div className="stat">
                <span className="stat__num">{t('home.statExpNum')}</span>
                <span className="stat__label">{t('home.statExpLabel')}</span>
              </div>
              <div className="stat">
                <span className="stat__num">{t('home.statProjNum')}</span>
                <span className="stat__label">{t('home.statProjLabel')}</span>
              </div>
              <div className="stat">
                <span className="stat__num">{t('home.statSatNum')}</span>
                <span className="stat__label">{t('home.statSatLabel')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section ref={servicesRef} className={`services reveal ${servicesVisible ? 'reveal--visible' : ''}`}>
        <div className="services__inner">
          <div className="section-header services__header">
            <div>
              <span className="section-label">{t('home.servicesLabel')}</span>
              <h2>{t('home.servicesTitlePre')} <em>{t('home.servicesTitleEm')}</em></h2>
            </div>
            <div className="services__carousel-controls">
              <button
                onClick={scrollPrev}
                className="services__carousel-btn"
                aria-label={t('gallery.lightbox.prev')}
                disabled={isAtStart}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="services__carousel-btn"
                aria-label={t('gallery.lightbox.next')}
                disabled={isAtEnd}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div className="services__carousel">
            <div ref={trackRef} className="services__carousel-track">
              {localizedServices.map(s => (
                <div className="service-card" key={s.title}>
                  <div className="service-card__img-wrap">
                    <img src={s.image} alt={s.title} className="service-card__img" loading="lazy" />
                  </div>
                  <div className="service-card__body">
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="services__carousel-dots">
              {localizedServices.map((_, idx) => (
                <button
                  key={idx}
                  className={`services__carousel-dot ${idx === activeIndex ? 'services__carousel-dot--active' : ''}`}
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section ref={previewRef} className={`preview reveal ${previewVisible ? 'reveal--visible' : ''}`}>
        <div className="preview__inner">
          <div className="section-header">
            <span className="section-label">{t('home.portfolioLabel')}</span>
            <h2>{t('home.portfolioTitlePre')} <em>{t('home.portfolioTitleEm')}</em></h2>
          </div>
          <div className="preview__grid">
            {preview.map((img, i) => (
              <div className="preview__item" key={i}>
                <img src={img.src} alt={t(`gallery.alts.${img.alt}`)} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="preview__cta">
            <Link to="/galeria" className="btn btn--outline">{t('home.portfolioCta')}</Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section ref={ctaRef} className={`cta-banner reveal ${ctaVisible ? 'reveal--visible' : ''}`}>
        <div className="cta-banner__inner">
          <h2>{t('home.ctaTitlePre')}<br /><em>{t('home.ctaTitleEm')}</em></h2>
          <p>{t('home.ctaDesc')}</p>
          <Link to="/contacto" className="btn btn--primary">{t('home.ctaBtn')}</Link>
        </div>
      </section>
    </div>
  )
}
