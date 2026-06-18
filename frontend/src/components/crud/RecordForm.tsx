'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recordApi } from '@/services/recordApi';
import type { WeatherData, WeatherRecord } from '@/types';

const schema = z
  .object({
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    notes: z.string().max(1000).optional(),
  })
  .refine((d) => new Date(d.startDate) <= new Date(d.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['endDate'],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  record?: WeatherRecord;
  defaultLocation?: string;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-300 text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

const inputCls = 'bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-all';

export function RecordForm({ onSuccess, onCancel, record, defaultLocation }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      location: record?.location ?? defaultLocation ?? '',
      startDate: record ? new Date(record.startDate).toISOString().split('T')[0] : today,
      endDate: record ? new Date(record.endDate).toISOString().split('T')[0] : today,
      notes: record?.notes ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (record) {
        await recordApi.update(record.id, data);
      } else {
        await recordApi.create(data);
      }
      onSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save record';
      setError('root', { message: msg });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Field label="Location" error={errors.location?.message}>
        <input
          {...register('location')}
          className={inputCls}
          placeholder="e.g. Paris, Tokyo, 40.71,-74.00"
          aria-describedby={errors.location ? 'location-err' : undefined}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date" error={errors.startDate?.message}>
          <input type="date" {...register('startDate')} className={inputCls} />
        </Field>
        <Field label="End Date" error={errors.endDate?.message}>
          <input type="date" {...register('endDate')} className={inputCls} />
        </Field>
      </div>

      <Field label="Notes (optional)" error={errors.notes?.message}>
        <textarea
          {...register('notes')}
          rows={3}
          className={`${inputCls} resize-none`}
          placeholder="Additional notes about this record…"
        />
      </Field>

      {errors.root && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
          {errors.root.message}
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 glass border border-white/10 text-slate-300 hover:text-white rounded-xl text-sm transition-all">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20"
        >
          {isSubmitting ? 'Saving…' : record ? 'Save Changes' : 'Add Record'}
        </button>
      </div>
    </form>
  );
}
