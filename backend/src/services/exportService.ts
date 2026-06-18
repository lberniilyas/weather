import type { WeatherRecord } from '@prisma/client';

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function toJSON(records: WeatherRecord[]): string {
  return JSON.stringify(
    records.map((r) => ({
      id: r.id,
      location: r.location,
      latitude: r.latitude,
      longitude: r.longitude,
      startDate: r.startDate,
      endDate: r.endDate,
      temperature: r.temperature,
      humidity: r.humidity,
      condition: r.condition,
      notes: r.notes,
      createdAt: r.createdAt,
    })),
    null,
    2
  );
}

export function toCSV(records: WeatherRecord[]): string {
  const headers = ['ID', 'Location', 'Latitude', 'Longitude', 'Start Date', 'End Date', 'Temperature (°C)', 'Humidity (%)', 'Condition', 'Notes', 'Created At'];
  const escape = (v: string | null | undefined) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const rows = records.map((r) =>
    [
      escape(r.id),
      escape(r.location),
      r.latitude,
      r.longitude,
      escape(formatDate(r.startDate)),
      escape(formatDate(r.endDate)),
      r.temperature,
      r.humidity,
      escape(r.condition),
      escape(r.notes),
      escape(r.createdAt.toISOString()),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function toMarkdown(records: WeatherRecord[]): string {
  const header = `# WeatherPro — Exported Records\n\n**Export date:** ${new Date().toLocaleString('en-GB')}\n**Total records:** ${records.length}\n\n`;

  const tableHeader = '| Location | Start | End | Temp (°C) | Humidity | Condition | Notes |\n|---|---|---|---|---|---|---|\n';

  const rows = records
    .map(
      (r) =>
        `| ${r.location} | ${formatDate(r.startDate)} | ${formatDate(r.endDate)} | ${r.temperature} | ${r.humidity}% | ${r.condition} | ${r.notes ?? '—'} |`
    )
    .join('\n');

  return header + tableHeader + rows;
}
