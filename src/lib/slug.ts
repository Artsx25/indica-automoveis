// src/lib/slug.ts
// Slug generation utilities

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateVehicleSlug(
  make: string,
  model: string,
  version: string,
  year: number
): string {
  const base = `${make} ${model} ${version} ${year}`
  return generateSlug(base)
}
