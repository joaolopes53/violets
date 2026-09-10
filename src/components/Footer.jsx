import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { assetUrl } from '../utils/assetUrl'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleBrandClick = (e) => {
    if (isHome) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Brand & Studio Statement */}
        <div className="footer__brand-col">
          <Link to="/" className="footer__brand" onClick={handleBrandClick}>
            <img src={assetUrl('/logo.svg')} alt="Violets Logo" className="footer__brand-logo" />
            <span className="footer__brand-text">
              <span className="footer__brand-name">VIOLETS</span>
              <span className="footer__brand-sub">Design e Decoração</span>
            </span>
          </Link>
          <p className="footer__desc">
            {t('footer.desc')}
          </p>
          <div className="footer__socials">
            <a
              href="https://www.instagram.com/violets_decor?igsh=MWNyNnZyMml1NGdwMQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/share/1XwyGfTokq/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://wa.me/351910008669"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Studio Navigation */}
        <div className="footer__nav-col">
          <p className="footer__col-label">{t('footer.quickLinks')}</p>
          <nav className="footer__nav-list" aria-label="Footer Navigation">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('nav.home')}</Link>
            <Link to="/vinil">{t('nav.vinil')}</Link>
            <Link to="/galeria">{t('nav.gallery')}</Link>
            <Link
              to="/#contacto"
              onClick={(e) => {
                if (isHome) {
                  e.preventDefault()
                  const el = document.getElementById('contacto')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                  navigate('/#contacto', { replace: true })
                }
              }}
            >
              {t('nav.contact')}
            </Link>
          </nav>
        </div>

        {/* Contact & Locations */}
        <div className="footer__contact-col">
          <p className="footer__col-label">{t('footer.contact')}</p>
          <div className="footer__locations">
            <div className="footer__location-block">
              <span className="footer__location-name">{t('contact.sede')}</span>
              <p className="footer__location-detail">Rua Francisco Peres, Ed. Freitas, Loja C</p>
            </div>
            <div className="footer__location-block">
              <span className="footer__location-name">{t('contact.armazem')}</span>
              <p className="footer__location-detail">Parque Empresarial da Camacha, Lote 4</p>
            </div>
          </div>
          <div className="footer__direct-links">
            <a href="mailto:geral@violets.pt" className="footer__direct-link">geral@violets.pt</a>
            <a href="tel:+351910008669" className="footer__direct-link">+351 910 008 669</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p>© {new Date().getFullYear()} Violets Design e Decoração. {t('footer.rights')}</p>
          <p className="footer__location-tag">Madeira · Portugal</p>
        </div>
      </div>
    </footer>
  )
}
