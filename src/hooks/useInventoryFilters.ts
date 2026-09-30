// src/hooks/useInventoryFilters.ts
// Inventory filters with URL state persistence

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Vehicle } from '@/domain/vehicle.types'
import { searchVehicles } from '@/lib/search'
import { TRANSMISSION_LABELS, FUEL_LABELS, BODY_TYPE_LABELS } from '@/domain/vehicle.types'

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'mileage_asc'
  | 'year_desc'
  | 'featured'

export interface InventoryFilters {
  query: string
  make: string
  model: string
  yearMin: string
  yearMax: string
  priceMin: string
  priceMax: string
  mileageMax: string
  transmission: string
  fuel: string
  bodyType: string
  color: string
  acceptsTradeIn: string
  financingAvailable: string
  sort: SortOption
}

export const DEFAULT_FILTERS: InventoryFilters = {
  query: '',
  make: '',
  model: '',
  yearMin: '',
  yearMax: '',
  priceMin: '',
  priceMax: '',
  mileageMax: '',
  transmission: '',
  fuel: '',
  bodyType: '',
  color: '',
  acceptsTradeIn: '',
  financingAvailable: '',
  sort: 'featured',
}

function sortVehicles(vehicles: Vehicle[], sort: SortOption): Vehicle[] {
  const sorted = [...vehicles]
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'mileage_asc':
      return sorted.sort((a, b) => a.mileageKm - b.mileageKm)
    case 'year_desc':
      return sorted.sort((a, b) => b.yearManufacture - a.yearManufacture)
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured === b.featured) return 0
        return a.featured ? -1 : 1
      })
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }
}

export function useInventoryFilters(allVehicles: Vehicle[]) {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: InventoryFilters = useMemo(
    () => ({
      query: searchParams.get('q') ?? '',
      make: searchParams.get('marca') ?? '',
      model: searchParams.get('modelo') ?? '',
      yearMin: searchParams.get('anoMin') ?? '',
      yearMax: searchParams.get('anoMax') ?? '',
      priceMin: searchParams.get('precoMin') ?? '',
      priceMax: searchParams.get('precoMax') ?? '',
      mileageMax: searchParams.get('kmMax') ?? '',
      transmission: searchParams.get('cambio') ?? '',
      fuel: searchParams.get('combustivel') ?? '',
      bodyType: searchParams.get('carroceria') ?? '',
      color: searchParams.get('cor') ?? '',
      acceptsTradeIn: searchParams.get('troca') ?? '',
      financingAvailable: searchParams.get('financiamento') ?? '',
      sort: (searchParams.get('ordem') as SortOption) ?? 'featured',
    }),
    [searchParams]
  )

  const updateFilter = useCallback(
    (key: keyof InventoryFilters, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const paramMap: Record<keyof InventoryFilters, string> = {
            query: 'q',
            make: 'marca',
            model: 'modelo',
            yearMin: 'anoMin',
            yearMax: 'anoMax',
            priceMin: 'precoMin',
            priceMax: 'precoMax',
            mileageMax: 'kmMax',
            transmission: 'cambio',
            fuel: 'combustivel',
            bodyType: 'carroceria',
            color: 'cor',
            acceptsTradeIn: 'troca',
            financingAvailable: 'financiamento',
            sort: 'ordem',
          }
          const param = paramMap[key]
          if (value) {
            next.set(param, value)
          } else {
            next.delete(param)
          }
          // Reset model when make changes
          if (key === 'make') next.delete('modelo')
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const filteredVehicles = useMemo(() => {
    let result = allVehicles.filter(
      (v) => v.status === 'available' || v.status === 'reserved'
    )

    if (filters.query) {
      result = searchVehicles(result, filters.query)
    }
    if (filters.make) result = result.filter((v) => v.make === filters.make)
    if (filters.model) result = result.filter((v) => v.model === filters.model)
    if (filters.yearMin) result = result.filter((v) => Math.max(v.yearManufacture, v.yearModel) >= Number(filters.yearMin))
    if (filters.yearMax) result = result.filter((v) => Math.min(v.yearManufacture, v.yearModel) <= Number(filters.yearMax))
    if (filters.priceMin) result = result.filter((v) => v.price >= Number(filters.priceMin))
    if (filters.priceMax) result = result.filter((v) => v.price <= Number(filters.priceMax))
    if (filters.mileageMax) result = result.filter((v) => v.mileageKm <= Number(filters.mileageMax))
    if (filters.transmission) result = result.filter((v) => v.transmission === filters.transmission)
    if (filters.fuel) result = result.filter((v) => v.fuel === filters.fuel)
    if (filters.bodyType) result = result.filter((v) => v.bodyType === filters.bodyType)
    if (filters.color) result = result.filter((v) => v.color === filters.color)
    if (filters.acceptsTradeIn === 'true') result = result.filter((v) => v.acceptsTradeIn)
    if (filters.financingAvailable === 'true') result = result.filter((v) => v.financingAvailable)

    return sortVehicles(result, filters.sort)
  }, [allVehicles, filters])

  const activeFilterCount = useMemo(() => {
    const { sort, ...rest } = filters
    void sort
    return Object.values(rest).filter(Boolean).length
  }, [filters])

  const filtersSummary = useMemo(() => {
    const parts: string[] = []
    if (filters.make) parts.push(`Marca: ${filters.make}`)
    if (filters.model) parts.push(`Modelo: ${filters.model}`)
    if (filters.bodyType) parts.push(`Carroceria: ${BODY_TYPE_LABELS[filters.bodyType as keyof typeof BODY_TYPE_LABELS] ?? filters.bodyType}`)
    if (filters.transmission) parts.push(`Câmbio: ${TRANSMISSION_LABELS[filters.transmission as keyof typeof TRANSMISSION_LABELS] ?? filters.transmission}`)
    if (filters.fuel) parts.push(`Combustível: ${FUEL_LABELS[filters.fuel as keyof typeof FUEL_LABELS] ?? filters.fuel}`)
    if (filters.yearMin || filters.yearMax) {
      const range = [filters.yearMin, filters.yearMax].filter(Boolean).join(' a ')
      parts.push(`Ano: ${range}`)
    }
    if (filters.priceMax) parts.push(`Preço até: R$ ${Number(filters.priceMax).toLocaleString('pt-BR')}`)
    if (filters.mileageMax) parts.push(`KM máximo: ${Number(filters.mileageMax).toLocaleString('pt-BR')} km`)
    if (filters.query) parts.push(`Busca: "${filters.query}"`)
    return parts.join(', ') || 'Nenhum filtro aplicado'
  }, [filters])

  return {
    filters,
    filteredVehicles,
    activeFilterCount,
    filtersSummary,
    updateFilter,
    clearFilters,
  }
}
