'use client';
import { Database, FileDown, MapPin, Video } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';
import { SearchBar } from '@/components/weather/SearchBar';
import { WeatherCard } from '@/components/weather/WeatherCard';
import { WeatherDetails } from '@/components/weather/WeatherDetails';
import { ForecastGrid } from '@/components/weather/ForecastCard';
import { AIAssistant } from '@/components/weather/AIAssistant';
import { WeatherMap } from '@/components/map/WeatherMap';
import { VideoGrid } from '@/components/youtube/VideoGrid';
import { RecordList } from '@/components/crud/RecordList';
import { ExportButtons } from '@/components/export/ExportButtons';
import { LoadingOverlay } from '@/components/ui/Loading';
import apiClient from '@/lib/axios';
import type { WeatherData, ForecastDay, YouTubeVideo } from '@/types';

export function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (query: string) => {
    setWeatherLoading(true);
    setWeatherError(null);
    setVideos([]);

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        apiClient.get('/api/weather/search', { params: { query } }),
        apiClient.get('/api/weather/forecast', { params: { query } }),
      ]);

      const w: WeatherData = weatherRes.data.data;
      setWeather(w);
      setForecast(forecastRes.data.data ?? []);

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

      // Videos — non-blocking
      setVideosLoading(true);
      apiClient
        .get('/api/weather/videos', { params: { location: w.location } })
        .then((r) => setVideos(r.data.data ?? []))
        .catch(() => setVideos([]))
        .finally(() => setVideosLoading(false));
    } catch (err) {
      setWeatherError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
      setForecast([]);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Search hero ───────────────────────────────── */}
      <section className={`relative overflow-hidden transition-all duration-500 ${weather ? 'py-8 border-b border-white/5' : 'py-32'}`}>
        {!weather && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="animate-drift   absolute -top-40 -left-40  w-[600px] h-[600px] rounded-full bg-blue-600/20  blur-[120px]" />
            <div className="animate-drift-2 absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
            <div className="animate-drift-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          {!weather && (
            <>
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-blue-300 font-medium mb-8 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live data · Powered by OpenWeatherMap
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-tight">
                Weather at your
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  fingertips
                </span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                Search any city, landmark, zip code, or GPS coordinate for real-time weather, maps, and travel videos.
              </p>
            </>
          )}

          <SearchBar onSearch={handleSearch} loading={weatherLoading} />

          {weatherError && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
              {weatherError}
            </div>
          )}

          {weatherLoading && !weather && (
            <div className="mt-8">
              <LoadingOverlay message="Fetching weather data…" />
            </div>
          )}
        </div>
      </section>

      {/* ── Weather results ───────────────────────────── */}
      {weather && (
        <div ref={resultsRef} className="max-w-7xl mx-auto px-4 py-10 space-y-10">

          {/* Current + details */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <WeatherCard data={weather} />
            </div>
            <div className="lg:col-span-3">
              <WeatherDetails data={weather} />
            </div>
          </div>

          {/* Forecast */}
          {forecast.length > 0 && (
            <section aria-labelledby="forecast-heading">
              <h2 id="forecast-heading" className="text-white font-semibold text-xl mb-5">5-Day Forecast</h2>
              <ForecastGrid days={forecast} />
            </section>
          )}

          {/* AI assistant */}
          <AIAssistant weather={weather} />

          {/* Map + Videos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section aria-labelledby="map-heading">
              <h2 id="map-heading" className="text-white font-semibold text-xl mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-300" aria-hidden="true" />
                <span>Location Map</span>
              </h2>
              <WeatherMap
                latitude={weather.latitude}
                longitude={weather.longitude}
                location={`${weather.location}${weather.country ? `, ${weather.country}` : ''}`}
              />
            </section>

            <section aria-labelledby="videos-heading">
              <h2 id="videos-heading" className="text-white font-semibold text-xl mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-sky-300" aria-hidden="true" />
                <span>Travel Videos · {weather.location}</span>
              </h2>
              {videosLoading ? (
                <LoadingOverlay message="Loading videos…" />
              ) : (
                <VideoGrid videos={videos} />
              )}
            </section>
          </div>
        </div>
      )}

      {/* ── Records ──────────────────────────────────── */}
      <section className="border-t border-white/5 max-w-7xl mx-auto px-4 py-16" id="records" aria-labelledby="records-heading">
        <div className="mb-8">
          <h2 id="records-heading" className="text-white text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-sky-300" aria-hidden="true" />
            <span>Weather Records</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Save, search, sort and export your personal weather history</p>
        </div>
        <RecordList currentWeather={weather} />
      </section>

      {/* ── Export ───────────────────────────────────── */}
      <section className="border-t border-white/5 max-w-7xl mx-auto px-4 py-16" id="export" aria-labelledby="export-heading">
        <h2 id="export-heading" className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
          <FileDown className="h-6 w-6 text-sky-300" aria-hidden="true" />
          <span>Export Data</span>
        </h2>
        <p className="text-slate-400 text-sm mb-8">Download all saved weather records in your preferred format</p>
        <ExportButtons />
      </section>
    </div>
  );
}
