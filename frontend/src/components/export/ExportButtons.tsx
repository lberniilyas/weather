'use client';
import { useState } from 'react';
import apiClient from '@/lib/axios';
import type { WeatherRecord } from '@/types';

type Format = 'json' | 'csv' | 'markdown' | 'pdf';

const FORMATS: { format: Format; label: string; icon: string; desc: string }[] = [
  { format: 'json',     label: 'JSON',     icon: '{ }',  desc: 'Machine-readable data file' },
  { format: 'csv',      label: 'CSV',      icon: '⬛',   desc: 'Open in Excel or Sheets' },
  { format: 'markdown', label: 'Markdown', icon: '📝',   desc: 'Formatted markdown table' },
  { format: 'pdf',      label: 'PDF',      icon: '📄',   desc: 'Print-ready PDF report' },
];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function generatePDF(records: WeatherRecord[]) {
  // Dynamic import so jsPDF only loads when needed
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.default;
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'landscape' });
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text('WeatherPro — Records Export', 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on ${date} · ${records.length} records total`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [['Location', 'Start Date', 'End Date', 'Temp (°C)', 'Humidity (%)', 'Condition', 'Notes']],
    body: records.map((r) => [
      r.location,
      new Date(r.startDate).toLocaleDateString(),
      new Date(r.endDate).toLocaleDateString(),
      Math.round(r.temperature).toString(),
      r.humidity.toString(),
      r.condition,
      r.notes ?? '',
    ]),
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`weather-records-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function ExportButtons() {
  const [loading, setLoading] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: Format) => {
    setLoading(format);
    setError(null);

    try {
      if (format === 'pdf') {
        const { data } = await apiClient.get('/api/export/pdf-data');
        await generatePDF(data.data ?? []);
        return;
      }

      const mimeMap: Record<string, string> = {
        json: 'application/json',
        csv:  'text/csv',
        markdown: 'text/markdown',
      };

      const extMap: Record<string, string> = { json: 'json', csv: 'csv', markdown: 'md' };

      const resp = await apiClient.get(`/api/export/${format}`, { responseType: 'blob' });
      downloadBlob(
        new Blob([resp.data], { type: mimeMap[format] }),
        `weather-records-${new Date().toISOString().split('T')[0]}.${extMap[format]}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed. Make sure there are records to export.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="group" aria-label="Export options">
        {FORMATS.map(({ format, label, icon, desc }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={loading !== null}
            className="glass border border-white/10 hover:border-blue-400/30 hover:bg-white/8 disabled:opacity-50 disabled:cursor-wait rounded-2xl p-5 text-left flex flex-col gap-3 transition-all group"
            aria-label={`Export as ${label}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
              {loading === format && (
                <svg className="animate-spin w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
