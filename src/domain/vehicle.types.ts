// src/domain/vehicle.types.ts
// Core types for the vehicle domain

export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'draft'

export type VehicleTransmission = 'automatic' | 'manual' | 'cvt' | 'semi-automatic'

export type VehicleFuel = 'flex' | 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'gas'

export type VehicleBodyType =
  | 'suv'
  | 'sedan'
  | 'hatchback'
  | 'pickup'
  | 'minivan'
  | 'coupe'
  | 'convertible'
  | 'wagon'
  | 'crossover'
  | 'motorcycle'
  | 'truck'

export type VehicleTraction = '4x2' | '4x4' | 'awd' | 'fwd' | 'rwd'

export interface VehicleSEO {
  title: string
  description: string
}

export interface Vehicle {
  id: string
  slug: string
  status: VehicleStatus
  featured: boolean
  createdAt: string
  updatedAt: string

  make: string
  model: string
  version: string
  title: string
  yearManufacture: number
  yearModel: number

  price: number
  mileageKm: number

  transmission: VehicleTransmission
  fuel: VehicleFuel
  bodyType: VehicleBodyType
  color: string
  doors?: number
  engine?: string
  traction?: VehicleTraction

  description: string
  highlights: string[]
  options: string[]

  acceptsTradeIn: boolean
  financingAvailable: boolean

  images: string[]
  coverImage: string

  seo: VehicleSEO
}

// Labels for display
export const TRANSMISSION_LABELS: Record<VehicleTransmission, string> = {
  automatic: 'Automático',
  manual: 'Manual',
  cvt: 'CVT',
  'semi-automatic': 'Semiautomático',
}

export const FUEL_LABELS: Record<VehicleFuel, string> = {
  flex: 'Flex',
  gasoline: 'Gasolina',
  diesel: 'Diesel',
  electric: 'Elétrico',
  hybrid: 'Híbrido',
  gas: 'GNV',
}

export const BODY_TYPE_LABELS: Record<VehicleBodyType, string> = {
  suv: 'SUV',
  sedan: 'Sedan',
  hatchback: 'Hatch',
  pickup: 'Picape',
  minivan: 'Minivan',
  coupe: 'Cupê',
  convertible: 'Conversível',
  wagon: 'Station Wagon',
  crossover: 'Crossover',
  motorcycle: 'Moto',
  truck: 'Caminhão',
}

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
  draft: 'Rascunho',
}
