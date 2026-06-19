'use client';
import { formatTime } from '@/lib/utils';
import type { WeatherData } from '@/types';

interface Props { data: WeatherData }

function getLocalTime(timezone: number): { time: string; date: string; offset: string } {
  const nowUtcMs = Date.now();
  const localMs = nowUtcMs + timezone * 1000;
  const d = new Date(localMs);
  const time = d.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const h = Math.floor(Math.abs(timezone) / 3600);
  const m = Math.floor((Math.abs(timezone) % 3600) / 60);
  const sign = timezone >= 0 ? '+' : '-';
  const offset = `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return { time, date, offset };
}

export function WeatherCard({ data }: Props) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
  const { time: timeStr, date: dateStr, offset } = getLocalTime(data.timezone);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 h-full flex flex-col justify-between min-h-[280px]"
      style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)' }}
    >
      {/* Decorative circle */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />

      {/* Location */}
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 text-blue-200 text-sm mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{data.location}{data.country ? `, ${data.country}` : ''}</span>
        </div>
        <p className="text-blue-100 text-xs">{dateStr}</p>
        <p className="text-blue-200 text-xs font-medium mt-0.5">🕐 {timeStr} <span className="text-blue-300/70">({offset})</span></p>
      </div>

      {/* Main temp + icon */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-7xl font-bold text-white leading-none tracking-tight">
            {Math.round(data.temperature)}<span className="text-4xl text-blue-200">°C</span>
          </p>
          <p className="text-blue-100 text-base mt-2 capitalize">{data.description}</p>
        </div>
        <img
          src={iconUrl}
          alt={data.condition}
          className="w-24 h-24 drop-shadow-2xl"
          loading="lazy"
        />
      </div>

      {/* Quick stats */}
      <div className="relative z-10 grid grid-cols-3 gap-3 mt-2">
        {[
          { label: 'Feels like', value: `${Math.round(data.feelsLike)}°C` },
          { label: 'Humidity', value: `${data.humidity}%` },
          { label: 'Wind', value: `${data.windSpeed} m/s` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/10 rounded-xl px-3 py-2 text-center">
            <p className="text-white font-semibold text-sm">{value}</p>
            <p className="text-blue-200 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
