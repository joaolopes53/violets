import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import './Navbar.css'

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const burgerRef = useRef(null)
  const closeRef = useRef(null)
  const wasOpen = useRef(false)
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
    } else if (wasOpen.current) {
      burgerRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = event => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${open ? ' navbar--open' : ''}${isHome ? ' navbar--home' : ''}`}>
        <div className="navbar__inner container">
          <Link to="/" className="navbar__brand" onClick={closeMenu}>
            <img src="/logo.svg" alt="Violets" className="navbar__brand-logo" />
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">VIOLETS</span>
              <span className="navbar__brand-sub">Design Imobiliário</span>
            </span>
          </Link>

          <nav className="navbar__desktop-nav" aria-label={t('nav.menuLabel')}>
            <NavLink to="/" end>{t('nav.home')}</NavLink>
            <NavLink to="/galeria">{t('nav.gallery')}</NavLink>
            <NavLink to="/contacto">{t('nav.contact')}</NavLink>
            <div className="language-switcher" aria-label={t('nav.languageLabel')}>
              <button type="button" className={language === 'pt' ? 'is-active' : ''} onClick={() => setLanguage('pt')} aria-pressed={language === 'pt'}>PT</button>
              <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>EN</button>
            </div>
          </nav>

          <button
            ref={burgerRef}
            type="button"
            className="navbar__menu-button"
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`navbar__overlay${open ? ' is-open' : ''}`} onClick={closeMenu} aria-hidden="true" />

      <aside
        id="site-menu"
        className={`navbar__drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.menuLabel')}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="navbar__drawer-topline">
          <span className="eyebrow">V / 00</span>
          <button ref={closeRef} type="button" className="navbar__drawer-close" onClick={closeMenu} aria-label={t('nav.closeMenu')}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="navbar__drawer-nav" aria-label={t('nav.menuLabel')}>
          <NavLink to="/" end onClick={closeMenu}>{t('nav.home')}</NavLink>
          <NavLink to="/galeria" onClick={closeMenu}>{t('nav.gallery')}</NavLink>
          <NavLink to="/contacto" onClick={closeMenu}>{t('nav.contact')}</NavLink>
        </nav>

        <div className="navbar__drawer-footer">
          <div className="language-switcher" aria-label={t('nav.languageLabel')}>
            <button type="button" className={language === 'pt' ? 'is-active' : ''} onClick={() => { setLanguage('pt'); closeMenu() }} aria-pressed={language === 'pt'}>PT</button>
            <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => { setLanguage('en'); closeMenu() }} aria-pressed={language === 'en'}>EN</button>
          </div>
          <div className="navbar__drawer-contact">
            <a href="tel:+351910008669">+351 910 008 669</a>
            <a href="mailto:geral@violets.pt">geral@violets.pt</a>
          </div>
        </div>
      </aside>
    </>
  )
}
