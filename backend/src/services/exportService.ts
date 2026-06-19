import type { WeatherRecord } from '@prisma/client';

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatUnixTime(unixSec: number | null | undefined, timezone: number | null | undefined): string {
  if (!unixSec) return '—';
  const offsetMs = (timezone ?? 0) * 1000;
  const localMs = unixSec * 1000 + offsetMs;
  const d = new Date(localMs);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function localTimeStr(timezone: number | null | undefined): string {
  if (timezone == null) return '—';
  const nowUtcMs = Date.now();
  const localMs = nowUtcMs + timezone * 1000;
  const d = new Date(localMs);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const offsetH = Math.floor(Math.abs(timezone) / 3600);
  const offsetM = Math.floor((Math.abs(timezone) % 3600) / 60);
  const sign = timezone >= 0 ? '+' : '-';
  return `${hh}:${mm} (UTC${sign}${String(offsetH).padStart(2,'0')}:${String(offsetM).padStart(2,'0')})`;
}

export function toJSON(records: WeatherRecord[]): string {
  return JSON.stringify(
    records.map((r) => ({
      id: r.id,
      location: r.location,
      latitude: r.latitude,
      longitude: r.longitude,
      localTime: localTimeStr(r.timezone),
      startDate: formatDate(r.startDate),
      endDate: formatDate(r.endDate),
      temperature: `${r.temperature}°C`,
      feelsLike: r.feelsLike != null ? `${r.feelsLike}°C` : '—',
      humidity: `${r.humidity}%`,
      windSpeed: r.windSpeed != null ? `${r.windSpeed} m/s` : '—',
      pressure: r.pressure != null ? `${r.pressure} hPa` : '—',
      visibility: r.visibility != null ? `${(r.visibility / 1000).toFixed(1)} km` : '—',
      cloudCoverage: r.cloudCoverage != null ? `${r.cloudCoverage}%` : '—',
      sunrise: formatUnixTime(r.sunrise, r.timezone),
      sunset: formatUnixTime(r.sunset, r.timezone),
      condition: r.condition,
      notes: r.notes ?? '',
      createdAt: r.createdAt.toISOString(),
    })),
    null,
    2
  );
}

export function toCSV(records: WeatherRecord[]): string {
  const headers = [
    'ID', 'Location', 'Local Time', 'Latitude', 'Longitude',
    'Start Date', 'End Date',
    'Temp (°C)', 'Feels Like (°C)', 'Humidity (%)',
    'Wind (m/s)', 'Pressure (hPa)', 'Visibility (km)', 'Cloud Cover (%)',
    'Sunrise (local)', 'Sunset (local)',
    'Condition', 'Notes', 'Saved At',
  ];
  const esc = (v: string | null | undefined) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const rows = records.map((r) =>
    [
      esc(r.id),
      esc(r.location),
      esc(localTimeStr(r.timezone)),
      r.latitude,
      r.longitude,
      esc(formatDate(r.startDate)),
      esc(formatDate(r.endDate)),
      r.temperature,
      r.feelsLike ?? '',
      r.humidity,
      r.windSpeed ?? '',
      r.pressure ?? '',
      r.visibility != null ? (r.visibility / 1000).toFixed(1) : '',
      r.cloudCoverage ?? '',
      esc(formatUnixTime(r.sunrise, r.timezone)),
      esc(formatUnixTime(r.sunset, r.timezone)),
      esc(r.condition),
      esc(r.notes),
      esc(r.createdAt.toISOString()),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function toMarkdown(records: WeatherRecord[]): string {
  const header =
    `# WeatherPro — Exported Records\n\n` +
    `**Export date:** ${new Date().toLocaleString('en-GB')}\n` +
    `**Total records:** ${records.length}\n\n`;

  const tableHeader =
    '| Location | Local Time | Start | End | Temp | Feels Like | Humidity | Wind | Pressure | Visibility | Cloud | Sunrise | Sunset | Condition | Notes |\n' +
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n';

  const rows = records
    .map((r) =>
      `| ${r.location} | ${localTimeStr(r.timezone)} | ${formatDate(r.startDate)} | ${formatDate(r.endDate)} | ${r.temperature}°C | ${r.feelsLike != null ? r.feelsLike + '°C' : '—'} | ${r.humidity}% | ${r.windSpeed != null ? r.windSpeed + ' m/s' : '—'} | ${r.pressure != null ? r.pressure + ' hPa' : '—'} | ${r.visibility != null ? (r.visibility / 1000).toFixed(1) + ' km' : '—'} | ${r.cloudCoverage != null ? r.cloudCoverage + '%' : '—'} | ${formatUnixTime(r.sunrise, r.timezone)} | ${formatUnixTime(r.sunset, r.timezone)} | ${r.condition} | ${r.notes ?? '—'} |`
    )
    .join('\n');

  return header + tableHeader + rows;
}
