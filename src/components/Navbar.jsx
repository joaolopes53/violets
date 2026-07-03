import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${open ? ' navbar--open' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Violets Logo" className="navbar__brand-logo" />
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">VIOLETS</span>
            <span className="navbar__brand-sub">Decoração Imobiliário</span>
          </span>
        </Link>

        <nav className={`navbar__nav${open ? ' navbar__nav--open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Início</NavLink>
          <NavLink to="/galeria" onClick={() => setOpen(false)}>Galeria</NavLink>
          <NavLink to="/contacto" onClick={() => setOpen(false)}>Contacto</NavLink>
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
  )
}
