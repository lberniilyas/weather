import { z } from 'zod';

export const createRecordSchema = z
  .object({
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    notes: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const updateRecordSchema = z.object({
  location: z.string().min(1, 'Location is required').optional(),
  startDate: z.string().min(1).optional(),
  endDate: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type CreateRecordFormValues = z.infer<typeof createRecordSchema>;
export type UpdateRecordFormValues = z.infer<typeof updateRecordSchema>;
