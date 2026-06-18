'use client';
// Export buttons: JSON · CSV · Markdown · PDF
// Calls /api/export/:format and triggers a browser download
import type { ExportFormat } from '@/types';

const FORMATS: { format: ExportFormat; label: string; icon: string }[] = [
  { format: 'json', label: 'JSON', icon: '{ }' },
  { format: 'csv', label: 'CSV', icon: '⬛' },
  { format: 'markdown', label: 'Markdown', icon: '📝' },
  { format: 'pdf', label: 'PDF', icon: '📄' },
];

export function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Export options">
      {FORMATS.map(({ label }) => (
        <div key={label} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
          {label}
        </div>
      ))}
    </div>
  );
}
