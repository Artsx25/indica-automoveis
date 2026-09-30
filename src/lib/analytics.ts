// src/lib/analytics.ts
// Analytics adapter — noop by default, activates when IDs are configured

import { analyticsConfig } from '@/config/analytics'
import { features } from '@/config/features'

type AnalyticsEvent =
  | 'view_home'
  | 'search_inventory'
  | 'apply_filter'
  | 'view_vehicle'
  | 'click_vehicle_card'
  | 'click_whatsapp'
  | 'click_financing'
  | 'click_trade_in'
  | 'open_gallery'
  | 'no_results'

type EventPayload = Record<string, string | number | boolean | undefined>

export function track(event: AnalyticsEvent, payload?: EventPayload): void {
  if (!features.analytics) return

  // GA4
  if (analyticsConfig.ga4Id && typeof window !== 'undefined' && 'gtag' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).gtag('event', event, payload)
  }

  // Meta Pixel
  if (
    analyticsConfig.metaPixelId &&
    typeof window !== 'undefined' &&
    'fbq' in window
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).fbq('track', event, payload)
  }
}
