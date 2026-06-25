import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="/logo.png" alt="Violets Logo" className="footer__brand-logo" />
          <div>
            <p className="footer__name">VIOLETS</p>
            <p className="footer__sub">Decoração Imobiliário</p>
          </div>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__col-title">Empresa</p>
            <Link to="/">Início</Link>
            <Link to="/galeria">Galeria</Link>
            <Link to="/contacto">Contacto</Link>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Contacto</p>
            <a href="tel:+351291000000">+351 291 000 000</a>
            <a href="mailto:geral@violets.pt">geral@violets.pt</a>
          </div>

          <div className="footer__col">
            <p className="footer__col-title">Morada</p>
            <span>Rua Francisco Peres</span>
            <span>Edifício Freitas, Loja C</span>
            <span>9125-015 Caniço, Madeira</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Violets Decoração Imobiliários Unipessoal Lda — NIF 509938159</p>
      </div>
    </footer>
  )
}
