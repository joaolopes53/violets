import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { images } from '../data/gallery'
import './Home.css'

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M12 9v6M9 12h1M14 12h1" />
      </svg>
    ),
    title: 'Cozinhas',
    desc: 'Projetos à medida com materiais premium e acabamentos impecáveis.',
    size: 'large' // Bento grid size class
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M12 2v20M9 10h2M13 10h2" />
      </svg>
    ),
    title: 'Roupeiros',
    desc: 'Soluções de arrumação personalizadas para cada espaço.',
    size: 'medium'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <path d="M15 12h1M5 12h14" />
      </svg>
    ),
    title: 'Portas',
    desc: 'Portas interiores de design com diversas opções de acabamento.',
    size: 'small'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h4v-4h4v-4h4V8h4V4" />
      </svg>
    ),
    title: 'Escadarias',
    desc: 'Escadarias únicas que combinam função e elegância estrutural.',
    size: 'small'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2a10 10 0 0 1 8 4" />
      </svg>
    ),
    title: 'Vinil',
    desc: 'Revestimentos em vinil de alta durabilidade e design contemporâneo.',
    size: 'small'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c0 8 4 12 8 12s8-4 8-12M4 4v16M20 4v16M12 16v4" />
      </svg>
    ),
    title: 'Decoração',
    desc: 'Cortinados, estores, papel de parede e têxteis para o lar.',
    size: 'full'
  }
]

const preview = images.slice(0, 6)

export default function Home() {
  // Scroll reveal hooks
  const [aboutRef, aboutVisible] = useReveal()
  const [servicesRef, servicesVisible] = useReveal()
  const [previewRef, previewVisible] = useReveal()
  const [ctaRef, ctaVisible] = useReveal()

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
      <section ref={aboutRef} className={`about reveal ${aboutVisible ? 'reveal--visible' : ''}`}>
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
      <section ref={servicesRef} className={`services reveal ${servicesVisible ? 'reveal--visible' : ''}`}>
        <div className="services__inner">
          <div className="section-header">
            <span className="section-label">O Que Fazemos</span>
            <h2>Serviços <em>especializados</em></h2>
          </div>
          <div className="services__bento">
            {services.map(s => (
              <div className={`service-card service-card--${s.size}`} key={s.title}>
                <span className="service-card__icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section ref={previewRef} className={`preview reveal ${previewVisible ? 'reveal--visible' : ''}`}>
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
      <section ref={ctaRef} className={`cta-banner reveal ${ctaVisible ? 'reveal--visible' : ''}`}>
        <div className="cta-banner__inner">
          <h2>Pronto para transformar<br /><em>o seu espaço?</em></h2>
          <p>Fale connosco e receba uma proposta personalizada.</p>
          <Link to="/contacto" className="btn btn--primary">Contactar agora</Link>
        </div>
      </section>
    </div>
  )
}
