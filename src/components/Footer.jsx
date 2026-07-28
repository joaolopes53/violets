import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
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
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
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
