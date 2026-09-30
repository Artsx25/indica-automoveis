#!/usr/bin/env node
// scripts/prerender-vehicles.mjs
// After vite build, creates dist/veiculo/<slug>/index.html with SEO meta tags injected

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const indexHtml = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf-8')
const vehicles = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'vehicles.json'), 'utf-8'))
const siteUrl = process.env.VITE_SITE_URL || 'https://indicaautomoveis.vercel.app'

const publishable = vehicles.filter(v => v.status === 'available' || v.status === 'reserved')

let count = 0

for (const vehicle of publishable) {
  const slug = vehicle.slug
  const outDir = join(ROOT, 'dist', 'veiculo', slug)
  
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const canonical = `${siteUrl}/veiculo/${slug}`
  const ogImage = vehicle.coverImage ? `${siteUrl}${vehicle.coverImage}` : ''

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicle.title,
    description: vehicle.description,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.yearManufacture),
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: vehicle.mileageKm, unitCode: 'KMT' },
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'BRL',
      availability: vehicle.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'AutoDealer',
        name: 'Indica Automóveis',
        address: 'Av. Ragueb Chohfi, 441, São Paulo, SP, Brazil',
      },
    },
  })

  const metaHead = `
    <title>${vehicle.seo.title}</title>
    <meta name="description" content="${vehicle.seo.description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${vehicle.seo.title}" />
    <meta property="og:description" content="${vehicle.seo.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${vehicle.seo.title}" />
    <meta name="twitter:description" content="${vehicle.seo.description}" />
    <script type="application/ld+json">${jsonLd}<\/script>`

  const html = indexHtml
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[\s\S]*?>/i, '')
    .replace('</head>', `${metaHead}\n  </head>`)
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8')
  count++
}

console.log(`✅  Prerendered ${count} vehicle page(s) to dist/veiculo/\n`)
