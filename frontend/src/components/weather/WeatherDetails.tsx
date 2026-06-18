'use client';
import { formatTime } from '@/lib/utils';
import type { WeatherData } from '@/types';

interface Props { data: WeatherData }

const METRIC_ICON: Record<string, string> = {
  'Feels Like': '🌡️', Humidity: '💧', Wind: '💨', Pressure: '🧭',
  Visibility: '👁️', Clouds: '☁️', Sunrise: '🌅', Sunset: '🌇',
};

export function WeatherDetails({ data }: Props) {
  const metrics = [
    { label: 'Feels Like',  value: `${Math.round(data.feelsLike)}°C` },
    { label: 'Humidity',    value: `${data.humidity}%` },
    { label: 'Wind',        value: `${data.windSpeed} m/s` },
    { label: 'Pressure',    value: `${data.pressure} hPa` },
    { label: 'Visibility',  value: `${(data.visibility / 1000).toFixed(1)} km` },
    { label: 'Clouds',      value: `${data.cloudCoverage}%` },
    { label: 'Sunrise',     value: formatTime(data.sunrise) },
    { label: 'Sunset',      value: formatTime(data.sunset) },
  ];

  return (
    <div className="glass rounded-2xl p-6 h-full" aria-label="Detailed weather metrics">
      <h3 className="text-white font-semibold text-base mb-5">Weather Details</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white/5 hover:bg-white/8 transition-colors rounded-xl p-4 flex flex-col gap-2"
          >
            <span className="text-2xl" aria-hidden="true">{METRIC_ICON[label]}</span>
            <p className="text-white font-semibold text-sm leading-tight">{value}</p>
            <p className="text-slate-400 text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Coordinates */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500">
        <span>📍</span>
        <span>{data.latitude.toFixed(4)}°N, {data.longitude.toFixed(4)}°E</span>
      </div>
    </div>
  );
}
