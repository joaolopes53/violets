import { Link } from 'react-router-dom'
import { images } from '../data/gallery'
import './Home.css'

const services = [
  { icon: '◈', title: 'Cozinhas', desc: 'Projetos à medida com materiais premium e acabamentos impecáveis.' },
  { icon: '◈', title: 'Roupeiros', desc: 'Soluções de arrumação personalizadas para cada espaço.' },
  { icon: '◈', title: 'Portas', desc: 'Portas interiores de design com diversas opções de acabamento.' },
  { icon: '◈', title: 'Escadarias', desc: 'Escadarias únicas que combinam função e elegância estrutural.' },
  { icon: '◈', title: 'Decoração', desc: 'Cortinados, estores, papel de parede e têxteis para o lar.' },
  { icon: '◈', title: 'Vinil', desc: 'Revestimentos em vinil de alta durabilidade e design contemporâneo.' },
]

const preview = images.slice(0, 6)

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content">
          <p className="hero__eyebrow">Desde 2011 — Caniço, Madeira</p>
          <h1 className="hero__title">
            Decoração<br />
            <em>com identidade</em>
          </h1>
          <p className="hero__desc">
            Interiores que refletem quem você é. Do design ao acabamento,
            criamos espaços únicos para viver e inspirar.
          </p>
          <div className="hero__actions">
            <Link to="/galeria" className="btn btn--primary">Ver Projetos</Link>
            <Link to="/contacto" className="btn btn--ghost">Fale Connosco</Link>
          </div>
        </div>
        <div className="hero__logo-seal">
          <img src="/logo.png" alt="Violets logo" />
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* About */}
      <section className="about">
        <div className="about__inner">
          <div className="about__label">Sobre Nós</div>
          <div className="about__grid">
            <div className="about__text">
              <h2>Excelência em cada<br /><em>detalhe do seu espaço</em></h2>
              <p>
                A Violets Decoração Imobiliários nasceu em 2011 com uma missão clara:
                transformar espaços comuns em ambientes extraordinários. Especializados
                em decoração de interiores e design mobiliário, oferecemos soluções
                completas que combinam funcionalidade, estética e qualidade superior.
              </p>
              <p>
                Com sede no Caniço, Madeira, servimos clientes em toda a ilha com
                uma equipa dedicada que acompanha cada projeto desde a concepção
                ao acabamento final.
              </p>
              <Link to="/contacto" className="about__cta">
                Iniciar projeto <span>→</span>
              </Link>
            </div>
            <div className="about__stats">
              <div className="stat">
                <span className="stat__num">+14</span>
                <span className="stat__label">Anos de experiência</span>
              </div>
              <div className="stat">
                <span className="stat__num">∞</span>
                <span className="stat__label">Projetos realizados</span>
              </div>
              <div className="stat">
                <span className="stat__num">100%</span>
                <span className="stat__label">Satisfação garantida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <div className="services__inner">
          <div className="section-header">
            <span className="section-label">O Que Fazemos</span>
            <h2>Serviços <em>especializados</em></h2>
          </div>
          <div className="services__grid">
            {services.map(s => (
              <div className="service-card" key={s.title}>
                <span className="service-card__icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="preview">
        <div className="preview__inner">
          <div className="section-header">
            <span className="section-label">Portfólio</span>
            <h2>O nosso <em>trabalho</em></h2>
          </div>
          <div className="preview__grid">
            {preview.map((img, i) => (
              <div className="preview__item" key={i}>
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="preview__cta">
            <Link to="/galeria" className="btn btn--outline">Ver galeria completa</Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <h2>Pronto para transformar<br /><em>o seu espaço?</em></h2>
          <p>Fale connosco e receba uma proposta personalizada.</p>
          <Link to="/contacto" className="btn btn--primary">Contactar agora</Link>
        </div>
      </section>
    </div>
  )
}
