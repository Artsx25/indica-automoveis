// src/domain/vehicle.schema.ts
// Zod schema for vehicle validation

import { z } from 'zod'

const CURRENT_YEAR = new Date().getFullYear()

export const VehicleSEOSchema = z.object({
  title: z.string().min(10).max(120),
  description: z.string().min(20).max(300),
})

export const VehicleSchema = z.object({
  id: z.string().regex(/^veh_\d{4}$/, 'ID must match pattern veh_XXXX'),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  status: z.enum(['available', 'reserved', 'sold', 'draft']),
  featured: z.boolean(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),

  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  version: z.string().min(1, 'Version is required'),
  title: z.string().min(5, 'Title is required'),
  yearManufacture: z.number().int().min(1990).max(CURRENT_YEAR + 1),
  yearModel: z.number().int().min(1990).max(CURRENT_YEAR + 2),

  price: z.number().positive('Price must be positive'),
  mileageKm: z.number().int().nonnegative('Mileage must be non-negative'),

  transmission: z.enum(['automatic', 'manual', 'cvt', 'semi-automatic']),
  fuel: z.enum(['flex', 'gasoline', 'diesel', 'electric', 'hybrid', 'gas']),
  bodyType: z.enum([
    'suv', 'sedan', 'hatchback', 'pickup', 'minivan',
    'coupe', 'convertible', 'wagon', 'crossover', 'motorcycle'
  ]),
  color: z.string().min(1, 'Color is required'),
  doors: z.number().int().min(0).max(5).optional(),
  engine: z.string().optional(),
  traction: z.enum(['4x2', '4x4', 'awd', 'fwd', 'rwd']).optional(),

  description: z.string().min(20, 'Description is required'),
  highlights: z.array(z.string()).min(0),
  options: z.array(z.string()).min(0),

  acceptsTradeIn: z.boolean(),
  financingAvailable: z.boolean(),

  images: z
    .array(z.string().min(1))
    .min(1, 'At least one image is required'),
  coverImage: z.string().min(1),

  seo: VehicleSEOSchema,
})

export type VehicleInput = z.input<typeof VehicleSchema>
export type Vehicle = z.output<typeof VehicleSchema>

export const InventorySchema = z
  .array(VehicleSchema)
  .superRefine((vehicles, ctx) => {
    const ids = vehicles.map((v) => v.id)
    const slugs = vehicles.map((v) => v.slug)

    // Check for duplicate IDs
    const dupIds = ids.filter((id, idx) => ids.indexOf(id) !== idx)
    if (dupIds.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate IDs found: ${[...new Set(dupIds)].join(', ')}`,
      })
    }

    // Check for duplicate slugs
    const dupSlugs = slugs.filter((slug, idx) => slugs.indexOf(slug) !== idx)
    if (dupSlugs.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate slugs found: ${[...new Set(dupSlugs)].join(', ')}`,
      })
    }
  })
