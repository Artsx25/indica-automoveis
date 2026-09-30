// src/config/analytics.ts
export const analyticsConfig = {
  ga4Id: import.meta.env.VITE_GA4_ID || '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  siteUrl: import.meta.env.VITE_SITE_URL || '',
}
