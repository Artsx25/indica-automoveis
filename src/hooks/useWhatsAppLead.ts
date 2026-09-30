// src/hooks/useWhatsAppLead.ts
// Hook for building WhatsApp lead URLs with UTM context

import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { getStoredUTM } from './useUTM'
import type { Vehicle } from '@/domain/vehicle.types'

export function useWhatsAppLead() {
  function getUTM() {
    const stored = getStoredUTM()
    return {
      source: stored.utm_source,
      campaign: stored.utm_campaign,
    }
  }

  function getVehicleInquiryUrl(vehicle: Vehicle): string {
    return buildWhatsAppUrl({
      intent: 'vehicle_inquiry',
      vehicle,
      utm: getUTM(),
      currentUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }

  function getFinancingUrl(
    vehicle: Vehicle,
    data?: { downPayment?: string; term?: string; hasTradeIn?: boolean }
  ): string {
    return buildWhatsAppUrl({
      intent: 'financing',
      vehicle,
      financingData: data,
      utm: getUTM(),
      currentUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }

  function getTradeInUrl(
    vehicle: Vehicle,
    data?: { makeModel?: string; year?: string; mileage?: string }
  ): string {
    return buildWhatsAppUrl({
      intent: 'trade_in',
      vehicle,
      tradeInData: data,
      utm: getUTM(),
      currentUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }

  function getSoldVehicleUrl(vehicle: Vehicle): string {
    return buildWhatsAppUrl({
      intent: 'sold_vehicle',
      vehicle,
      utm: getUTM(),
    })
  }

  function getNoResultsUrl(filtersSummary: string): string {
    return buildWhatsAppUrl({
      intent: 'no_results',
      filtersSummary,
      utm: getUTM(),
    })
  }

  function getGeneralUrl(): string {
    return buildWhatsAppUrl({
      intent: 'general',
      utm: getUTM(),
    })
  }

  return {
    getVehicleInquiryUrl,
    getFinancingUrl,
    getTradeInUrl,
    getSoldVehicleUrl,
    getNoResultsUrl,
    getGeneralUrl,
  }
}
