// src/lib/brandLogos.ts

const BRAND_LOGO_MAP: Record<string, string> = {
  chevrolet: '/images/brands/chevrolet.svg',
  ford: '/images/brands/ford.svg',
  honda: '/images/brands/honda.svg',
  jeep: '/images/brands/jeep.svg',
  toyota: '/images/brands/toyota.svg',
  volkswagen: '/images/brands/volkswagen.svg',
  vw: '/images/brands/volkswagen.svg',
  fiat: '/images/brands/fiat.svg',
  hyundai: '/images/brands/hyundai.svg',
  renault: '/images/brands/renault.svg',
  nissan: '/images/brands/nissan.svg',
  bmw: '/images/brands/bmw.svg',
  mercedes: '/images/brands/mercedes.svg',
  'mercedes-benz': '/images/brands/mercedes.svg',
  audi: '/images/brands/audi.svg',
  mitsubishi: '/images/brands/mitsubishi.svg',
  peugeot: '/images/brands/peugeot.svg',
  citroen: '/images/brands/citroen.svg',
  'citroën': '/images/brands/citroen.svg',
  triumph: '/images/brands/triumph.svg',
}

export function getBrandLogoPath(make: string): string | null {
  const normalized = make.trim().toLowerCase().replace(/\s+/g, '-')
  return BRAND_LOGO_MAP[normalized] || null
}
