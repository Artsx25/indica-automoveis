// src/lib/format.ts
// Formatting utilities for prices, mileage, dates

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatMileage(km: number): string {
  return km.toLocaleString('pt-BR') + ' km'
}

export function formatYear(year: number): string {
  return String(year)
}

export function formatYearRange(yearManufacture: number, yearModel: number): string {
  if (yearManufacture === yearModel) return String(yearManufacture)
  return `${yearManufacture}/${yearModel}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}
