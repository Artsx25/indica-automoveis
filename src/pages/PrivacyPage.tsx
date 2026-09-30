// src/pages/PrivacyPage.tsx
import { MetaTags } from '@/components/seo/MetaTags'
import { business } from '@/config/business'
import styles from './PrivacyPage.module.css'

export default function PrivacyPage() {
  return (
    <>
      <MetaTags title="Política de Privacidade | Indica Automóveis" description="Política de privacidade da Indica Automóveis." canonical="/politica-de-privacidade" noindex />
      <div className={styles.page}>
        <h1>Política de Privacidade</h1>
        <p className={styles.updated}>Última atualização: agosto de 2026</p>
        <div className={styles.content}>
          <h2>1. Informações coletadas</h2>
          <p>Este site é estático e não coleta dados pessoais automaticamente. Quando você inicia uma conversa pelo WhatsApp, os dados são tratados conforme a política de privacidade do WhatsApp/Meta.</p>
          <h2>2. Uso de dados</h2>
          <p>Não armazenamos dados financeiros, documentos pessoais ou informações sensíveis. As simulações de financiamento e avaliações de troca são apenas para iniciar conversas no WhatsApp.</p>
          <h2>3. Cookies</h2>
          <p>Este site pode usar parâmetros de sessão (como UTMs) armazenados no sessionStorage do navegador para atribuição de campanhas. Esses dados são temporários e não são enviados a servidores.</p>
          <h2>4. Contato</h2>
          <p>Para dúvidas sobre privacidade, entre em contato: {business.whatsappDisplay} | {business.instagramHandle}</p>
        </div>
      </div>
    </>
  )
}
