import { z } from 'zod';

export const createRecordSchema = z
  .object({
    location: z.string().min(1, 'Location is required'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    temperature: z.number(),
    humidity: z.number().min(0).max(100),
    condition: z.string().min(1),
    notes: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  });

export const updateRecordSchema = z.object({
  location: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(['createdAt', 'location', 'temperature', 'startDate'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().cuid()).min(1, 'At least one ID required'),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type QueryInput = z.infer<typeof querySchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
