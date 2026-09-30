// src/pages/VehicleDetailPage.tsx
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, X, ZoomIn,
  MessageCircle, DollarSign, RefreshCw,
  Calendar, Gauge, Settings, Fuel, Car, Palette, Hash, AlertTriangle
} from 'lucide-react'
import { vehicleRepository } from '@/domain/vehicle.repository'
import { getSimilarVehicles } from '@/lib/similarity'
import { formatCurrency, formatMileage, formatYearRange } from '@/lib/format'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { MetaTags } from '@/components/seo/MetaTags'
import { VehicleCard } from '@/components/vehicle/VehicleCard'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { track } from '@/lib/analytics'
import {
  TRANSMISSION_LABELS, FUEL_LABELS, BODY_TYPE_LABELS,
  type Vehicle
} from '@/domain/vehicle.types'
import styles from './VehicleDetailPage.module.css'

type FinancingData = { downPayment?: string; term?: string; hasTradeIn?: boolean }
type TradeInData = { makeModel?: string; year?: string; mileage?: string }

export default function VehicleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { getVehicleInquiryUrl, getFinancingUrl, getTradeInUrl, getSoldVehicleUrl } = useWhatsAppLead()

  const [vehicle, setVehicle] = useState<Vehicle | null | 'loading'>('loading')
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([])
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgError, setImgError] = useState<Set<number>>(new Set())
  const [showFinancingModal, setShowFinancingModal] = useState(false)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [financing, setFinancing] = useState<FinancingData>({})
  const [tradeIn, setTradeIn] = useState<TradeInData>({})

  useEffect(() => {
    vehicleRepository.getAll().then((vs) => {
      setAllVehicles(vs)
      const found = vs.find((v) => v.slug === slug) ?? null
      setVehicle(found)
      if (found) track('view_vehicle', { vehicle_id: found.id })
    })
  }, [slug])

  const similar = useMemo(() => {
    if (!vehicle || vehicle === 'loading') return []
    return getSimilarVehicles(vehicle, allVehicles, 4)
  }, [vehicle, allVehicles])

  const handleImgNav = useCallback((dir: 'prev' | 'next') => {
    if (!vehicle || vehicle === 'loading') return
    const total = vehicle.images.length
    setActiveImg((i) => dir === 'next' ? (i + 1) % total : (i - 1 + total) % total)
  }, [vehicle])

  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleImgNav('next')
      else handleImgNav('prev')
    }
    setTouchStartX(null)
  }

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') handleImgNav('prev')
      if (e.key === 'ArrowRight') handleImgNav('next')
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [lightboxOpen, handleImgNav])

  // Loading
  if (vehicle === 'loading') {
    return (
      <div className={styles.centered}>
        <div className={styles.spinner} />
      </div>
    )
  }

  // Not found
  if (!vehicle) {
    return (
      <div className={styles.notFound}>
        <AlertTriangle size={48} />
        <h1>Veículo não encontrado</h1>
        <p>Este veículo pode ter sido removido ou o link está incorreto.</p>
        <button onClick={() => navigate('/estoque')} className={styles.backBtn}>
          Ver estoque completo
        </button>
      </div>
    )
  }

  const isSold = vehicle.status === 'sold'
  const inquiryUrl = isSold ? getSoldVehicleUrl(vehicle) : getVehicleInquiryUrl(vehicle)
  const tradeInUrl = getTradeInUrl(vehicle, tradeIn)

  return (
    <>
      <MetaTags
        title={vehicle.seo.title}
        description={vehicle.seo.description}
        canonical={`/veiculo/${vehicle.slug}`}
        ogImage={vehicle.coverImage}
        noindex={vehicle.status === 'draft'}
      />

      {/* Sold banner */}
      {isSold && (
        <div className={styles.soldBanner}>
          <AlertTriangle size={20} />
          Este veículo já foi vendido. Veja opções semelhantes abaixo ou fale com um vendedor.
        </div>
      )}

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Navegação de migalha de pão">
          <Link to="/">Início</Link>
          <ChevronRight size={14} />
          <Link to="/estoque">Estoque</Link>
          <ChevronRight size={14} />
          <Link to={`/estoque?marca=${vehicle.make}`}>{vehicle.make}</Link>
          <ChevronRight size={14} />
          <span aria-current="page">{vehicle.model}</span>
        </nav>

        <div className={styles.layout}>
          {/* Left column */}
          <div className={styles.leftCol}>
            {/* Mobile Header: Make, Title, Version, Year, KM, Price */}
            <div className={styles.mobileHeader}>
              <div className={styles.vehicleMake}>{vehicle.make}</div>
              <h1 className={styles.mobileTitle}>{vehicle.title}</h1>
              <div className={styles.mobileSubtitle}>
                {vehicle.version ? `${vehicle.version} • ` : ''}
                {formatYearRange(vehicle.yearManufacture, vehicle.yearModel)} • {formatMileage(vehicle.mileageKm)}
              </div>
              <div className={styles.mobilePriceRow}>
                <div className={styles.price}>{formatCurrency(vehicle.price)}</div>
                {vehicle.status === 'reserved' && <Badge variant="reserved">Reservado</Badge>}
                {isSold && <Badge variant="sold">Vendido</Badge>}
              </div>
              {vehicle.financingAvailable && (
                <div className={styles.financingNote}>Financiamento disponível em até 60x</div>
              )}
            </div>

            {/* Gallery */}
            <div className={styles.gallery}>
              {/* Main image */}
              <div
                className={styles.mainImg}
                role="button"
                tabIndex={0}
                aria-label="Ampliar foto"
                onClick={() => { setLightboxOpen(true); track('open_gallery', { vehicle_id: vehicle.id }) }}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {imgError.has(activeImg) ? (
                  <div className={styles.imgPlaceholder}>
                    <Car size={48} />
                    <span>Foto indisponível</span>
                  </div>
                ) : (
                  <img
                    src={vehicle.images[activeImg]}
                    alt={`${vehicle.title} — foto ${activeImg + 1} de ${vehicle.images.length}`}
                    className={styles.mainImgEl}
                    onError={() => setImgError((s) => new Set([...s, activeImg]))}
                  />
                )}
                <div className={styles.imgCounter}>{activeImg + 1} / {vehicle.images.length}</div>
                <div className={styles.zoomHint}><ZoomIn size={16} /> Ampliar</div>

                {vehicle.images.length > 1 && (
                  <>
                    <button
                      className={`${styles.navBtn} ${styles.navPrev}`}
                      onClick={(e) => { e.stopPropagation(); handleImgNav('prev') }}
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className={`${styles.navBtn} ${styles.navNext}`}
                      onClick={(e) => { e.stopPropagation(); handleImgNav('next') }}
                      aria-label="Próxima foto"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {vehicle.images.length > 1 && (
                <div className={styles.thumbs} role="list">
                  {vehicle.images.map((img, i) => (
                    <button
                      key={i}
                      className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImg(i)}
                      aria-label={`Selecionar foto ${i + 1}`}
                      role="listitem"
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${i + 1}`}
                        loading="lazy"
                        onError={() => setImgError((s) => new Set([...s, i]))}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Actions directly under gallery */}
            <div className={styles.mobileActions}>
              {isSold ? (
                <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                  <MessageCircle size={20} />
                  Quero encontrar um parecido
                </a>
              ) : (
                <>
                  <a
                    href={inquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnPrimary}
                    onClick={() => track('click_whatsapp', { vehicle_id: vehicle.id, intent: 'inquiry' })}
                  >
                    <MessageCircle size={20} />
                    Falar com vendedor no WhatsApp
                  </a>
                  <div className={styles.mobileActionsRow}>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => { setShowFinancingModal(true); track('click_financing', { vehicle_id: vehicle.id }) }}
                    >
                      <DollarSign size={18} />
                      Simular financiamento
                    </button>
                    <button
                      className={styles.btnGhost}
                      onClick={() => { setShowTradeModal(true); track('click_trade_in', { vehicle_id: vehicle.id }) }}
                    >
                      <RefreshCw size={18} />
                      Avaliar troca
                    </button>
                  </div>
                </>
              )}
              <div className={styles.ctaMeta}>
                {vehicle.acceptsTradeIn && <span>✓ Aceita troca</span>}
                {vehicle.financingAvailable && <span>✓ Financiamento</span>}
                <span>Cód. {vehicle.id}</span>
              </div>
            </div>

            {/* Quick specs */}
            <div className={styles.quickSpecs}>
              <h2 className={styles.specsTitle}>Ficha rápida</h2>
              <div className={styles.specsGrid}>
                <SpecItem icon={<Calendar size={18} />} label="Ano" value={formatYearRange(vehicle.yearManufacture, vehicle.yearModel)} />
                <SpecItem icon={<Gauge size={18} />} label="Quilometragem" value={formatMileage(vehicle.mileageKm)} />
                <SpecItem icon={<Settings size={18} />} label="Câmbio" value={TRANSMISSION_LABELS[vehicle.transmission]} />
                <SpecItem icon={<Fuel size={18} />} label="Combustível" value={FUEL_LABELS[vehicle.fuel]} />
                <SpecItem icon={<Car size={18} />} label="Carroceria" value={BODY_TYPE_LABELS[vehicle.bodyType]} />
                <SpecItem icon={<Palette size={18} />} label="Cor" value={vehicle.color} />
                {vehicle.engine && <SpecItem icon={<Settings size={18} />} label="Motor" value={vehicle.engine} />}
                {vehicle.doors && <SpecItem icon={<Hash size={18} />} label="Portas" value={String(vehicle.doors)} />}
              </div>
            </div>

            {/* Highlights */}
            {vehicle.highlights.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Destaques</h2>
                <ul className={styles.highlights}>
                  {vehicle.highlights.map((h) => (
                    <li key={h} className={styles.highlight}>
                      <span className={styles.bullet} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Options */}
            {vehicle.options.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Opcionais</h2>
                <div className={styles.options}>
                  {vehicle.options.map((o) => (
                    <span key={o} className={styles.option}>{o}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Descrição</h2>
                <p className={styles.description}>{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Right col — sticky CTA */}
          <div className={styles.rightCol}>
            <div className={styles.ctaCard}>
              <div className={styles.ctaHeader}>
                <div className={styles.vehicleMake}>{vehicle.make}</div>
                <div className={styles.vehicleTitle}>{vehicle.title}</div>
                <div className={styles.vehicleVersion}>{vehicle.version}</div>
                <div className={styles.vehicleYear}>{formatYearRange(vehicle.yearManufacture, vehicle.yearModel)} • {formatMileage(vehicle.mileageKm)}</div>
              </div>

              <div className={styles.priceBlock}>
                {vehicle.status === 'reserved' && <Badge variant="reserved">Reservado</Badge>}
                {isSold && <Badge variant="sold">Vendido</Badge>}
                <div className={styles.price}>{formatCurrency(vehicle.price)}</div>
                {vehicle.financingAvailable && (
                  <div className={styles.financingNote}>Financiamento disponível</div>
                )}
              </div>

              <div className={styles.ctaActions}>
                {isSold ? (
                  <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                    <MessageCircle size={20} />
                    Quero encontrar um parecido
                  </a>
                ) : (
                  <>
                    <a
                      href={inquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnPrimary}
                      onClick={() => track('click_whatsapp', { vehicle_id: vehicle.id, intent: 'inquiry' })}
                    >
                      <MessageCircle size={20} />
                      Falar com vendedor
                    </a>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => { setShowFinancingModal(true); track('click_financing', { vehicle_id: vehicle.id }) }}
                    >
                      <DollarSign size={18} />
                      Fazer simulação
                    </button>
                    <button
                      className={styles.btnGhost}
                      onClick={() => { setShowTradeModal(true); track('click_trade_in', { vehicle_id: vehicle.id }) }}
                    >
                      <RefreshCw size={18} />
                      Tenho carro na troca
                    </button>
                  </>
                )}
              </div>

              <div className={styles.ctaMeta}>
                {vehicle.acceptsTradeIn && <span>✓ Aceita troca</span>}
                {vehicle.financingAvailable && <span>✓ Financiamento</span>}
                <span>Cód. {vehicle.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar vehicles */}
        {similar.length > 0 && (
          <section className={styles.similar}>
            <h2 className={styles.similarTitle}>Veículos semelhantes</h2>
            <div className={styles.similarGrid}>
              {similar.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky CTA */}
      <div className={styles.mobileCTA}>
        {isSold ? (
          <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.mobileBtnPrimary}>
            <MessageCircle size={18} />
            Quero um parecido
          </a>
        ) : (
          <>
            <a href={inquiryUrl} target="_blank" rel="noopener noreferrer" className={styles.mobileBtnPrimary}>
              <MessageCircle size={18} />
              Falar com vendedor
            </a>
            <button onClick={() => setShowFinancingModal(true)} className={styles.mobileBtnSecondary}>
              <DollarSign size={18} />
              Simular
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-label="Galeria de fotos"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button className={styles.lightboxClose} onClick={() => setLightboxOpen(false)} aria-label="Fechar galeria">
            <X size={28} />
          </button>
          <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={(e) => { e.stopPropagation(); handleImgNav('prev') }} aria-label="Foto anterior">
            <ChevronLeft size={32} />
          </button>
          <img
            src={vehicle.images[activeImg]}
            alt={`${vehicle.title} — foto ${activeImg + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={(e) => { e.stopPropagation(); handleImgNav('next') }} aria-label="Próxima foto">
            <ChevronRight size={32} />
          </button>
          <div className={styles.lightboxCounter}>{activeImg + 1} / {vehicle.images.length}</div>
        </div>
      )}

      {/* Financing Modal */}
      {showFinancingModal && (
        <div className={styles.modalOverlay} onClick={() => setShowFinancingModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Simulação de financiamento">
            <div className={styles.modalHeader}>
              <h2>Fazer simulação</h2>
              <button onClick={() => setShowFinancingModal(false)} aria-label="Fechar" className={styles.modalClose}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalVehicle}>{vehicle.title} — {formatCurrency(vehicle.price)}</p>
              <label className={styles.formLabel}>
                Entrada aproximada (opcional)
                <input
                  type="text"
                  placeholder="Ex: R$ 20.000"
                  className={styles.formInput}
                  value={financing.downPayment ?? ''}
                  onChange={(e) => setFinancing((f) => ({ ...f, downPayment: e.target.value }))}
                />
              </label>
              <div className={styles.formLabel}>
                <span>Prazo desejado</span>
                <Select
                  value={financing.term ?? ''}
                  onChange={(val) => setFinancing((f) => ({ ...f, term: val }))}
                  ariaLabel="Prazo desejado"
                  options={[
                    { value: '', label: 'Quero orientação' },
                    { value: '12x', label: '12x' },
                    { value: '24x', label: '24x' },
                    { value: '36x', label: '36x' },
                    { value: '48x', label: '48x' },
                    { value: '60x', label: '60x' },
                  ]}
                />
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={financing.hasTradeIn ?? false}
                  onChange={(e) => setFinancing((f) => ({ ...f, hasTradeIn: e.target.checked }))}
                />
                <span>Tenho veículo na troca</span>
              </label>
              <a
                href={getFinancingUrl(vehicle, financing)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalBtn}
                onClick={() => setShowFinancingModal(false)}
              >
                <MessageCircle size={18} />
                Continuar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Trade-in Modal */}
      {showTradeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTradeModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Avaliação de troca">
            <div className={styles.modalHeader}>
              <h2>Tenho carro na troca</h2>
              <button onClick={() => setShowTradeModal(false)} aria-label="Fechar" className={styles.modalClose}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalVehicle}>Interesse: {vehicle.title}</p>
              <label className={styles.formLabel}>
                Marca e modelo do seu veículo
                <input
                  type="text"
                  placeholder="Ex: Honda Fit"
                  className={styles.formInput}
                  value={tradeIn.makeModel ?? ''}
                  onChange={(e) => setTradeIn((t) => ({ ...t, makeModel: e.target.value }))}
                />
              </label>
              <label className={styles.formLabel}>
                Ano
                <input
                  type="text"
                  placeholder="Ex: 2019"
                  className={styles.formInput}
                  value={tradeIn.year ?? ''}
                  onChange={(e) => setTradeIn((t) => ({ ...t, year: e.target.value }))}
                />
              </label>
              <label className={styles.formLabel}>
                Quilometragem aproximada
                <input
                  type="text"
                  placeholder="Ex: 60.000 km"
                  className={styles.formInput}
                  value={tradeIn.mileage ?? ''}
                  onChange={(e) => setTradeIn((t) => ({ ...t, mileage: e.target.value }))}
                />
              </label>
              <a
                href={tradeInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalBtn}
                onClick={() => setShowTradeModal(false)}
              >
                <MessageCircle size={18} />
                Continuar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className={styles.specItem}>
      <span className={styles.specIcon}>{icon}</span>
      <div>
        <div className={styles.specLabel}>{label}</div>
        <div className={styles.specValue}>{value}</div>
      </div>
    </div>
  )
}
