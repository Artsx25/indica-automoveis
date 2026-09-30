// src/lib/filterFacets.ts
// Builds dynamic filter facets from the current inventory
// NEVER hardcode makes, models, years or any filter option here

import type { Vehicle } from '@/domain/vehicle.types'

export interface InventoryFacets {
  makes: string[]
  modelsByMake: Record<string, string[]>
  years: number[]
  minPrice: number
  maxPrice: number
  transmissions: string[]
  fuels: string[]
  bodyTypes: string[]
  colors: string[]
}

export function buildInventoryFacets(vehicles: Vehicle[]): InventoryFacets {
  const publishable = vehicles.filter((v) => v.status !== 'draft')

  const makes = [...new Set(publishable.map((v) => v.make))].sort()

  const modelsByMake: Record<string, string[]> = {}
  for (const make of makes) {
    modelsByMake[make] = [
      ...new Set(publishable.filter((v) => v.make === make).map((v) => v.model)),
    ].sort()
  }

  const years = [
    ...new Set([
      ...publishable.map((v) => v.yearManufacture),
      ...publishable.map((v) => v.yearModel),
    ]),
  ].sort((a, b) => b - a)

  const prices = publishable.map((v) => v.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  const transmissions = [...new Set(publishable.map((v) => v.transmission))].sort()
  const fuels = [...new Set(publishable.map((v) => v.fuel))].sort()
  const bodyTypes = [...new Set(publishable.map((v) => v.bodyType))].sort()
  const colors = [...new Set(publishable.map((v) => v.color))].sort()

  return {
    makes,
    modelsByMake,
    years,
    minPrice,
    maxPrice,
    transmissions,
    fuels,
    bodyTypes,
    colors,
  }
}

export function getAvailableModels(
  facets: InventoryFacets,
  selectedMake: string | null
): string[] {
  if (!selectedMake) {
    const allModels = Object.values(facets.modelsByMake).flat()
    return [...new Set(allModels)].sort()
  }
  return facets.modelsByMake[selectedMake] ?? []
}
