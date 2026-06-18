import { z } from 'zod';

export const createRecordSchema = z
  .object({
    location: z.string().min(1, 'Location is required').max(200),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    notes: z.string().max(1000).optional(),
  })
  .refine((d) => new Date(d.startDate) <= new Date(d.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  });

export const updateRecordSchema = z.object({
  location: z.string().min(1).max(200).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'location', 'temperature', 'startDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID required'),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type QueryInput = z.infer<typeof querySchema>;
