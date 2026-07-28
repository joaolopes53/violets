import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import './Navbar.css'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
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

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${open ? ' navbar--open' : ''}${isHome ? ' navbar--home' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
            <img src="/logo.svg" alt="Violets Logo" className="navbar__brand-logo" />
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">VIOLETS</span>
              <span className="navbar__brand-sub">Design Imobiliário</span>
            </span>
          </Link>

          <nav className="navbar__nav-desktop">
            <NavLink to="/" end>{t('nav.home')}</NavLink>
            <NavLink to="/galeria">{t('nav.gallery')}</NavLink>
            <NavLink to="/contacto">{t('nav.contact')}</NavLink>
            
            <div className="lang-switcher">
              <button
                className={`lang-btn${language === 'pt' ? ' lang-btn--active' : ''}`}
                onClick={() => setLanguage('pt')}
                aria-label="Português"
              >
                PT
              </button>
              <button
                className={`lang-btn${language === 'en' ? ' lang-btn--active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label="English"
              >
                EN
              </button>
            </div>
          </nav>

          <button
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
            <img src="/logo.svg" alt="Violets Logo" className="navbar__drawer-logo" />
            <span className="navbar__drawer-brand-name">VIOLETS</span>
          </div>
          <button
            className="navbar__drawer-close"
            onClick={() => setOpen(false)}
            aria-label={t('gallery.lightbox.close')}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="navbar__drawer-nav">
          <NavLink to="/" end onClick={() => setOpen(false)}>{t('nav.home')}</NavLink>
          <NavLink to="/galeria" onClick={() => setOpen(false)}>{t('nav.gallery')}</NavLink>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>{t('nav.contact')}</NavLink>
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
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

