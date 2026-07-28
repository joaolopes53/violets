import { useLanguage } from '../hooks/useLanguage'
import './Contacto.css'

export default function Contacto() {
  const { t } = useLanguage()

  return (
    <div className="contact-page">
      <header className="contact-page__header">
        <div className="container">
          <span className="eyebrow">V / 04</span>
          <h1>{t('contact.titlePre')} <em>{t('contact.titleEm')}</em></h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </header>

      <div className="contact-page__body container">
        <aside className="contact-page__aside" aria-label={t('contact.contact')}>
          <div className="contact-page__aside-label">
            <span className="eyebrow">{t('contact.studioLabel')}</span>
          </div>

          <div className="contact-detail">
            <span>{t('contact.sede')}</span>
            <address>Rua Francisco Peres<br />Edifício Freitas, Loja C<br />9125-015 Caniço, Madeira</address>
          </div>

          <div className="contact-detail">
            <span>{t('contact.armazem')}</span>
            <address>Rua Achada Diogo Dias<br />Parque Empresarial da Camacha, Lote 4<br />9135-401 Camacha</address>
          </div>

          <div className="contact-detail">
            <span>{t('contact.horario')}</span>
            <p>{t('contact.scheduleWeek')}</p>
            <p>{t('contact.scheduleSat')}</p>
          </div>
        </aside>

        <section className="contact-page__actions" aria-labelledby="contact-actions-title">
          <span className="eyebrow">V / 05</span>
          <h2 id="contact-actions-title">{t('contact.nextTitlePre')}<br /><em>{t('contact.nextTitleEm')}</em></h2>

          <div className="contact-action-list">
            <a className="contact-action" href="mailto:geral@violets.pt?subject=Contacto%20Violets">
              <span className="contact-action__index">01</span>
              <span className="contact-action__content">
                <strong>{t('contact.emailCtaTitle')}</strong>
                <span>{t('contact.emailCtaDesc')}</span>
              </span>
              <span className="contact-action__arrow" aria-hidden="true">↗</span>
            </a>

            <a className="contact-action" href="https://wa.me/351910008669" target="_blank" rel="noopener noreferrer">
              <span className="contact-action__index">02</span>
              <span className="contact-action__content">
                <strong>{t('contact.whatsappCtaTitle')}</strong>
                <span>{t('contact.whatsappCtaDesc')}</span>
              </span>
              <span className="contact-action__arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="contact-page__direct">
            <a href="tel:+351910008669">+351 910 008 669</a>
            <a href="mailto:geral@violets.pt">geral@violets.pt</a>
          </div>
        </section>
      </div>
    </div>
  )
}
