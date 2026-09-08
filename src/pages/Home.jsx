import { useRef, useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { useLanguage } from '../hooks/useLanguage'
import { images } from '../data/gallery'
import { assetUrl } from '../utils/assetUrl'
import { galleryImageSources } from '../utils/galleryImage'
import './Home.css'

const preview = images.slice(0, 6)

export default function Home() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const localizedServices = [
    {
      title: t('home.services.cortinadosTitle'),
      desc: t('home.services.cortinadosDesc'),
      image: assetUrl('/gallery/cortinados/cortinados1.jpeg')
    },
    {
      title: t('home.services.cabeceirasTitle'),
      desc: t('home.services.cabeceirasDesc'),
      image: assetUrl('/gallery/cabeceiras-de-cama/cabeceiras-de-cama1.jpeg')
    },
    {
      title: t('home.services.papelParedeTitle'),
      desc: t('home.services.papelParedeDesc'),
      image: assetUrl('/gallery/papel-de-parede/papel-de-parede1.jpeg')
    },
    {
      title: t('home.services.estofamentosTitle'),
      desc: t('home.services.estofamentosDesc'),
      image: assetUrl('/gallery/estofamentos/estofamentos1.jpeg')
    },
    {
      title: t('home.services.hotelariaTitle'),
      desc: t('home.services.hotelariaDesc'),
      image: assetUrl('/gallery/hotelaria/hotelaria1.jpeg')
    },
    {
      title: t('home.services.carpintariaTitle'),
      desc: t('home.services.carpintariaDesc'),
      image: assetUrl('/gallery/carpintaria/carpintaria1.jpeg')
    }
  ]

  // Scroll reveal hooks
  const [aboutRef, aboutVisible] = useReveal()
  const [servicesRef, servicesVisible] = useReveal()
  const [previewRef, previewVisible] = useReveal()
  const [ctaRef, ctaVisible] = useReveal()

  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isInternalScrollRef = useRef(false)

  // Compute single set span width (5 items + gaps)
  const getSingleSetWidth = useCallback(() => {
    if (!trackRef.current) return 0
    const track = trackRef.current
    const firstChild = track.children[0]
    const middleChild = track.children[localizedServices.length]
    if (firstChild && middleChild) {
      return middleChild.offsetLeft - firstChild.offsetLeft
    }
    return 0
  }, [localizedServices.length])

  const handleScroll = useCallback(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const singleSetWidth = getSingleSetWidth()

    if (singleSetWidth > 0 && !isInternalScrollRef.current) {
      // If scrolled past the second set into the third set
      if (track.scrollLeft >= singleSetWidth * 2) {
        isInternalScrollRef.current = true
        track.scrollTo({
          left: track.scrollLeft - singleSetWidth,
          behavior: 'instant'
        })
        requestAnimationFrame(() => {
          isInternalScrollRef.current = false
        })
      } else if (track.scrollLeft <= 10) {
        // If scrolled before the middle set into the first set
        isInternalScrollRef.current = true
        track.scrollTo({
          left: track.scrollLeft + singleSetWidth,
          behavior: 'instant'
        })
        requestAnimationFrame(() => {
          isInternalScrollRef.current = false
        })
      }
    }

    // Determine active index for dots (modulo category count)
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
      setActiveIndex(closestIndex % localizedServices.length)
    }
  }, [getSingleSetWidth, localizedServices.length])

  // Initialize scroll position to the middle clone set so it can scroll seamlessly left or right
  useEffect(() => {
    const track = trackRef.current
    if (track) {
      const initScroll = () => {
        const singleSetWidth = getSingleSetWidth()
        if (singleSetWidth > 0 && track.scrollLeft < singleSetWidth - 50) {
          isInternalScrollRef.current = true
          track.scrollTo({
            left: singleSetWidth,
            behavior: 'instant'
          })
          requestAnimationFrame(() => {
            isInternalScrollRef.current = false
          })
        }
        handleScroll()
      }

      // Initial position after render
      const timer = setTimeout(initScroll, 50)

      track.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)

      return () => {
        clearTimeout(timer)
        track.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [getSingleSetWidth, handleScroll])

  const [isPaused, setIsPaused] = useState(false)
  const autoPlayTimerRef = useRef(null)

  const scrollNext = useCallback(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const singleSetWidth = getSingleSetWidth()

    // If near the end of the middle set, snap back by 1 set instantly before smooth scrolling forward
    if (singleSetWidth > 0 && track.scrollLeft >= singleSetWidth * 2 - 10) {
      isInternalScrollRef.current = true
      track.scrollTo({
        left: track.scrollLeft - singleSetWidth,
        behavior: 'instant'
      })
      requestAnimationFrame(() => {
        isInternalScrollRef.current = false
      })
    }

    const cardWidth = track.children[0]?.offsetWidth || track.offsetWidth
    const gap = 24
    track.scrollBy({
      left: cardWidth + gap,
      behavior: 'smooth'
    })
  }, [getSingleSetWidth])

  const resetAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
    if (!isPaused) {
      autoPlayTimerRef.current = setInterval(() => {
        scrollNext()
      }, 2000)
    }
  }, [isPaused, scrollNext])

  const scrollToCard = (index) => {
    if (!trackRef.current) return
    const track = trackRef.current
    // Target the corresponding card in the middle set
    const targetCard = track.children[localizedServices.length + index]
    if (targetCard) {
      track.scrollTo({
        left: targetCard.offsetLeft - track.offsetLeft,
        behavior: 'smooth'
      })
    }
    resetAutoPlay()
  }

  const scrollPrev = useCallback(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const singleSetWidth = getSingleSetWidth()

    // If near the start of the middle set, snap ahead by 1 set instantly before smooth scrolling backwards
    if (singleSetWidth > 0 && track.scrollLeft <= singleSetWidth + 10) {
      isInternalScrollRef.current = true
      track.scrollTo({
        left: track.scrollLeft + singleSetWidth,
        behavior: 'instant'
      })
      requestAnimationFrame(() => {
        isInternalScrollRef.current = false
      })
    }

    const cardWidth = track.children[0]?.offsetWidth || track.offsetWidth
    const gap = 24
    track.scrollBy({
      left: -(cardWidth + gap),
      behavior: 'smooth'
    })
    resetAutoPlay()
  }, [getSingleSetWidth, resetAutoPlay])

  // Smooth continuous auto-play every 2 seconds
  useEffect(() => {
    if (isPaused) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
        autoPlayTimerRef.current = null
      }
      return
    }

    autoPlayTimerRef.current = setInterval(() => {
      scrollNext()
    }, 2000)

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
        autoPlayTimerRef.current = null
      }
    }
  }, [isPaused, scrollNext])

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div
          className="hero__bg"
          style={{ '--hero-image': `url("${assetUrl('/hero.jpeg')}")` }}
          aria-hidden="true"
        />

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
            <a
              href="#contacto"
              className="btn btn--ghost"
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById('contacto')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
                navigate('/#contacto', { replace: true })
              }}
            >
              {t('home.heroBtnContact')}
            </a>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          {/* Real Violets logo revealed with a clipPath animation */}
          <div className="hero__logo-reveal">
            <img src={assetUrl('/logo.svg')} alt="Violets Logo" className="hero__logo-img" />
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
              <a
                href="#contacto"
                className="about__cta"
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById('contacto')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                  navigate('/#contacto', { replace: true })
                }}
              >
                {t('home.aboutCta')} <span>→</span>
              </a>
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
        <div
          className="services__inner"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="section-header services__header">
            <div>
              <span className="section-label">{t('home.servicesLabel')}</span>
              <h2>{t('home.servicesTitlePre')} <em>{t('home.servicesTitleEm')}</em></h2>
            </div>
            <div className="services__carousel-controls">
              <button
                type="button"
                onClick={scrollPrev}
                className="services__carousel-btn"
                aria-label={t('gallery.lightbox.prev')}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="services__carousel-btn"
                aria-label={t('gallery.lightbox.next')}
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
              {[...localizedServices, ...localizedServices, ...localizedServices].map((s, idx) => (
                <div className="service-card" key={`${s.title}-${idx}`}>
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
                  type="button"
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
            {preview.map((img, i) => {
              const source = galleryImageSources(img.src)

              return (
                <div className="preview__item" key={i}>
                  <img
                    {...source}
                    alt={t(`gallery.alts.${img.alt}`)}
                    sizes="(max-width: 960px) 50vw, 33vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )
            })}
          </div>
          <div className="preview__cta">
            <Link to="/galeria" className="btn btn--outline">{t('home.portfolioCta')}</Link>
          </div>
        </div>
      </section>

      {/* Contact Section (Option 3: Cartões em Tríptico Nobre + Showroom) */}
      <section id="contacto" ref={ctaRef} className={`home-contact reveal ${ctaVisible ? 'reveal--visible' : ''}`}>
        <div className="home-contact__inner">
          <div className="home-contact__header">
            <span className="section-label">{t('contact.tag')}</span>
            <h2>{t('contact.titlePre')} <em>{t('contact.titleEm')}</em></h2>
            <p>{t('contact.subtitle')}</p>
          </div>

          <div className="home-contact__triptych">
            {/* Card 1: Atelier */}
            <div className="triptych-card">
              <div className="triptych-card__body">
                <div className="triptych-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3>{t('contact.atelierTitle')}</h3>
                <p>{t('contact.atelierDesc')}</p>
                <div className="triptych-card__details">
                  <span className="location-name">{t('contact.sede')}</span>
                  <span className="location-addr">{t('contact.sedeAddress')}</span>
                  <span className="location-name" style={{ marginTop: '8px' }}>{t('contact.armazem')}</span>
                  <span className="location-addr">{t('contact.armazemAddress')}</span>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Rua+Francisco+Peres+Caniço"
                target="_blank"
                rel="noopener noreferrer"
                className="triptych-card__btn"
              >
                <span>{t('contact.atelierCta')}</span>
              </a>
            </div>

            {/* Card 2: WhatsApp (Featured) */}
            <div className="triptych-card triptych-card--featured">
              <div className="triptych-card__body">
                <div className="triptych-card__icon triptych-card__icon--wa">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
                  </svg>
                </div>
                <h3>{t('contact.waTitle')}</h3>
                <p>{t('contact.waDesc')}</p>
                <div className="triptych-card__details">
                  <span className="direct-number">{t('contact.phoneText')}</span>
                  <span className="location-addr">{t('contact.horarioText')}</span>
                </div>
              </div>
              <a
                href="https://wa.me/351910008669"
                target="_blank"
                rel="noopener noreferrer"
                className="triptych-card__btn triptych-card__btn--wa"
              >
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
                </svg>
                <span>{t('contact.waCta')}</span>
              </a>
            </div>

            {/* Card 3: Email */}
            <div className="triptych-card">
              <div className="triptych-card__body">
                <div className="triptych-card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </div>
                <h3>{t('contact.emailTitle')}</h3>
                <p>{t('contact.emailDesc')}</p>
                <div className="triptych-card__details">
                  <span className="location-name">{t('contact.emailLabel')}</span>
                  <span className="direct-number">{t('contact.emailText')}</span>
                  <span className="location-addr">{t('contact.emailSub')}</span>
                </div>
              </div>
              <a
                href={`mailto:${t('contact.emailText')}?subject=Contacto%20Violets`}
                className="triptych-card__btn"
              >
                <span>{t('contact.emailCta')}</span>
              </a>
            </div>
          </div>

          {/* Google Maps - Sede (Caniço) */}
          <div className="home-contact__map">
            <iframe
              title="Violets Showroom - Sede Caniço"
              src="https://maps.google.com/maps?q=Rua+Francisco+Peres+Canico+Edificio+Freitas&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="home-contact__map-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
