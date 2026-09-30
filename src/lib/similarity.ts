// src/lib/similarity.ts
// Scoring engine for finding similar vehicles

import type { Vehicle } from '@/domain/vehicle.types'

export function getSimilarVehicles(
  currentVehicle: Vehicle,
  inventory: Vehicle[],
  limit = 4
): Vehicle[] {
  const candidates = inventory.filter(
    (v) =>
      v.id !== currentVehicle.id &&
      v.status !== 'draft' &&
      v.status !== 'sold'
  )

  const scored = candidates.map((vehicle) => {
    let score = 0

    if (vehicle.make === currentVehicle.make) score += 5
    if (vehicle.model === currentVehicle.model) score += 5
    if (vehicle.bodyType === currentVehicle.bodyType) score += 4

    const priceDiff = Math.abs(vehicle.price - currentVehicle.price)
    const priceRatio = priceDiff / currentVehicle.price
    if (priceRatio <= 0.2) score += 3

    const yearDiff = Math.abs(vehicle.yearManufacture - currentVehicle.yearManufacture)
    if (yearDiff <= 2) score += 2

    if (vehicle.fuel === currentVehicle.fuel) score += 1

    return { vehicle, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.vehicle)
}
