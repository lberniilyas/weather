'use client';
// Table view of WeatherRecords with sortable columns, checkboxes, and action buttons
import type { WeatherRecord } from '@/types';

export function RecordTable({ records }: { records: WeatherRecord[] }) {
  void records;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full text-sm" />
    </div>
  );
}
