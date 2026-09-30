// src/config/business.ts
// TODO_CONFIRM_ADDRESS: O endereço público indexado no Instagram apareceu como nº 439,
// mas o dado fornecido para este projeto é 441. Confirmar com a loja antes de publicar.

export const business = {
  name: 'Indica Automóveis',
  tagline: 'Realizando sonhos sobre rodas',
  whatsappDisplay: '(11) 98780-2814',
  whatsappE164: '5511987802814',
  instagram: 'https://www.instagram.com/indica.automoveis/',
  instagramHandle: '@indica.automoveis',
  address: 'Av. Ragueb Chohfi, 441, São Paulo, SP',
  addressGoogle: 'Av. Ragueb Chohfi, 441, São Paulo, SP, Brazil',
  addressNeedsConfirmation: true, // TODO_CONFIRM_ADDRESS
  city: 'São Paulo',
  state: 'SP',
  country: 'Brasil',
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Av.+Ragueb+Chohfi+441+São+Paulo',
} as const

export type BusinessConfig = typeof business
