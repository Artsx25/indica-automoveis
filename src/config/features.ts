// src/config/features.ts
// Feature flags for easy enable/disable of blocks

export const features = {
  financing: true,
  tradeIn: true,
  instagram: true,
  analytics: false,
  favorites: false,
  demoMode: import.meta.env.MODE === 'development',
} as const

export type Features = typeof features
