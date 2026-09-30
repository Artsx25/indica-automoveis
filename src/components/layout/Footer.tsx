// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom'
import { MessageCircle, ExternalLink, MapPin } from 'lucide-react'
import { business } from '@/config/business'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { track } from '@/lib/analytics'
import styles from './Footer.module.css'

const navGroups = [
  {
    title: 'Navegação',
    links: [
      { to: '/', label: 'Início' },
      { to: '/estoque', label: 'Estoque' },
      { to: '/financiamento', label: 'Financiamento' },
      { to: '/venda-seu-carro', label: 'Venda seu carro' },
    ],
  },
  {
    title: 'Institucional',
    links: [
      { to: '/sobre', label: 'Sobre nós' },
      { to: '/contato', label: 'Contato' },
      { to: '/politica-de-privacidade', label: 'Privacidade' },
    ],
  },
]

export function Footer() {
  const { getGeneralUrl } = useWhatsAppLead()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo} aria-label="Indica Automóveis">
              <img
                src="/images/logo.png"
                alt="Indica Automóveis"
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.tagline}>{business.tagline}</p>
            <div className={styles.contact}>
              <a
                href={getGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
                onClick={() => track('click_whatsapp', { location: 'footer' })}
              >
                <MessageCircle size={18} />
                <span>{business.whatsappDisplay}</span>
              </a>
              <a
                href={business.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <ExternalLink size={18} />
                <span>{business.instagramHandle}</span>
              </a>
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                <MapPin size={18} />
                <span>{business.address}</span>
              </a>
            </div>
          </div>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.title} className={styles.navGroup}>
              <h3 className={styles.navTitle}>{group.title}</h3>
              <ul className={styles.navList}>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.navLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA */}
          <div className={styles.ctaBlock}>
            <h3 className={styles.navTitle}>Fale conosco</h3>
            <p className={styles.ctaText}>
              Atendimento humano, sem robôs. Tire suas dúvidas direto com um vendedor.
            </p>
            <a
              href={getGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
              onClick={() => track('click_whatsapp', { location: 'footer_cta' })}
            >
              <MessageCircle size={18} />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} {business.name}. Todos os direitos reservados.
          </p>
          <p className={styles.demo}>
            Atendimento presencial e digital
          </p>
        </div>
      </div>
    </footer>
  )
}
