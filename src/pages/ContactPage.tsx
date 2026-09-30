// src/pages/ContactPage.tsx
import { MessageCircle, MapPin, ExternalLink, Navigation } from 'lucide-react'
import { MetaTags } from '@/components/seo/MetaTags'
import { business } from '@/config/business'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { track } from '@/lib/analytics'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const { getGeneralUrl } = useWhatsAppLead()

  return (
    <>
      <MetaTags
        title="Contato e Localização | Indica Automóveis"
        description="Entre em contato com a Indica Automóveis ou venha visitar nosso showroom na Av. Ragueb Chohfi, 441 - São Paulo. WhatsApp, Instagram e Mapa."
        canonical="/contato"
      />

      <div className={styles.page}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Atendimento Exclusivo</span>
          <h1 className={styles.title}>Entre em Contato</h1>
          <p className={styles.subtitle}>
            Estamos prontos para atender você com agilidade e transparência. Visite nosso showroom presencial ou fale com nossos consultores pelos canais digitais.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <MessageCircle size={28} className={styles.cardIcon} />
            </div>
            <h2>WhatsApp</h2>
            <p>{business.whatsappDisplay}</p>
            <a
              href={getGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btn}
              onClick={() => track('click_whatsapp', { location: 'contact_page' })}
            >
              Falar no WhatsApp
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <ExternalLink size={28} className={styles.cardIcon} />
            </div>
            <h2>Instagram</h2>
            <p>{business.instagramHandle}</p>
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              Seguir no Instagram
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconCircle}>
              <MapPin size={28} className={styles.cardIcon} />
            </div>
            <h2>Nosso Endereço</h2>
            <p>{business.address}</p>
            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              Ver Rotas no Maps
            </a>
          </div>
        </div>

        {/* Storefront Photo & Interactive Map Grid */}
        <section className={styles.storeSection} aria-label="Loja e Localização">
          <div className={styles.storeGrid}>
            {/* Storefront Photo Card */}
            <div className={styles.storeCard}>
              <div className={styles.storeImgWrapper}>
                <img
                  src="/images/loja-fachada.jpg"
                  alt="Fachada e showroom da Indica Automóveis"
                  className={styles.storeImg}
                  loading="lazy"
                />
                <span className={styles.storeBadge}>Showroom Presencial</span>
              </div>
              <div className={styles.storeBody}>
                <h2>Venha nos Visitar</h2>
                <div className={styles.storeAddress}>
                  <MapPin size={18} className={styles.pinIcon} />
                  <span>{business.address}</span>
                </div>
                <p className={styles.storeDesc}>
                  Venha conhecer de perto nosso estoque com veículos criteriosamente periciados, espaço climatizado e atendimento humanizado para encontrar o carro ideal para você.
                </p>
                <div className={styles.storeFeatures}>
                  <span className={styles.storeFeature}>✓ Veículos 100% Periciados</span>
                  <span className={styles.storeFeature}>✓ Financiamento Sem Entrada</span>
                  <span className={styles.storeFeature}>✓ Melhor Avaliação do Usado</span>
                  <span className={styles.storeFeature}>✓ Atendimento VIP</span>
                </div>
              </div>
            </div>

            {/* Google Maps Embed Card */}
            <div className={styles.mapCard}>
              <div className={styles.mapHeader}>
                <div className={styles.mapHeaderInfo}>
                  <h3>Localização no Google Maps</h3>
                  <span>{business.address}</span>
                </div>
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  <Navigation size={14} />
                  Como Chegar
                </a>
              </div>
              <div className={styles.mapFrameWrapper}>
                <iframe
                  title="Localização da Indica Automóveis no Google Maps"
                  src="https://maps.google.com/maps?q=Av.+Ragueb+Chohfi,+441+-+Parque+Boa+Esperan%C3%A7a,+S%C3%A3o+Paulo+-+SP&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className={styles.mapFrame}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
