// src/pages/SellYourCarPage.tsx
import { useState } from 'react'
import { MessageCircle, RefreshCw } from 'lucide-react'
import { MetaTags } from '@/components/seo/MetaTags'
import { buildTradeInSellUrl } from '@/lib/whatsapp'
import { track } from '@/lib/analytics'
import styles from './SellYourCarPage.module.css'

export default function SellYourCarPage() {
  const [form, setForm] = useState({ makeModel: '', year: '', mileage: '', notes: '' })

  return (
    <>
      <MetaTags
        title="Venda seu Carro | Indica Automóveis"
        description="Avalie seu veículo para venda ou troca na Indica Automóveis. Transparência e agilidade no processo. Fale pelo WhatsApp."
        canonical="/venda-seu-carro"
      />
      <div className={styles.page}>
        <div className={styles.header}>
          <RefreshCw size={40} className={styles.icon} />
          <h1>Venda ou troque seu carro</h1>
          <p>Avaliamos seu veículo com transparência. Preencha os dados abaixo e vamos iniciar a conversa pelo WhatsApp.</p>
          <p className={styles.disclaimer}>Não prometemos valor de avaliação aqui — isso é feito pelo nosso consultor.</p>
        </div>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="sell-car">Marca e modelo</label>
            <input id="sell-car" type="text" placeholder="Ex: Honda Fit, Volkswagen Polo" className={styles.input}
              value={form.makeModel} onChange={(e) => setForm((f) => ({ ...f, makeModel: e.target.value }))} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="sell-year">Ano</label>
            <input id="sell-year" type="text" placeholder="Ex: 2019" className={styles.input}
              value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="sell-km">Quilometragem aproximada</label>
            <input id="sell-km" type="text" placeholder="Ex: 60.000 km" className={styles.input}
              value={form.mileage} onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="sell-notes">Observações (opcional)</label>
            <textarea id="sell-notes" placeholder="Estado do veículo, revisões, acessórios..." className={styles.textarea} rows={3}
              value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <a
            href={buildTradeInSellUrl(form)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
            onClick={() => track('click_trade_in', { location: 'sell_page' })}
          >
            <MessageCircle size={20} />
            Pedir avaliação no WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
