import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { assetUrl } from '../utils/assetUrl'
import './Navbar.css'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const [langOpen, setLangOpen] = useState(false)
  const langMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && langOpen) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [langOpen])

  const handleHomeNav = (e) => {
    setOpen(false)
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      if (location.hash) {
        navigate('/', { replace: true })
      }
    }
  }

  const handleContactNav = (e) => {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById('contacto')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      navigate('/#contacto', { replace: true })
    }
  }

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${open ? ' navbar--open' : ''}${isHome ? ' navbar--home' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand" onClick={handleHomeNav}>
            <img src={assetUrl('/logo.svg')} alt="Violets Logo" className="navbar__brand-logo" />
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">VIOLETS</span>
              <span className="navbar__brand-sub">Design e Decoração</span>
            </span>
          </Link>

          <nav className="navbar__nav-desktop" aria-label={t('nav.mainNav')}>
            <NavLink to="/" end className={({ isActive }) => `navbar__link${isActive && !location.hash ? ' active' : ''}`} onClick={handleHomeNav}>{t('nav.home')}</NavLink>
            <NavLink to="/vinil" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>{t('nav.vinil')}</NavLink>
            <NavLink to="/galeria" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>{t('nav.gallery')}</NavLink>
            <Link
              to="/#contacto"
              className={`navbar__link${location.hash === '#contacto' ? ' active' : ''}`}
              onClick={handleContactNav}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          <div className="navbar__actions-desktop">
            <div className="lang-dropdown" ref={langMenuRef}>
              <button
                type="button"
                className={`lang-dropdown__btn${langOpen ? ' lang-dropdown__btn--open' : ''}`}
                onClick={() => setLangOpen(prev => !prev)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                aria-label={t('nav.selectLang')}
              >
                <span className="lang-dropdown__current">{language.toUpperCase()}</span>
                <svg className="lang-dropdown__arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {langOpen && (
                <ul className="lang-dropdown__menu" role="listbox" aria-label={t('nav.availableLangs')}>
                  <li
                    role="option"
                    tabIndex={0}
                    aria-selected={language === 'pt'}
                    className={`lang-dropdown__item${language === 'pt' ? ' lang-dropdown__item--active' : ''}`}
                    onClick={() => { setLanguage('pt'); setLangOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setLanguage('pt')
                        setLangOpen(false)
                      }
                    }}
                  >
                    <span className="lang-dropdown__code">PT</span>
                    <span className="lang-dropdown__label">Português</span>
                    {language === 'pt' && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </li>
                  <li
                    role="option"
                    tabIndex={0}
                    aria-selected={language === 'en'}
                    className={`lang-dropdown__item${language === 'en' ? ' lang-dropdown__item--active' : ''}`}
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setLanguage('en')
                        setLangOpen(false)
                      }
                    }}
                  >
                    <span className="lang-dropdown__code">EN</span>
                    <span className="lang-dropdown__label">English</span>
                    {language === 'en' && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </li>
                </ul>
              )}
            </div>

            <Link
              to="/#contacto"
              className="navbar__cta-btn"
              onClick={handleContactNav}
            >
              <span>{t('nav.cta')}</span>
            </Link>
          </div>

          <button
            type="button"
            className={`navbar__burger${open ? ' navbar__burger--open' : ''}`}
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div
        className={`navbar__overlay${open ? ' navbar__overlay--open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside className={`navbar__drawer${open ? ' navbar__drawer--open' : ''}`}>
        <div className="navbar__drawer-header">
          <div className="navbar__drawer-brand">
            <img src={assetUrl('/logo.svg')} alt="Violets Logo" className="navbar__drawer-logo" />
            <span className="navbar__drawer-brand-name">VIOLETS</span>
          </div>
          <button
            type="button"
            className="navbar__drawer-close"
            onClick={() => setOpen(false)}
            aria-label={t('nav.closeMenu')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="navbar__drawer-nav">
          <NavLink to="/" end onClick={handleHomeNav}>{t('nav.home')}</NavLink>
          <NavLink to="/vinil" onClick={() => setOpen(false)}>{t('nav.vinil')}</NavLink>
          <NavLink to="/galeria" onClick={() => setOpen(false)}>{t('nav.gallery')}</NavLink>
          <Link
            to="/#contacto"
            onClick={(e) => {
              setOpen(false)
              handleContactNav(e)
            }}
          >
            {t('nav.contact')}
          </Link>
        </nav>

        <div className="navbar__drawer-footer">
          <div className="navbar__drawer-contact">
            <a href="tel:+351910008669" className="navbar__drawer-contact-item">
              +351 910 008 669
            </a>
            <a href="mailto:geral@violets.pt" className="navbar__drawer-contact-item">
              geral@violets.pt
            </a>
          </div>
          
          <div className="navbar__drawer-footer-row">
            <div className="lang-switcher">
              <button
                className={`lang-btn${language === 'pt' ? ' lang-btn--active' : ''}`}
                onClick={() => { setLanguage('pt'); setOpen(false); }}
                aria-label="Português"
              >
                PT
              </button>
              <button
                className={`lang-btn${language === 'en' ? ' lang-btn--active' : ''}`}
                onClick={() => { setLanguage('en'); setOpen(false); }}
                aria-label="English"
              >
                EN
              </button>
            </div>

            <div className="navbar__drawer-socials">
              <a href="https://www.instagram.com/violets_decor?igsh=MWNyNnZyMml1NGdwMQ==" target="_blank" rel="noopener noreferrer" className="navbar__drawer-social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1XwyGfTokq/" target="_blank" rel="noopener noreferrer" className="navbar__drawer-social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://wa.me/351910008669" target="_blank" rel="noopener noreferrer" className="navbar__drawer-social-btn" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
