// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { MetaTags } from '@/components/seo/MetaTags'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <>
      <MetaTags title="Página não encontrada | Indica Automóveis" description="A página que você procura não existe." noindex />
      <div className={styles.page}>
        <AlertTriangle size={64} className={styles.icon} />
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Página não encontrada</h2>
        <p className={styles.subtitle}>O link pode estar incorreto ou a página pode ter sido removida.</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeBtn}><ArrowLeft size={18} /> Voltar ao início</Link>
          <Link to="/estoque" className={styles.stockBtn}>Ver estoque</Link>
        </div>
      </div>
    </>
  )
}
