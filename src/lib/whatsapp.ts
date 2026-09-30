// src/lib/whatsapp.ts
// Centralized WhatsApp URL builder — NEVER spread URLs across components

import { business } from '@/config/business'
import type { Vehicle } from '@/domain/vehicle.types'
import { formatCurrency, formatMileage, formatYearRange } from './format'

interface WhatsAppParams {
  intent:
    | 'general'
    | 'vehicle_inquiry'
    | 'financing'
    | 'trade_in'
    | 'no_results'
    | 'sold_vehicle'
  vehicle?: Vehicle
  financingData?: {
    downPayment?: string
    term?: string
    hasTradeIn?: boolean
  }
  tradeInData?: {
    makeModel?: string
    year?: string
    mileage?: string
  }
  utm?: {
    source?: string
    campaign?: string
  }
  filtersSummary?: string
  currentUrl?: string
}

function getVehicleInfo(vehicle: Vehicle): string {
  return [
    `🚗 ${vehicle.title}`,
    `📅 ${formatYearRange(vehicle.yearManufacture, vehicle.yearModel)}`,
    `🛣️ ${formatMileage(vehicle.mileageKm)}`,
    `💰 ${formatCurrency(vehicle.price)}`,
  ].join('\n')
}

function getUtmSuffix(utm?: WhatsAppParams['utm']): string {
  if (!utm?.source && !utm?.campaign) return ''
  const parts = [utm.source, utm.campaign].filter(Boolean)
  return `\n\n_Ref: ${parts.join(' | ')}_`
}

export function buildWhatsAppUrl(params: WhatsAppParams): string {
  const { intent, vehicle, financingData, tradeInData, utm, filtersSummary, currentUrl } =
    params

  let message = ''
  const utmSuffix = getUtmSuffix(utm)

  switch (intent) {
    case 'vehicle_inquiry':
      if (!vehicle) break
      message = `Olá! Vi este veículo no site da Indica Automóveis e gostaria de mais informações:\n\n${getVehicleInfo(vehicle)}${currentUrl ? `\n\nLink: ${currentUrl}` : ''}\n\nEle ainda está disponível?${utmSuffix}`
      break

    case 'financing':
      if (!vehicle) break
      {
        const priceLine = vehicle.price > 0 ? `\n💰 Valor anunciado: ${formatCurrency(vehicle.price)}` : ''
        message = `Olá! Gostaria de fazer uma simulação de financiamento:\n\n🚗 ${vehicle.title}${priceLine}\n💵 Entrada aproximada: ${financingData?.downPayment || 'Não informado'}\n📆 Prazo desejado: ${financingData?.term || 'Não informado'}${financingData?.hasTradeIn ? '\n🔄 Tenho veículo na troca' : ''}${currentUrl ? `\n\nLink: ${currentUrl}` : ''}\n\nPodem me passar as opções?${utmSuffix}`
      }
      break

    case 'trade_in':
      if (!vehicle) break
      message = `Olá! Tenho interesse neste veículo e gostaria de avaliar meu carro na troca:\n\n🚗 Interesse: ${vehicle.title}\n\nMeu veículo:\nMarca/modelo: ${tradeInData?.makeModel || 'Não informado'}\nAno: ${tradeInData?.year || 'Não informado'}\nKM aproximada: ${tradeInData?.mileage || 'Não informado'}${currentUrl ? `\n\nLink do veículo: ${currentUrl}` : ''}${utmSuffix}`
      break

    case 'sold_vehicle':
      message = `Olá! Vi no site que o ${vehicle?.title || 'veículo'} foi vendido. Vocês têm outro parecido?${utmSuffix}`
      break

    case 'no_results':
      message = `Olá! Fiz uma busca no site da Indica Automóveis e não encontrei exatamente o que procuro.\n\nEstou buscando:\n${filtersSummary || 'Veículo não especificado'}\n\nVocês têm alguma opção parecida?${utmSuffix}`
      break

    case 'general':
    default:
      message = `Olá! Vim pelo site da Indica Automóveis e gostaria de falar com um vendedor.${utmSuffix}`
      break
  }

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${business.whatsappE164}?text=${encoded}`
}

export function buildTradeInSellUrl(data: {
  makeModel: string
  year: string
  mileage: string
  notes?: string
}): string {
  const message = `Olá! Gostaria de avaliar meu veículo para venda ou troca:\n\nMarca/modelo: ${data.makeModel}\nAno: ${data.year}\nKM aproximada: ${data.mileage}${data.notes ? `\nObservações: ${data.notes}` : ''}\n\nPodem fazer uma avaliação?`
  return `https://wa.me/${business.whatsappE164}?text=${encodeURIComponent(message)}`
}
