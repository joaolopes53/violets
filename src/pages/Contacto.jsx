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
                <span className="form-success__icon">✓</span>
                <h3>Mensagem enviada</h3>
                <p>Obrigado pelo seu contacto. Responderemos brevemente.</p>
                <button className="btn btn--ghost" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="form__row form__row--2">
                  <div className={`form__field${errors.nome ? ' form__field--error' : ''}`}>
                    <label>Nome <span>*</span></label>
                    <input name="nome" value={form.nome} onChange={onChange} placeholder="O seu nome" />
                    {errors.nome && <span className="form__error">{errors.nome}</span>}
                  </div>
                  <div className={`form__field${errors.email ? ' form__field--error' : ''}`}>
                    <label>Email <span>*</span></label>
                    <input name="email" type="email" value={form.email} onChange={onChange} placeholder="email@exemplo.pt" />
                    {errors.email && <span className="form__error">{errors.email}</span>}
                  </div>
                </div>
                <div className="form__row form__row--2">
                  <div className="form__field">
                    <label>Telefone</label>
                    <input name="telefone" type="tel" value={form.telefone} onChange={onChange} placeholder="+351 9xx xxx xxx" />
                  </div>
                  <div className="form__field">
                    <label>Assunto</label>
                    <select name="assunto" value={form.assunto} onChange={onChange}>
                      <option value="">Selecionar assunto</option>
                      <option value="cozinhas">Cozinhas</option>
                      <option value="roupeiros">Roupeiros</option>
                      <option value="portas">Portas</option>
                      <option value="escadarias">Escadarias</option>
                      <option value="decoracao">Decoração</option>
                      <option value="vinil">Vinil</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
                <div className={`form__field${errors.mensagem ? ' form__field--error' : ''}`}>
                  <label>Mensagem <span>*</span></label>
                  <textarea name="mensagem" rows={6} value={form.mensagem} onChange={onChange} placeholder="Descreva o seu projeto ou dúvida..." />
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
