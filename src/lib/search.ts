// src/lib/search.ts
// Text search engine with normalization (no accents, case-insensitive, multi-token)

import type { Vehicle } from '@/domain/vehicle.types'

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildSearchIndex(vehicle: Vehicle): string {
  return normalizeText(
    [
      vehicle.make,
      vehicle.model,
      vehicle.version,
      vehicle.title,
      vehicle.color,
      vehicle.fuel,
      vehicle.transmission,
      vehicle.bodyType,
      String(vehicle.yearManufacture),
      String(vehicle.yearModel),
      vehicle.engine ?? '',
    ].join(' ')
  )
}

export function searchVehicles(vehicles: Vehicle[], query: string): Vehicle[] {
  if (!query.trim()) return vehicles

  const tokens = normalizeText(query).split(' ').filter(Boolean)

  return vehicles.filter((vehicle) => {
    const index = buildSearchIndex(vehicle)
    return tokens.every((token) => index.includes(token))
  })
}
