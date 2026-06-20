'use client';
import { useState, useEffect } from 'react';
import { getWeatherTheme, getTempColor } from '@/lib/weatherTheme';
import type { WeatherData } from '@/types';

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

async function fetchCityPhoto(city: string, country?: string): Promise<string | null> {
  const queries = [city, country ? `${city}, ${country}` : null].filter(Boolean) as string[];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`,
        { headers: { 'Api-User-Agent': 'WeatherPro/1.0' } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const url = data?.originalimage?.source ?? data?.thumbnail?.source ?? null;
      if (url) return url;
    } catch {
      continue;
    }
  }
  return null;
}

interface Props { data: WeatherData }

export function WeatherCard({ data }: Props) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
  const { time: timeStr, date: dateStr, offset } = getLocalTime(data.timezone);
  const theme = getWeatherTheme(data.condition);
  const tempColor = getTempColor(data.temperature);

  const [cityPhoto, setCityPhoto] = useState<string | null>(null);

  useEffect(() => {
    setCityPhoto(null);
    fetchCityPhoto(data.location, data.country).then(setCityPhoto);
  }, [data.location, data.country]);

  return (
    <div className="relative overflow-hidden rounded-2xl h-full flex flex-col justify-between min-h-[280px]">
      {/* City photo background */}
      {cityPhoto && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ backgroundImage: `url(${cityPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden="true"
        />
      )}

      {/* Gradient overlay: full card tint when no photo, bottom-heavy when photo is present */}
      <div
        className="absolute inset-0"
        style={{
          background: cityPhoto
            ? `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)`
            : theme.cardGradient,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
        {/* Location */}
        <div>
          <div className="flex items-center gap-1.5 text-white/70 text-sm mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{data.location}{data.country ? `, ${data.country}` : ''}</span>
          </div>
          <p className="text-white/80 text-xs">{dateStr}</p>
          <p className="text-white/70 text-xs font-medium mt-0.5">🕐 {timeStr} <span className="text-white/50">({offset})</span></p>
        </div>

        {/* Main temp + icon */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <p
              className="text-7xl font-bold leading-none tracking-tight transition-colors duration-500"
              style={{ color: tempColor, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
            >
              {Math.round(data.temperature)}<span className="text-4xl text-white/50">°C</span>
            </p>
            <p className="text-white/80 text-base mt-2 capitalize">{data.description}</p>
          </div>
          <img
            src={iconUrl}
            alt={data.condition}
            className="w-24 h-24 drop-shadow-2xl"
            loading="lazy"
          />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Feels like', value: `${Math.round(data.feelsLike)}°C` },
            { label: 'Humidity', value: `${data.humidity}%` },
            { label: 'Wind', value: `${data.windSpeed} m/s` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
              <p className="text-white font-semibold text-sm">{value}</p>
              <p className="text-white/60 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
