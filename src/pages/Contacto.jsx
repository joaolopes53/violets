import { useLanguage } from '../hooks/useLanguage'
import './Contacto.css'

export default function Contacto() {
  const { t } = useLanguage()

  return (
    <div className="contacto">
      {/* Header */}
      <div className="contacto__header">
        <div className="contacto__header-inner">
          <span className="section-label">{t('contact.contact')}</span>
          <h1>{t('contact.titlePre')} <em>{t('contact.titleEm')}</em></h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </div>

      {/* Main */}
      <div className="contacto__body">
        <div className="contacto__inner">
          {/* Info */}
          <div className="contacto__info">
            <div className="info-block">
              <span className="info-block__label">{t('contact.sede')}</span>
              <p>Rua Francisco Peres</p>
              <p>Edifício Freitas, Loja C</p>
              <p>9125-015 Caniço, Madeira</p>
            </div>
            <div className="info-block">
              <span className="info-block__label">{t('contact.armazem')}</span>
              <p>Rua Achada Diogo Dias</p>
              <p>Parque Empresarial da Camacha, Lote 4</p>
              <p>9135-401 Camacha</p>
            </div>
            <div className="info-block">
              <span className="info-block__label">{t('contact.contact')}</span>
              <a href="tel:+351910008669">+351 910 008 669</a>
              <a href="mailto:geral@violets.pt">geral@violets.pt</a>
            </div>
            <div className="info-block">
              <span className="info-block__label">{t('contact.horario')}</span>
              <p>{t('contact.scheduleWeek')}</p>
              <p>{t('contact.scheduleSat')}</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="contacto__ctas">
            {/* Email CTA */}
            <div className="contacto__form-wrap">
              <div className="email-cta">
                <div className="email-cta__icon email-cta__icon--gold">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M3 7l9 6 9-6"></path>
                  </svg>
                </div>
                <h3>{t('contact.emailCtaTitle')}</h3>
                <p>{t('contact.emailCtaDesc')}</p>
                <a
                  href="mailto:geral@violets.pt?subject=Contacto%20Violets"
                  className="btn btn--primary"
                >
                  {t('contact.emailCtaBtn')}
                </a>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="contacto__form-wrap">
              <div className="email-cta">
                <div className="email-cta__icon email-cta__icon--whatsapp">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"></path>
                  </svg>
                </div>
                <h3>{t('contact.whatsappCtaTitle')}</h3>
                <p>{t('contact.whatsappCtaDesc')}</p>
                <a
                  href="https://wa.me/351910008669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--whatsapp"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7C17.17 3.03 14.69 2 12.04 2zm0 18.14h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.26-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z" />
                  </svg>
                  <span>{t('contact.whatsappCtaBtn')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
