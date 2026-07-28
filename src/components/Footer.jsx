import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      {/* Wavy Divider */}
      <div className="footer__divider" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C240,70 480,80 720,50 C960,20 1200,30 1440,15 L1440,120 L0,120 Z" />
        </svg>
      </div>

      <div className="footer__inner">
        {/* Column 1: Brand, Description & Socials */}
        <div className="footer__brand-section">
          <Link to="/" className="footer__brand">
            <img src="/logo.png" alt="Violets Logo" className="footer__brand-logo" />
            <span className="footer__brand-text">
              <span className="footer__brand-name">VIOLETS</span>
              <span className="footer__brand-sub">Design Imobiliário</span>
            </span>
          </Link>
          <p className="footer__desc">
            {t('footer.desc')}
          </p>
          <div className="footer__socials">
            <a href="https://www.instagram.com/violets_decor?igsh=MWNyNnZyMml1NGdwMQ==" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1XwyGfTokq/" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://wa.me/351910008669" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Links */}
        <div className="footer__col">
          <p className="footer__col-title">{t('footer.quickLinks')}</p>
          <div className="footer__links">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('nav.home')}</Link>
            <Link to="/galeria">{t('nav.gallery')}</Link>
            <Link to="/contacto">{t('nav.contact')}</Link>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div className="footer__col">
          <p className="footer__col-title">{t('footer.contact')}</p>
          <div className="footer__contacts">
            <div className="footer__contact-item">
              <span className="footer__contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
              <span className="footer__contact-text">
                Rua Francisco Peres, Ed. Freitas, Loja C<br />
                9125-015 Caniço, Madeira
              </span>
            </div>

            <div className="footer__contact-item">
              <span className="footer__contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <a href="mailto:geral@violets.pt" className="footer__contact-text footer__contact-link">
                geral@violets.pt
              </a>
            </div>

            <div className="footer__contact-item">
              <span className="footer__contact-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <a href="tel:+351910008669" className="footer__contact-text footer__contact-link">
                +351 910 008 669
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Violets Design Imobiliários. {t('footer.rights')}</p>
      </div>
    </footer>
  )
}
