'use client';
import { useState, useCallback } from 'react';
import { weatherApi } from '@/services/weatherApi';
import type { WeatherData, ForecastDay } from '@/types';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const [w, f] = await Promise.all([
        weatherApi.search(query),
        weatherApi.getForecast(query),
      ]);
      setWeather(w);
      setForecast(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [w, f] = await Promise.all([
        weatherApi.getByCoordinates(lat, lon),
        weatherApi.getForecast(`${lat},${lon}`),
      ]);
      setWeather(w);
      setForecast(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setWeather(null);
    setForecast([]);
    setError(null);
  }, []);

  return { weather, forecast, loading, error, search, searchByCoords, clear };
}
