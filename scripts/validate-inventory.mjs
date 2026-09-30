#!/usr/bin/env node
// scripts/validate-inventory.mjs
// Validates vehicles.json against the Zod schema before build

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// We need to load Zod from the project's node_modules
const { z } = require('zod')

const vehiclesPath = join(__dirname, '../src/data/vehicles.json')
let vehicles

try {
  vehicles = JSON.parse(readFileSync(vehiclesPath, 'utf-8'))
} catch (err) {
  console.error('❌  Could not read vehicles.json:', err.message)
  process.exit(1)
}

const CURRENT_YEAR = new Date().getFullYear()

const VehicleSEOSchema = z.object({
  title: z.string().min(10).max(120),
  description: z.string().min(20).max(300),
})

const VehicleSchema = z.object({
  id: z.string().regex(/^veh_\d{4}$/, 'ID must match veh_XXXX'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  status: z.enum(['available', 'reserved', 'sold', 'draft']),
  featured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  make: z.string().min(1),
  model: z.string().min(1),
  version: z.string().min(1),
  title: z.string().min(5),
  yearManufacture: z.number().int().min(1990).max(CURRENT_YEAR + 1),
  yearModel: z.number().int().min(1990).max(CURRENT_YEAR + 2),
  price: z.number().positive(),
  mileageKm: z.number().int().nonnegative(),
  transmission: z.enum(['automatic', 'manual', 'cvt', 'semi-automatic']),
  fuel: z.enum(['flex', 'gasoline', 'diesel', 'electric', 'hybrid', 'gas']),
  bodyType: z.enum(['suv', 'sedan', 'hatchback', 'pickup', 'minivan', 'coupe', 'convertible', 'wagon', 'crossover', 'motorcycle', 'truck']),
  color: z.string().min(1),
  doors: z.number().int().min(0).max(5).optional(),
  engine: z.string().optional(),
  traction: z.enum(['4x2', '4x4', 'awd', 'fwd', 'rwd']).optional(),
  description: z.string().min(20),
  highlights: z.array(z.string()),
  options: z.array(z.string()),
  acceptsTradeIn: z.boolean(),
  financingAvailable: z.boolean(),
  images: z.array(z.string()).min(1),
  coverImage: z.string().min(1),
  seo: VehicleSEOSchema,
})

const InventorySchema = z.array(VehicleSchema).superRefine((vehicles, ctx) => {
  const ids = vehicles.map(v => v.id)
  const slugs = vehicles.map(v => v.slug)

  const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx)
  if (dupIds.length > 0) {
    ctx.addIssue({ code: 'custom', message: `Duplicate IDs: ${[...new Set(dupIds)].join(', ')}` })
  }

  const dupSlugs = slugs.filter((slug, idx) => slugs.indexOf(slug) !== idx)
  if (dupSlugs.length > 0) {
    ctx.addIssue({ code: 'custom', message: `Duplicate slugs: ${[...new Set(dupSlugs)].join(', ')}` })
  }
})

const result = InventorySchema.safeParse(vehicles)

if (!result.success) {
  console.error('\n❌  vehicles.json validation FAILED:\n')
  for (const issue of result.error.issues) {
    const path = issue.path.join(' → ')
    console.error(`  • [${path || 'root'}] ${issue.message}`)
  }
  console.error('\nFix the above errors before building.\n')
  process.exit(1)
}

console.log(`✅  vehicles.json is valid — ${result.data.length} vehicle(s) loaded.\n`)
