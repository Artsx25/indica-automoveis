// src/pages/InventoryPage.tsx
import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { vehicleRepository } from '@/domain/vehicle.repository'
import { buildInventoryFacets } from '@/lib/filterFacets'
import { useInventoryFilters } from '@/hooks/useInventoryFilters'
import { useWhatsAppLead } from '@/hooks/useWhatsAppLead'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { VehicleCard } from '@/components/vehicle/VehicleCard'
import { MetaTags } from '@/components/seo/MetaTags'
import { track } from '@/lib/analytics'
import { TRANSMISSION_LABELS, FUEL_LABELS, BODY_TYPE_LABELS } from '@/domain/vehicle.types'
import type { Vehicle } from '@/domain/vehicle.types'
import type { InventoryFilters } from '@/hooks/useInventoryFilters'
import { Select } from '@/components/ui/Select'
import styles from './InventoryPage.module.css'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Destaques' },
  { value: 'newest', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'mileage_asc', label: 'Menor km' },
  { value: 'year_desc', label: 'Mais novos' },
]

export default function InventoryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { getNoResultsUrl } = useWhatsAppLead()

  useEffect(() => {
    vehicleRepository.getAll().then(setVehicles)
  }, [])

  const facets = useMemo(() => buildInventoryFacets(vehicles), [vehicles])
  const {
    filters,
    filteredVehicles,
    activeFilterCount,
    filtersSummary,
    updateFilter,
    clearFilters,
  } = useInventoryFilters(vehicles)

  useEffect(() => {
    track('search_inventory', { results: filteredVehicles.length })
    if (filteredVehicles.length === 0 && activeFilterCount > 0) {
      track('no_results', { filters: filtersSummary })
    }
  }, [filteredVehicles.length, activeFilterCount, filtersSummary])

  const noResultsUrl = getNoResultsUrl(filtersSummary)

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips: { key: keyof InventoryFilters; label: string }[] = []
    if (filters.make) chips.push({ key: 'make', label: `Marca: ${filters.make}` })
    if (filters.model) chips.push({ key: 'model', label: `Modelo: ${filters.model}` })
    if (filters.bodyType) chips.push({ key: 'bodyType', label: BODY_TYPE_LABELS[filters.bodyType as keyof typeof BODY_TYPE_LABELS] ?? filters.bodyType })
    if (filters.transmission) chips.push({ key: 'transmission', label: TRANSMISSION_LABELS[filters.transmission as keyof typeof TRANSMISSION_LABELS] ?? filters.transmission })
    if (filters.fuel) chips.push({ key: 'fuel', label: FUEL_LABELS[filters.fuel as keyof typeof FUEL_LABELS] ?? filters.fuel })
    if (filters.yearMin) chips.push({ key: 'yearMin', label: `De ${filters.yearMin}` })
    if (filters.yearMax) chips.push({ key: 'yearMax', label: `Até ${filters.yearMax}` })
    if (filters.priceMin) chips.push({ key: 'priceMin', label: `De R$ ${Number(filters.priceMin).toLocaleString('pt-BR')}` })
    if (filters.priceMax) chips.push({ key: 'priceMax', label: `Até R$ ${Number(filters.priceMax).toLocaleString('pt-BR')}` })
    if (filters.mileageMax) chips.push({ key: 'mileageMax', label: `KM até ${Number(filters.mileageMax).toLocaleString('pt-BR')}` })
    if (filters.acceptsTradeIn) chips.push({ key: 'acceptsTradeIn', label: 'Aceita troca' })
    if (filters.financingAvailable) chips.push({ key: 'financingAvailable', label: 'Financiamento' })
    return chips
  }, [filters])

  return (
    <>
      <MetaTags
        title="Estoque de Veículos | Indica Automóveis"
        description={`${filteredVehicles.length} veículo(s) disponíveis na Indica Automóveis em São Paulo. Filtre por marca, modelo, preço, câmbio e mais. Financiamento disponível.`}
        canonical="/estoque"
      />

      {/* Mobile filter drawer overlay */}
      {isFilterOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsFilterOpen(false)} />
      )}

      <div className={styles.page}>
        {/* Sidebar */}
        <div className={`${styles.sidebarWrapper} ${isFilterOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>Filtros</h2>
            <button onClick={() => setIsFilterOpen(false)} className={styles.closeSidebar} aria-label="Fechar filtros">
              <X size={20} />
            </button>
          </div>
          <FilterSidebar
            filters={filters}
            facets={facets}
            onUpdateFilter={updateFilter}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {/* Main content */}
        <div className={styles.main}>
          {/* Top bar */}
          <div className={styles.topBar}>
            {/* Search */}
            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Buscar por marca, modelo, versão..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className={styles.searchInput}
                aria-label="Busca livre no estoque"
              />
              {filters.query && (
                <button className={styles.clearSearch} onClick={() => updateFilter('query', '')} aria-label="Limpar busca">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Mobile filter btn */}
            <button
              className={styles.filterBtn}
              onClick={() => setIsFilterOpen(true)}
              aria-label="Abrir filtros"
            >
              <SlidersHorizontal size={18} />
              Filtros
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>

            {/* Sort */}
            <div className={styles.sortWrapper}>
              <Select
                value={filters.sort}
                onChange={(val) => updateFilter('sort', val)}
                ariaLabel="Ordenar resultados"
                options={SORT_OPTIONS}
              />
            </div>
          </div>

          {/* Active chips */}
          {activeChips.length > 0 && (
            <div className={styles.chips}>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  className={styles.chip}
                  onClick={() => updateFilter(chip.key, '')}
                  aria-label={`Remover filtro: ${chip.label}`}
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button className={styles.clearAllChip} onClick={clearFilters}>
                Limpar tudo
              </button>
            </div>
          )}

          {/* Results count */}
          <div className={styles.resultsInfo}>
            <span>{filteredVehicles.length} veículo{filteredVehicles.length !== 1 ? 's' : ''} encontrado{filteredVehicles.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Grid */}
          {filteredVehicles.length > 0 ? (
            <div className={styles.grid}>
              {filteredVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          ) : (
            /* No results */
            <div className={styles.noResults}>
              <SlidersHorizontal size={48} className={styles.noResultsIcon} />
              <h2>Não encontramos um veículo com esses filtros.</h2>
              <p>Tente ajustar os filtros ou entre em contato — podemos ter o que você procura.</p>
              <div className={styles.noResultsActions}>
                <button className={styles.clearBtn} onClick={clearFilters}>
                  Limpar filtros
                </button>
                <a href="/estoque" className={styles.allStockBtn}>
                  Ver todo o estoque
                </a>
                <a
                  href={noResultsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waBtn}
                >
                  Falar com um vendedor
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
