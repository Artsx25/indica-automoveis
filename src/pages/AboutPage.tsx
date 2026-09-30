// src/pages/AboutPage.tsx
import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Shield, Award, Phone } from 'lucide-react'
import { MetaTags } from '@/components/seo/MetaTags'
import { business } from '@/config/business'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const { getGeneralUrl } = useWhatsAppLead()
  return (
    <>
      <MetaTags title="Sobre nós | Indica Automóveis" description="Conheça a Indica Automóveis, sua loja de veículos em São Paulo com transparência e atendimento humano." canonical="/sobre" />
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1>Sobre a Indica Automóveis</h1>
          <p>{business.tagline}</p>
        </div>
        <div className={styles.content}>
          <div className={styles.block}>
            <h2>Quem somos</h2>
            <p>A Indica Automóveis é uma loja de veículos seminovos e usados localizada em São Paulo, Zona Leste. Trabalhamos com transparência e foco em proporcionar a melhor experiência de compra para nossos clientes.</p>
            <p>Acreditamos que comprar um carro deve ser um momento de realização — não de incerteza. Por isso, nos comprometemos com informações claras, atendimento humano e processos descomplicados.</p>
          </div>
          <div className={styles.values}>
            <div className={styles.value}><Shield size={28} className={styles.valueIcon} /><h3>Transparência</h3><p>Informações honestas sobre cada veículo do nosso estoque.</p></div>
            <div className={styles.value}><Phone size={28} className={styles.valueIcon} /><h3>Atendimento humano</h3><p>Fale com um vendedor real, sem robôs ou formulários intermináveis.</p></div>
            <div className={styles.value}><Award size={28} className={styles.valueIcon} /><h3>Experiência</h3><p>Anos de atuação no mercado automotivo de São Paulo.</p></div>
          </div>
          <div className={styles.block}>
            <h2>Nossa localização</h2>
            <div className={styles.address}><MapPin size={20} className={styles.addressIcon} /><span>{business.address}</span></div>
            <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapBtn}>Ver no mapa</a>
          </div>
          <div className={styles.ctas}>
            <Link to="/estoque" className={styles.stockBtn}>Ver estoque</Link>
            <a href={getGeneralUrl()} target="_blank" rel="noopener noreferrer" className={styles.waBtn}><MessageCircle size={18} />Falar no WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  )
}
