#!/usr/bin/env node
// scripts/generate-sitemap.mjs
// Generates public/sitemap.xml after build

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const vehicles = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'vehicles.json'), 'utf-8'))
const siteUrl = process.env.VITE_SITE_URL || 'https://indicaautomoveis.vercel.app'
const today = new Date().toISOString().split('T')[0]

const staticRoutes = [
  { url: '/', priority: '1.0', freq: 'daily' },
  { url: '/estoque', priority: '0.9', freq: 'daily' },
  { url: '/financiamento', priority: '0.7', freq: 'monthly' },
  { url: '/venda-seu-carro', priority: '0.7', freq: 'monthly' },
  { url: '/sobre', priority: '0.5', freq: 'monthly' },
  { url: '/contato', priority: '0.6', freq: 'monthly' },
]

// Include available and reserved; sold for a period; no draft
const vehicleRoutes = vehicles
  .filter(v => v.status === 'available' || v.status === 'reserved')
  .map(v => ({
    url: `/veiculo/${v.slug}`,
    priority: v.featured ? '0.85' : '0.8',
    freq: 'weekly',
    lastmod: v.updatedAt ? v.updatedAt.split('T')[0] : today,
  }))

const allRoutes = [...staticRoutes.map(r => ({ ...r, lastmod: today })), ...vehicleRoutes]

const urlEntries = allRoutes.map(r => `
  <url>
    <loc>${siteUrl}${r.url}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.freq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`

writeFileSync(join(ROOT, 'dist', 'sitemap.xml'), sitemap, 'utf-8')
console.log(`✅  sitemap.xml generated — ${allRoutes.length} URL(s)\n`)
