// src/components/whatsapp/WhatsAppFAB.tsx
import { useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { track } from '@/lib/analytics'
import styles from './WhatsAppFAB.module.css'

export function WhatsAppFAB() {
  const { getGeneralUrl } = useWhatsAppLead()
  const location = useLocation()

  // On vehicle detail pages, the page has its own sticky CTA bar on mobile
  if (location.pathname.startsWith('/veiculo/')) {
    return null
  }

  return (
    <a
      href={getGeneralUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fab}
      aria-label="Falar no WhatsApp"
      onClick={() => track('click_whatsapp', { location: 'fab' })}
    >
      <MessageCircle size={28} />
      <span className={styles.tooltip}>Falar no WhatsApp</span>
    </a>
  )
}
