import { useState } from 'react'
import './Contacto.css'

const INITIAL = { nome: '', email: '', telefone: '', assunto: '', mensagem: '' }

export default function Contacto() {
  const [form, setForm] = useState(INITIAL)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.nome.trim())     e.nome     = 'Campo obrigatório'
    if (!form.email.trim())    e.email    = 'Campo obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.mensagem.trim()) e.mensagem = 'Campo obrigatório'
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
          <span className="section-label">Contacto</span>
          <h1>Fale <em>connosco</em></h1>
          <p>Estamos disponíveis para ajudar a criar o espaço dos seus sonhos.</p>
        </div>
      </div>

      {/* Main */}
      <div className="contacto__body">
        <div className="contacto__inner">
          {/* Info */}
          <div className="contacto__info">
            <div className="info-block">
              <span className="info-block__label">Sede</span>
              <p>Rua Francisco Peres</p>
              <p>Edifício Freitas, Loja C</p>
              <p>9125-015 Caniço, Madeira</p>
            </div>
            <div className="info-block">
              <span className="info-block__label">Armazém</span>
              <p>Rua Achada Diogo Dias</p>
              <p>Parque Empresarial da Camacha, Lote 4</p>
              <p>9135-401 Camacha</p>
            </div>
            <div className="info-block">
              <span className="info-block__label">Contacto</span>
              <a href="tel:+351291000000">+351 291 000 000</a>
              <a href="mailto:geral@violets.pt">geral@violets.pt</a>
            </div>
            <div className="info-block">
              <span className="info-block__label">Horário</span>
              <p>Segunda — Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 13h</p>
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
                <h3>Mensagem enviada</h3>
                <p>Obrigado pelo seu contacto. Responderemos brevemente com uma proposta personalizada.</p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="form__row form__row--2">
                  <div className={`form__field${errors.nome ? ' form__field--error' : ''}${form.nome ? ' form__field--has-value' : ''}`}>
                    <input name="nome" value={form.nome} onChange={onChange} placeholder=" " />
                    <label>Nome <span>*</span></label>
                    {errors.nome && <span className="form__error">{errors.nome}</span>}
                  </div>
                  <div className={`form__field${errors.email ? ' form__field--error' : ''}${form.email ? ' form__field--has-value' : ''}`}>
                    <input name="email" type="email" value={form.email} onChange={onChange} placeholder=" " />
                    <label>Email <span>*</span></label>
                    {errors.email && <span className="form__error">{errors.email}</span>}
                  </div>
                </div>
                
                <div className="form__row form__row--2">
                  <div className={`form__field${form.telefone ? ' form__field--has-value' : ''}`}>
                    <input name="telefone" type="tel" value={form.telefone} onChange={onChange} placeholder=" " />
                    <label>Telefone</label>
                  </div>
                  <div className={`form__field${form.assunto ? ' form__field--has-value' : ''}`}>
                    <select name="assunto" value={form.assunto} onChange={onChange}>
                      <option value="" disabled hidden></option>
                      <option value="cozinhas">Cozinhas</option>
                      <option value="roupeiros">Roupeiros</option>
                      <option value="portas">Portas</option>
                      <option value="escadarias">Escadarias</option>
                      <option value="decoracao">Decoração</option>
                      <option value="vinil">Vinil</option>
                      <option value="outro">Outro</option>
                    </select>
                    <label>Assunto</label>
                  </div>
                </div>

                <div className={`form__field form__field--textarea${errors.mensagem ? ' form__field--error' : ''}${form.mensagem ? ' form__field--has-value' : ''}`}>
                  <textarea name="mensagem" rows={5} value={form.mensagem} onChange={onChange} placeholder=" " />
                  <label>Mensagem <span>*</span></label>
                  {errors.mensagem && <span className="form__error">{errors.mensagem}</span>}
                </div>

                <div className="form__submit">
                  <button type="submit" className="btn btn--primary">Enviar mensagem</button>
                  <p className="form__note">Os campos marcados com <span>*</span> são obrigatórios</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
