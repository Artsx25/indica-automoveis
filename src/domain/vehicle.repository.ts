// src/domain/vehicle.repository.ts
// Repository pattern - allows future swap to API/DB without changing pages

import type { Vehicle } from './vehicle.types'
import vehiclesData from '../data/vehicles.json'

// Public interface - pages should code against this
export interface VehicleRepository {
  getAll(): Promise<Vehicle[]>
  getBySlug(slug: string): Promise<Vehicle | null>
  getPublishable(): Promise<Vehicle[]>
}

// V1 implementation: local JSON
class LocalJsonVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[]

  constructor(data: Vehicle[]) {
    this.vehicles = data
  }

  async getAll(): Promise<Vehicle[]> {
    return this.vehicles
  }

  async getBySlug(slug: string): Promise<Vehicle | null> {
    return this.vehicles.find((v) => v.slug === slug) ?? null
  }

  async getPublishable(): Promise<Vehicle[]> {
    return this.vehicles.filter((v) => v.status !== 'draft')
  }
}

// Singleton export
export const vehicleRepository: VehicleRepository = new LocalJsonVehicleRepository(
  vehiclesData as Vehicle[]
)
