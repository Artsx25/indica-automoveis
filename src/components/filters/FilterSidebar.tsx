// src/components/filters/FilterSidebar.tsx
import { X } from 'lucide-react'
import type { InventoryFilters } from '@/hooks/useInventoryFilters'
import type { InventoryFacets } from '@/lib/filterFacets'
import { getAvailableModels } from '@/lib/filterFacets'
import { TRANSMISSION_LABELS, FUEL_LABELS, BODY_TYPE_LABELS } from '@/domain/vehicle.types'
import { formatCurrency } from '@/lib/format'
import { Select } from '@/components/ui/Select'
import styles from './FilterSidebar.module.css'

interface FilterSidebarProps {
  filters: InventoryFilters
  facets: InventoryFacets
  onUpdateFilter: (key: keyof InventoryFilters, value: string) => void
  onClear: () => void
  activeCount: number
}

export function FilterSidebar({
  filters,
  facets,
  onUpdateFilter,
  onClear,
  activeCount,
}: FilterSidebarProps) {
  const availableModels = getAvailableModels(facets, filters.make || null)

  return (
    <aside className={styles.sidebar} aria-label="Filtros do estoque">
      <div className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
        {activeCount > 0 && (
          <button className={styles.clearBtn} onClick={onClear} aria-label="Limpar todos os filtros">
            <X size={14} />
            Limpar ({activeCount})
          </button>
        )}
      </div>

      <div className={styles.filters}>
        {/* Marca */}
        <FilterGroup label="Marca">
          <Select
            value={filters.make || ''}
            onChange={(val) => onUpdateFilter('make', val)}
            ariaLabel="Filtrar por marca"
            options={[
              { value: '', label: 'Todas as marcas' },
              ...facets.makes.map((make) => ({ value: make, label: make }))
            ]}
          />
        </FilterGroup>

        {/* Modelo */}
        <FilterGroup label="Modelo">
          <Select
            value={filters.model || ''}
            onChange={(val) => onUpdateFilter('model', val)}
            ariaLabel="Filtrar por modelo"
            disabled={availableModels.length === 0}
            options={[
              { value: '', label: 'Todos os modelos' },
              ...availableModels.map((model) => ({ value: model, label: model }))
            ]}
          />
        </FilterGroup>

        {/* Preço */}
        <FilterGroup label="Faixa de preço">
          <div className={styles.rangeRow}>
            <input
              type="number"
              placeholder={formatCurrency(facets.minPrice)}
              value={filters.priceMin}
              onChange={(e) => onUpdateFilter('priceMin', e.target.value)}
              className={styles.input}
              min={0}
              aria-label="Preço mínimo"
            />
            <span className={styles.rangeSep}>até</span>
            <input
              type="number"
              placeholder={formatCurrency(facets.maxPrice)}
              value={filters.priceMax}
              onChange={(e) => onUpdateFilter('priceMax', e.target.value)}
              className={styles.input}
              min={0}
              aria-label="Preço máximo"
            />
          </div>
        </FilterGroup>

        {/* Ano */}
        <FilterGroup label="Ano">
          <div className={styles.rangeRow}>
            <Select
              value={filters.yearMin ? String(filters.yearMin) : ''}
              onChange={(val) => onUpdateFilter('yearMin', val)}
              ariaLabel="Ano mínimo"
              options={[
                { value: '', label: 'De' },
                ...facets.years.slice().reverse().map((year) => ({ value: String(year), label: String(year) }))
              ]}
            />
            <span className={styles.rangeSep}>a</span>
            <Select
              value={filters.yearMax ? String(filters.yearMax) : ''}
              onChange={(val) => onUpdateFilter('yearMax', val)}
              ariaLabel="Ano máximo"
              options={[
                { value: '', label: 'Até' },
                ...facets.years.map((year) => ({ value: String(year), label: String(year) }))
              ]}
            />
          </div>
        </FilterGroup>

        {/* Quilometragem */}
        <FilterGroup label="Quilometragem máxima">
          <Select
            value={filters.mileageMax ? String(filters.mileageMax) : ''}
            onChange={(val) => onUpdateFilter('mileageMax', val)}
            ariaLabel="Quilometragem máxima"
            options={[
              { value: '', label: 'Qualquer km' },
              { value: '20000', label: 'Até 20.000 km' },
              { value: '50000', label: 'Até 50.000 km' },
              { value: '80000', label: 'Até 80.000 km' },
              { value: '100000', label: 'Até 100.000 km' },
              { value: '150000', label: 'Até 150.000 km' },
              { value: '200000', label: 'Até 200.000 km' },
              { value: '350000', label: 'Até 350.000 km' },
            ]}
          />
        </FilterGroup>

        {/* Câmbio */}
        <FilterGroup label="Câmbio">
          <div className={styles.pills}>
            {Object.entries(TRANSMISSION_LABELS).map(([value, label]) => {
              if (!facets.transmissions.includes(value as never)) return null
              return (
                <button
                  key={value}
                  className={`${styles.pill} ${filters.transmission === value ? styles.pillActive : ''}`}
                  onClick={() => onUpdateFilter('transmission', filters.transmission === value ? '' : value)}
                  aria-pressed={filters.transmission === value}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </FilterGroup>

        {/* Combustível */}
        <FilterGroup label="Combustível">
          <div className={styles.pills}>
            {Object.entries(FUEL_LABELS).map(([value, label]) => {
              if (!facets.fuels.includes(value as never)) return null
              return (
                <button
                  key={value}
                  className={`${styles.pill} ${filters.fuel === value ? styles.pillActive : ''}`}
                  onClick={() => onUpdateFilter('fuel', filters.fuel === value ? '' : value)}
                  aria-pressed={filters.fuel === value}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </FilterGroup>

        {/* Carroceria */}
        <FilterGroup label="Carroceria">
          <div className={styles.pills}>
            {Object.entries(BODY_TYPE_LABELS).map(([value, label]) => {
              if (!facets.bodyTypes.includes(value as never)) return null
              return (
                <button
                  key={value}
                  className={`${styles.pill} ${filters.bodyType === value ? styles.pillActive : ''}`}
                  onClick={() => onUpdateFilter('bodyType', filters.bodyType === value ? '' : value)}
                  aria-pressed={filters.bodyType === value}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </FilterGroup>

        {/* Toggles */}
        <FilterGroup label="Condições">
          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={filters.acceptsTradeIn === 'true'}
                onChange={(e) => onUpdateFilter('acceptsTradeIn', e.target.checked ? 'true' : '')}
              />
              <span>Aceita troca</span>
            </label>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={filters.financingAvailable === 'true'}
                onChange={(e) => onUpdateFilter('financingAvailable', e.target.checked ? 'true' : '')}
              />
              <span>Financiamento disponível</span>
            </label>
          </div>
        </FilterGroup>
      </div>
    </aside>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.group}>
      <label className={styles.groupLabel}>{label}</label>
      {children}
    </div>
  )
}
