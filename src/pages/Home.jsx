import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useReveal } from '../hooks/useReveal'
import { featuredGalleryItems } from '../data/gallery'
import { services as serviceCatalog } from '../data/services'
import './Home.css'

const heroImage = '/gallery/cozinhas/COZINHA 4.jpeg'

export default function Home() {
  const { t } = useLanguage()
  const [introRef, introVisible] = useReveal()
  const [servicesRef, servicesVisible] = useReveal()
  const [projectsRef, projectsVisible] = useReveal()
  const [closingRef, closingVisible] = useReveal()
  const servicesTrackRef = useRef(null)
  const [activeService, setActiveService] = useState(0)

  const localizedServices = serviceCatalog.map(service => ({
    ...service,
    title: t(service.titleKey),
    description: t(service.descriptionKey),
  }))

  useEffect(() => {
    const track = servicesTrackRef.current
    if (!track) return

    const updateActiveService = () => {
      const firstCard = track.children[0]
      if (!firstCard) return

      const step = firstCard.getBoundingClientRect().width + 20
      setActiveService(Math.min(
        localizedServices.length - 1,
        Math.max(0, Math.round(track.scrollLeft / step)),
      ))
    }

    track.addEventListener('scroll', updateActiveService, { passive: true })
    window.addEventListener('resize', updateActiveService)
    updateActiveService()

    return () => {
      track.removeEventListener('scroll', updateActiveService)
      window.removeEventListener('resize', updateActiveService)
    }
  }, [localizedServices.length])

  const scrollServices = direction => {
    const track = servicesTrackRef.current
    const card = track?.children[0]
    if (!track || !card) return

    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + 20),
      behavior: 'smooth',
    })
  }

  const scrollToService = index => {
    const track = servicesTrackRef.current
    const card = track?.children[index]
    if (!track || !card) return

    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
  }

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__inner container">
          <div className="home-hero__copy">
            <div className="home-hero__topline">
              <span className="eyebrow">{t('home.heroKicker')}</span>
              <span className="home-hero__code">V / 01</span>
            </div>

            <h1 id="home-hero-title" className="home-hero__title">
              <span>{t('home.heroTitlePre')}</span>
              <em>{t('home.heroTitleEm')}</em>
            </h1>

            <p className="home-hero__desc">{t('home.heroDesc')}</p>

            <div className="home-hero__actions">
              <Link to="/galeria" className="btn btn--primary">
                {t('home.heroBtnProjects')} <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/contacto" className="btn btn--ghost">
                {t('home.heroBtnContact')}
              </Link>
            </div>

            <div className="home-hero__meta" aria-label={t('home.heroKicker')}>
              <span>{t('home.heroLocation')}</span>
              <span>2011 — 2026</span>
            </div>
          </div>

          <figure className="home-hero__figure">
            <img src={heroImage} alt={t('gallery.alts.Cozinha personalizada')} />
            <figcaption>
              <span>{t('gallery.categories.cozinhas')}</span>
              <span>{t('gallery.alts.Cozinha personalizada')}</span>
            </figcaption>
          </figure>
        </div>

        <div className="home-hero__foot container">
          <span className="home-hero__scroll"><i aria-hidden="true" />{t('home.heroScroll')}</span>
          <span className="home-hero__index">{t('home.heroIndex')}</span>
        </div>
      </section>

      <section
        ref={introRef}
        className={`home-intro reveal${introVisible ? ' reveal--visible' : ''}`}
        aria-labelledby="home-intro-title"
      >
        <div className="container">
          <div className="home-intro__label">
            <span className="eyebrow eyebrow--light">{t('home.aboutLabel')}</span>
            <span className="home-intro__stamp">STUDIO / MADEIRA</span>
          </div>
          <div className="home-intro__grid">
            <h2 id="home-intro-title">{t('home.aboutTitlePre')} <em>{t('home.aboutTitleEm')}</em></h2>
            <div className="home-intro__body">
              <p>{t('home.aboutP1')}</p>
              <p>{t('home.aboutP2')}</p>
              <Link to="/contacto" className="text-link">
                {t('home.aboutCta')} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="home-intro__stats">
            <div><strong>{t('home.statExpNum')}</strong><span>{t('home.statExpLabel')}</span></div>
            <div><strong>{t('home.statProjNum')}</strong><span>{t('home.statProjLabel')}</span></div>
            <div><strong>{t('home.statSatNum')}</strong><span>{t('home.statSatLabel')}</span></div>
          </div>
        </div>
      </section>

      <section
        ref={servicesRef}
        className={`home-services reveal${servicesVisible ? ' reveal--visible' : ''}`}
        aria-labelledby="home-services-title"
      >
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">{t('home.servicesLabel')}</span>
              <h2 id="home-services-title">{t('home.servicesTitlePre')} <em>{t('home.servicesTitleEm')}</em></h2>
            </div>
            <div className="carousel-controls" aria-label={t('home.servicesLabel')}>
              <button type="button" onClick={() => scrollServices(-1)} aria-label={t('gallery.lightbox.prev')}>
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" onClick={() => scrollServices(1)} aria-label={t('gallery.lightbox.next')}>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div ref={servicesTrackRef} className="services-track" tabIndex="0" aria-label={t('home.servicesLabel')}>
            {localizedServices.map((service, index) => (
              <article className="service-card" key={service.id}>
                <div className="service-card__image">
                  <img src={service.image} alt={service.title} loading="lazy" />
                  <span>0{index + 1}</span>
                </div>
                <div className="service-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="carousel-dots" aria-label={t('home.servicesLabel')}>
            {localizedServices.map((service, index) => (
              <button
                type="button"
                key={service.id}
                className={index === activeService ? 'is-active' : ''}
                aria-label={`${service.title} ${index + 1}`}
                aria-current={index === activeService ? 'step' : undefined}
                onClick={() => scrollToService(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        ref={projectsRef}
        className={`home-projects reveal${projectsVisible ? ' reveal--visible' : ''}`}
        aria-labelledby="home-projects-title"
      >
        <div className="container">
          <div className="section-heading section-heading--projects">
            <div>
              <span className="eyebrow">{t('home.projectsLabel')}</span>
              <h2 id="home-projects-title">{t('home.portfolioTitlePre')} <em>{t('home.portfolioTitleEm')}</em></h2>
            </div>
            <p>{t('home.projectsNote')}</p>
          </div>

          <div className="project-index">
            {featuredGalleryItems.map((project, index) => (
              <Link to="/galeria" className="project-index__item" key={project.id}>
                <div className="project-index__image">
                  <img src={project.src} alt={t(`gallery.alts.${project.alt}`)} loading="lazy" />
                  <span className="project-index__number">0{index + 1}</span>
                </div>
                <div className="project-index__details">
                  <span>{t(`gallery.categories.${project.cat}`)}</span>
                  <strong>{t(`gallery.alts.${project.alt}`)}</strong>
                  <span aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="home-projects__action">
            <Link to="/galeria" className="btn btn--outline">{t('home.portfolioCta')} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section
        ref={closingRef}
        className={`home-closing reveal${closingVisible ? ' reveal--visible' : ''}`}
        aria-labelledby="home-closing-title"
      >
        <div className="container home-closing__inner">
          <span className="eyebrow eyebrow--light">V / 02</span>
          <h2 id="home-closing-title">{t('home.ctaTitlePre')} <em>{t('home.ctaTitleEm')}</em></h2>
          <p>{t('home.ctaDesc')}</p>
          <Link to="/contacto" className="btn btn--primary">{t('home.ctaBtn')} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  )
}
