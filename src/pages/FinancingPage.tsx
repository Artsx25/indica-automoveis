// src/pages/FinancingPage.tsx
import { useState } from 'react'
import { MessageCircle, DollarSign, ChevronRight } from 'lucide-react'
import { MetaTags } from '@/components/seo/MetaTags'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { track } from '@/lib/analytics'
import { getStoredUTM } from '@/hooks/useUTM'
import { Select } from '@/components/ui/Select'
import styles from './FinancingPage.module.css'

export default function FinancingPage() {
  const [form, setForm] = useState({
    downPayment: '',
    term: '',
    hasTradeIn: false,
    vehicleInfo: '',
  })

  function buildUrl() {
    const utm = getStoredUTM()
    return buildWhatsAppUrl({
      intent: 'financing',
      vehicle: {
        title: form.vehicleInfo || 'Veículo a definir',
        price: 0,
        yearManufacture: 0,
        yearModel: 0,
        mileageKm: 0,
      } as never,
      financingData: {
        downPayment: form.downPayment,
        term: form.term,
        hasTradeIn: form.hasTradeIn,
      },
      utm: { source: utm.utm_source, campaign: utm.utm_campaign },
    })
  }

  return (
    <>
      <MetaTags
        title="Financiamento | Indica Automóveis"
        description="Simule seu financiamento na Indica Automóveis. Trabalhamos com as melhores condições do mercado. Fale com um consultor pelo WhatsApp."
        canonical="/financiamento"
      />
      <div className={styles.page}>
        <div className={styles.header}>
          <DollarSign size={40} className={styles.headerIcon} />
          <h1>Financiamento</h1>
          <p>Simule as condições e fale com um consultor pelo WhatsApp. Sem aprovação online — sem compromisso.</p>
        </div>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fin-vehicle">
              Qual veículo você tem interesse? (opcional)
            </label>
            <input
              id="fin-vehicle"
              type="text"
              placeholder="Ex: Jeep Renegade 2021"
              className={styles.input}
              value={form.vehicleInfo}
              onChange={(e) => setForm((f) => ({ ...f, vehicleInfo: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fin-down">
              Entrada aproximada (opcional)
            </label>
            <input
              id="fin-down"
              type="text"
              placeholder="Ex: R$ 20.000"
              className={styles.input}
              value={form.downPayment}
              onChange={(e) => setForm((f) => ({ ...f, downPayment: e.target.value }))}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fin-term">Prazo desejado</label>
            <Select
              id="fin-term"
              value={form.term}
              onChange={(val) => setForm((f) => ({ ...f, term: val }))}
              ariaLabel="Prazo desejado"
              options={[
                { value: '', label: 'Quero orientação' },
                { value: '12x', label: '12 meses' },
                { value: '24x', label: '24 meses' },
                { value: '36x', label: '36 meses' },
                { value: '48x', label: '48 meses' },
                { value: '60x', label: '60 meses' },
              ]}
            />
          </div>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={form.hasTradeIn}
              onChange={(e) => setForm((f) => ({ ...f, hasTradeIn: e.target.checked }))}
            />
            Tenho veículo na troca
          </label>
          <a
            href={buildUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
            onClick={() => track('click_financing', { location: 'financing_page' })}
          >
            <MessageCircle size={20} />
            Continuar no WhatsApp
            <ChevronRight size={18} />
          </a>
          <p className={styles.disclaimer}>
            Nenhum dado é armazenado. A simulação é apenas para montar sua consulta no WhatsApp.
          </p>
        </div>
      </div>
    </>
  )
}
