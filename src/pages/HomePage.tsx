// src/pages/HomePage.tsx
import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ChevronRight, MessageCircle, Car, MapPin,
  Shield, DollarSign, RefreshCw, Phone, ExternalLink,
  Gauge, Award
} from 'lucide-react'
import { vehicleRepository } from '@/domain/vehicle.repository'
import { buildInventoryFacets, getAvailableModels } from '@/lib/filterFacets'
import { VehicleCard } from '@/components/vehicle/VehicleCard'
import { MetaTags } from '@/components/seo/MetaTags'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { business } from '@/config/business'
import { track } from '@/lib/analytics'
import { BODY_TYPE_LABELS } from '@/domain/vehicle.types'
import type { Vehicle } from '@/domain/vehicle.types'
import { Select } from '@/components/ui/Select'
import { InstagramCarousel } from '@/components/instagram/InstagramCarousel'
import styles from './HomePage.module.css'
import { getBrandLogoPath } from '@/lib/brandLogos'

export default function HomePage() {
  const navigate = useNavigate()
  const { getGeneralUrl, getFinancingUrl } = useWhatsAppLead()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchMake, setSearchMake] = useState('')
  const [searchModel, setSearchModel] = useState('')
  const [searchPriceMax, setSearchPriceMax] = useState('')

  useEffect(() => {
    vehicleRepository.getAll().then(setVehicles)
  }, [])

  const publishable = useMemo(
    () => vehicles.filter((v) => v.status === 'available' || v.status === 'reserved'),
    [vehicles]
  )

  const facets = useMemo(() => buildInventoryFacets(publishable), [publishable])
  const availableModels = useMemo(
    () => getAvailableModels(facets, searchMake || null),
    [facets, searchMake]
  )

  const featured = useMemo(() => publishable.filter((v) => v.featured).slice(0, 6), [publishable])

  // Body type groups with counts
  const bodyTypeGroups = useMemo(() => {
    const groups: { type: string; label: string; count: number }[] = []
    for (const [type, label] of Object.entries(BODY_TYPE_LABELS)) {
      const count = publishable.filter((v) => v.bodyType === type).length
      if (count > 0) groups.push({ type, label, count })
    }
    return groups.sort((a, b) => b.count - a.count)
  }, [publishable])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchMake) params.set('marca', searchMake)
    if (searchModel) params.set('modelo', searchModel)
    if (searchPriceMax) params.set('precoMax', searchPriceMax)
    track('search_inventory', { source: 'home_hero' })
    navigate(`/estoque${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <>
      <MetaTags
        title="Indica Automóveis | Estoque de Carros em São Paulo"
        description="Encontre o carro certo para você na Indica Automóveis. Estoque completo com financiamento e avaliação de troca. Fale direto com um vendedor pelo WhatsApp."
        canonical="/"
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.heroEyebrow}>São Paulo • Zona Leste</p>
          <h1 className={styles.heroTitle}>
            Encontre o carro<br />
            <span className={styles.heroAccent}>certo para você.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Consulte nosso estoque e fale direto com um vendedor pelo WhatsApp.
          </p>

          {/* Search form */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchFields}>
              <div className={styles.searchField}>
                <label htmlFor="hero-make" className={styles.fieldLabel}>Marca</label>
                <Select
                  id="hero-make"
                  ariaLabel="Filtrar por marca"
                  value={searchMake}
                  onChange={(val) => { setSearchMake(val); setSearchModel('') }}
                  options={[
                    { value: '', label: 'Qualquer marca' },
                    ...facets.makes.map((m) => ({ value: m, label: m }))
                  ]}
                />
              </div>
              <div className={styles.searchField}>
                <label htmlFor="hero-model" className={styles.fieldLabel}>Modelo</label>
                <Select
                  id="hero-model"
                  ariaLabel="Filtrar por modelo"
                  value={searchModel}
                  onChange={(val) => setSearchModel(val)}
                  disabled={availableModels.length === 0}
                  options={[
                    { value: '', label: 'Qualquer modelo' },
                    ...availableModels.map((m) => ({ value: m, label: m }))
                  ]}
                />
              </div>
              <div className={styles.searchField}>
                <label htmlFor="hero-price" className={styles.fieldLabel}>Preço até</label>
                <Select
                  id="hero-price"
                  ariaLabel="Filtrar por preço máximo"
                  value={searchPriceMax}
                  onChange={(val) => setSearchPriceMax(val)}
                  options={[
                    { value: '', label: 'Qualquer preço' },
                    { value: '50000', label: 'Até R$ 50.000' },
                    { value: '80000', label: 'Até R$ 80.000' },
                    { value: '100000', label: 'Até R$ 100.000' },
                    { value: '120000', label: 'Até R$ 120.000' },
                    { value: '150000', label: 'Até R$ 150.000' },
                    { value: '200000', label: 'Até R$ 200.000' },
                  ]}
                />
              </div>
            </div>
            <button type="submit" className={styles.searchBtn}>
              <Search size={20} />
              Buscar veículos
            </button>
          </form>

          <a
            href="/estoque"
            className={styles.heroSecondary}
            onClick={(e) => { e.preventDefault(); navigate('/estoque') }}
          >
            Ver todo o estoque ({publishable.length} veículos)
            <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* Marcas */}
      {facets.makes.length > 0 && (
        <section className={`${styles.section} ${styles.brandsSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Marcas disponíveis</h2>
            <div className={styles.brands}>
              {facets.makes.map((make) => {
                const count = publishable.filter((v) => v.make === make).length
                const logoPath = getBrandLogoPath(make)
                return (
                  <button
                    key={make}
                    className={styles.brandCard}
                    onClick={() => navigate(`/estoque?marca=${encodeURIComponent(make)}`)}
                    aria-label={`Ver ${count} veículo(s) ${make}`}
                  >
                    <div className={styles.brandLogoContainer}>
                      {logoPath ? (
                        <img
                          src={logoPath}
                          alt={`Logotipo ${make}`}
                          className={styles.brandLogoImg}
                          loading="lazy"
                        />
                      ) : (
                        <Car size={32} className={styles.brandIcon} />
                      )}
                    </div>
                    <span className={styles.brandName}>{make}</span>
                    <span className={styles.brandCount}>{count} {count === 1 ? 'veículo' : 'veículos'}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Destaques */}
      {featured.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Destaques</h2>
                <p className={styles.sectionSub}>Seleção especial do nosso estoque</p>
              </div>
              <button
                className={styles.seeAllBtn}
                onClick={() => navigate('/estoque?ordem=featured')}
              >
                Ver todos <ChevronRight size={16} />
              </button>
            </div>
            <div className={styles.vehicleGrid}>
              {featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          </div>
        </section>
      )}

      {/* Explore por tipo */}
      {bodyTypeGroups.length > 0 && (
        <section className={`${styles.section} ${styles.typesSection}`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Explore por tipo</h2>
            <div className={styles.types}>
              {bodyTypeGroups.map(({ type, label, count }) => (
                <button
                  key={type}
                  className={styles.typeCard}
                  onClick={() => navigate(`/estoque?carroceria=${type}`)}
                  aria-label={`Ver ${count} veículo(s) do tipo ${label}`}
                >
                  <span className={styles.typeLabel}>{label}</span>
                  <span className={styles.typeCount}>{count} {count === 1 ? 'veículo' : 'veículos'}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bloco de confiança */}
      <section className={`${styles.section} ${styles.trustSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Por que a Indica Automóveis?</h2>
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <Award className={styles.trustIcon} size={32} />
              <h3>Transparência em primeiro lugar</h3>
              <p>Informações completas e honestas sobre cada veículo do nosso estoque.</p>
            </div>
            <div className={styles.trustCard}>
              <Phone className={styles.trustIcon} size={32} />
              <h3>Atendimento humano</h3>
              <p>Fale com um vendedor real pelo WhatsApp. Sem robôs, sem demora.</p>
            </div>
            <div className={styles.trustCard}>
              <DollarSign className={styles.trustIcon} size={32} />
              <h3>Financiamento facilitado</h3>
              <p>Trabalhamos com as melhores condições de financiamento do mercado.</p>
            </div>
            <div className={styles.trustCard}>
              <RefreshCw className={styles.trustIcon} size={32} />
              <h3>Avaliação de troca</h3>
              <p>Avaliamos seu veículo atual e aplicamos no negócio.</p>
            </div>
            <div className={styles.trustCard}>
              <Shield className={styles.trustIcon} size={32} />
              <h3>Estoque verificado</h3>
              <p>Todos os veículos passam por avaliação antes de entrar no nosso estoque.</p>
            </div>
            <div className={styles.trustCard}>
              <Gauge className={styles.trustIcon} size={32} />
              <h3>Experiência comprovada</h3>
              <p>Anos de atuação no mercado automotivo de São Paulo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Financiamento */}
      <section className={`${styles.section} ${styles.financingSection}`}>
        <div className="container">
          <div className={styles.financingContent}>
            <div className={styles.financingText}>
              <h2>Quer saber como pode ficar sua parcela?</h2>
              <p>Simulamos as melhores condições do mercado para você. Sem compromisso, sem burocracia.</p>
              <a
                href={getFinancingUrl({ make: '', model: '', title: '', price: 0 } as unknown as Vehicle)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.financingBtn}
                onClick={() => {
                  track('click_financing', { location: 'home' })
                  navigate('/financiamento')
                }}
              >
                Fazer uma simulação
                <ChevronRight size={18} />
              </a>
            </div>
            <div className={styles.financingIllustration}>
              <DollarSign size={80} />
            </div>
          </div>
        </div>
      </section>

      {/* Troca */}
      <section className={`${styles.section} ${styles.tradeSection}`}>
        <div className="container">
          <div className={styles.tradeContent}>
            <div className={styles.tradeText}>
              <h2>Tem um carro na troca?</h2>
              <p>Avaliamos seu veículo atual com transparência. Venha conversar com a gente.</p>
              <button
                className={styles.tradeBtn}
                onClick={() => { track('click_trade_in', { location: 'home' }); navigate('/venda-seu-carro') }}
              >
                Avaliar meu veículo
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Carousel */}
      <InstagramCarousel />

      {/* Localização */}
      <section className={`${styles.section} ${styles.locationSection}`}>
        <div className="container">
          <div className={styles.locationContent}>
            <MapPin size={28} className={styles.locationIcon} />
            <div>
              <h2>Onde nos encontrar</h2>
              <p className={styles.locationAddress}>{business.address}</p>
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.locationBtn}
              >
                Como chegar
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
          <div className={styles.locationWhatsapp}>
            <MessageCircle size={20} />
            <p>Prefere falar antes de visitar?</p>
            <a href={getGeneralUrl()} target="_blank" rel="noopener noreferrer" className={styles.locationWaBtn}>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
