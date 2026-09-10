import { useLanguage } from '../hooks/useLanguage'
import { useSeo } from '../hooks/useSeo'
import './Privacidade.css'

const policyContent = {
  pt: {
    seoTitle: 'Política de Privacidade | Violets',
    seoDescription: 'Consulte a política de privacidade da Violets — Design e Decoração.',
    tag: 'Informação legal',
    title: 'Política de Privacidade',
    intro: 'Esta política explica como este website trata dados pessoais e utiliza cookies ou tecnologias semelhantes.',
    updated: 'Última atualização: 10 de setembro de 2026',
    sections: [
      {
        title: '1. Quem somos',
        paragraphs: [
          'Este website é gerido pela Violets — Design e Decoração, com atividade no Caniço e na Camacha, Madeira.',
          'Para questões relacionadas com privacidade, pode contactar-nos através do email geral@violets.pt.'
        ]
      },
      {
        title: '2. Que dados podem ser tratados',
        paragraphs: [
          'Este website não possui atualmente contas de utilizador, loja online, formulários de contacto, publicidade ou ferramentas de análise comportamental.',
          'Podem ser tratados dados técnicos necessários ao funcionamento e segurança do website, a preferência de idioma guardada localmente no navegador e os dados que o utilizador escolha enviar por email, telefone ou WhatsApp.',
          'A página inicial apresenta um mapa incorporado do Google Maps. A utilização desse conteúdo pode envolver o tratamento de dados técnicos pelo Google.'
        ]
      },
      {
        title: '3. Cookies e armazenamento local',
        paragraphs: [
          'Atualmente, o website não utiliza cookies próprios de análise estatística, publicidade, remarketing ou criação de perfis de utilizador.',
          'A aplicação utiliza o armazenamento local do navegador para guardar a preferência de idioma (português ou inglês), evitando que essa escolha tenha de ser repetida em cada visita.',
          'O Google Maps incorporado pode utilizar cookies ou tecnologias semelhantes quando o mapa é carregado. O tratamento realizado pelo Google está sujeito às políticas do próprio serviço.'
        ]
      },
      {
        title: '4. Finalidades',
        paragraphs: [
          'Os dados são utilizados apenas para garantir o funcionamento e segurança do website, responder a pedidos de informação e orçamento, prestar o serviço solicitado e cumprir obrigações legais aplicáveis.'
        ]
      },
      {
        title: '5. Serviços externos',
        paragraphs: [
          'O website inclui ligações para WhatsApp, Instagram, Facebook, email e Google Maps. Ao aceder a esses serviços, o utilizador passa a estar sujeito às respetivas políticas de privacidade e condições de utilização.'
        ]
      },
      {
        title: '6. Conservação dos dados',
        paragraphs: [
          'Os dados enviados por email, WhatsApp ou outros canais são conservados apenas durante o período necessário para responder ao pedido e acompanhar um eventual projeto, salvo obrigação legal em contrário.'
        ]
      },
      {
        title: '7. Direitos do utilizador',
        paragraphs: [
          'Nos termos legais aplicáveis, o utilizador pode solicitar o acesso, correção, eliminação, limitação ou oposição ao tratamento dos seus dados.',
          'Para exercer estes direitos, contacte-nos através de geral@violets.pt. O utilizador pode também apresentar uma reclamação junto da Comissão Nacional de Proteção de Dados (CNPD).'
        ],
        link: {
          label: 'Website da CNPD',
          href: 'https://www.cnpd.pt/'
        }
      },
      {
        title: '8. Alterações a esta política',
        paragraphs: [
          'Esta política pode ser atualizada sempre que existam alterações ao website, aos serviços utilizados ou à legislação aplicável.'
        ]
      }
    ]
  },
  en: {
    seoTitle: 'Privacy Policy | Violets',
    seoDescription: 'Read the privacy policy of Violets — Interior Design and Decoration.',
    tag: 'Legal information',
    title: 'Privacy Policy',
    intro: 'This policy explains how this website handles personal data and uses cookies or similar technologies.',
    updated: 'Last updated: 10 September 2026',
    sections: [
      {
        title: '1. Who we are',
        paragraphs: [
          'This website is managed by Violets — Interior Design and Decoration, operating in Caniço and Camacha, Madeira.',
          'For privacy-related questions, you can contact us at geral@violets.pt.'
        ]
      },
      {
        title: '2. What data may be processed',
        paragraphs: [
          'This website currently has no user accounts, online shop, contact forms, advertising or behavioural analytics tools.',
          'Technical data required for website operation and security, the language preference stored locally in the browser, and information that users choose to send by email, telephone or WhatsApp may be processed.',
          'The home page displays an embedded Google Maps map. Using this content may involve Google processing technical data.'
        ]
      },
      {
        title: '3. Cookies and local storage',
        paragraphs: [
          'The website currently does not use first-party cookies for analytics, advertising, remarketing or user profiling.',
          'The application uses the browser local storage to remember the language preference (Portuguese or English), so users do not need to choose it on every visit.',
          'The embedded Google Maps service may use cookies or similar technologies when the map is loaded. Processing by Google is governed by that service’s own policies.'
        ]
      },
      {
        title: '4. Purposes',
        paragraphs: [
          'Data is used only to operate and secure the website, respond to information and quotation requests, provide the requested service and comply with applicable legal obligations.'
        ]
      },
      {
        title: '5. External services',
        paragraphs: [
          'The website includes links to WhatsApp, Instagram, Facebook, email and Google Maps. When accessing these services, users become subject to their respective privacy policies and terms of use.'
        ]
      },
      {
        title: '6. Data retention',
        paragraphs: [
          'Data sent by email, WhatsApp or other channels is retained only for as long as necessary to respond to the request and support a potential project, unless a longer period is required by law.'
        ]
      },
      {
        title: '7. User rights',
        paragraphs: [
          'Subject to applicable law, users may request access to, correction, deletion, restriction of or objection to the processing of their data.',
          'To exercise these rights, contact geral@violets.pt. Users may also lodge a complaint with the Portuguese Data Protection Authority (CNPD).'
        ],
        link: {
          label: 'CNPD website',
          href: 'https://www.cnpd.pt/'
        }
      },
      {
        title: '8. Changes to this policy',
        paragraphs: [
          'This policy may be updated whenever there are changes to the website, the services used or applicable legislation.'
        ]
      }
    ]
  }
}

export default function Privacidade() {
  const { language } = useLanguage()
  const content = policyContent[language]

  useSeo({
    title: content.seoTitle,
    description: content.seoDescription,
    canonicalPath: '/privacidade'
  })

  return (
    <div className="privacy-page">
      <header className="privacy-page__hero">
        <span className="privacy-page__tag">{content.tag}</span>
        <h1>{content.title}</h1>
        <p>{content.intro}</p>
      </header>

      <article className="privacy-page__content">
        {content.sections.map(section => (
          <section key={section.title} className="privacy-page__section">
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.link && (
              <a href={section.link.href} target="_blank" rel="noopener noreferrer">
                {section.link.label}
              </a>
            )}
          </section>
        ))}
        <p className="privacy-page__updated">{content.updated}</p>
      </article>
    </div>
  )
}
