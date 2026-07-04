import { useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import './Contacto.css'

const INITIAL = { nome: '', email: '', telefone: '', assunto: '', mensagem: '' }

export default function Contacto() {
  const { t } = useLanguage()
  const [form, setForm] = useState(INITIAL)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.nome.trim())     e.nome     = t('contact.fieldRequired')
    if (!form.email.trim())    e.email    = t('contact.fieldRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('contact.fieldInvalidEmail')
    if (!form.mensagem.trim()) e.mensagem = t('contact.fieldRequired')
    return e
  }

  const onChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => { const n = {...e}; delete n[name]; return n })
  }

  const onSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSent(true)
    setForm(INITIAL)
  }

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

          {/* Form */}
          <div className="contacto__form-wrap">
            {sent ? (
              <div className="form-success">
                <div className="form-success__icon-wrap">
                  <svg className="form-success__checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="form-success__checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="form-success__checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h3>{t('contact.formSuccessTitle')}</h3>
                <p>{t('contact.formSuccessDesc')}</p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>
                  {t('contact.formSuccessBtn')}
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="form__row form__row--2">
                  <div className={`form__field${errors.nome ? ' form__field--error' : ''}${form.nome ? ' form__field--has-value' : ''}`}>
                    <input name="nome" value={form.nome} onChange={onChange} placeholder=" " />
                    <label>{t('contact.fieldNome')} <span>*</span></label>
                    {errors.nome && <span className="form__error">{errors.nome}</span>}
                  </div>
                  <div className={`form__field${errors.email ? ' form__field--error' : ''}${form.email ? ' form__field--has-value' : ''}`}>
                    <input name="email" type="email" value={form.email} onChange={onChange} placeholder=" " />
                    <label>{t('contact.fieldEmail')} <span>*</span></label>
                    {errors.email && <span className="form__error">{errors.email}</span>}
                  </div>
                </div>
                
                <div className="form__row form__row--2">
                  <div className={`form__field${form.telefone ? ' form__field--has-value' : ''}`}>
                    <input name="telefone" type="tel" value={form.telefone} onChange={onChange} placeholder=" " />
                    <label>{t('contact.fieldTelefone')}</label>
                  </div>
                  <div className={`form__field${form.assunto ? ' form__field--has-value' : ''}`}>
                    <select name="assunto" value={form.assunto} onChange={onChange}>
                      <option value="" disabled hidden></option>
                      <option value="cozinhas">{t('contact.subjects.cozinhas')}</option>
                      <option value="roupeiros">{t('contact.subjects.roupeiros')}</option>
                      <option value="portas">{t('contact.subjects.portas')}</option>
                      <option value="escadarias">{t('contact.subjects.escadarias')}</option>
                      <option value="design">{t('contact.subjects.design')}</option>
                      <option value="vinil">{t('contact.subjects.vinil')}</option>
                      <option value="outro">{t('contact.subjects.outro')}</option>
                    </select>
                    <label>{t('contact.fieldAssunto')}</label>
                  </div>
                </div>

                <div className={`form__field form__field--textarea${errors.mensagem ? ' form__field--error' : ''}${form.mensagem ? ' form__field--has-value' : ''}`}>
                  <textarea name="mensagem" rows={5} value={form.mensagem} onChange={onChange} placeholder=" " />
                  <label>{t('contact.fieldMensagem')} <span>*</span></label>
                  {errors.mensagem && <span className="form__error">{errors.mensagem}</span>}
                </div>

                <div className="form__submit">
                  <button type="submit" className="btn btn--primary">{t('contact.formSubmitBtn')}</button>
                  <p className="form__note">{t('contact.formNote')}</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
