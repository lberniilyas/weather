import axios from 'axios';
import config from '../config/env';
import { detectQueryType, parseCoordinates } from '../utils/helpers';
import type { WeatherData, ForecastDay } from '../types';
import { cache, TTL } from './cacheService';

const BASE = 'https://api.openweathermap.org/data/2.5';
const KEY = () => config.openWeatherApiKey;

function owmError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 404) throw new Error('Location not found. Please check your search query.');
    if (status === 401) throw new Error('Invalid OpenWeatherMap API key.');
  }
  throw new Error('Failed to fetch weather data. Please try again.');
}

function normalizeWeather(d: Record<string, any>): WeatherData {
  return {
    location: d.name,
    country: d.sys?.country ?? '',
    latitude: d.coord.lat,
    longitude: d.coord.lon,
    temperature: Math.round(d.main.temp * 10) / 10,
    feelsLike: Math.round(d.main.feels_like * 10) / 10,
    humidity: d.main.humidity,
    condition: d.weather[0].main,
    description: d.weather[0].description,
    windSpeed: d.wind?.speed ?? 0,
    pressure: d.main.pressure,
    visibility: d.visibility ?? 0,
    cloudCoverage: d.clouds?.all ?? 0,
    sunrise: d.sys?.sunrise ?? 0,
    sunset: d.sys?.sunset ?? 0,
    timezone: d.timezone ?? 0,
    icon: d.weather[0].icon,
  };
}

export async function getCurrentWeather(query: string): Promise<WeatherData> {
  const cacheKey = `weather:current:${query.toLowerCase().trim()}`;
  const hit = cache.get<WeatherData>(cacheKey);
  if (hit) return hit;

  const type = detectQueryType(query);
  let params: Record<string, string | number>;

  if (type === 'coordinates') {
    const c = parseCoordinates(query);
    if (!c) throw new Error('Invalid coordinate format. Use lat,lon (e.g. 48.8566,2.3522).');
    params = { lat: c.lat, lon: c.lon };
  } else if (type === 'zipcode') {
    params = { zip: query };
  } else {
    params = { q: query };
  }

  try {
    const { data } = await axios.get(`${BASE}/weather`, {
      params: { ...params, appid: KEY(), units: 'metric' },
      timeout: 45000,
    });
    const result = normalizeWeather(data);
    cache.set(cacheKey, result, TTL.WEATHER);
    return result;
  } catch (err) {
    owmError(err);
  }
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  // Round to 2 decimal places so nearby coord variations share a cache entry
  const cacheKey = `weather:coords:${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const hit = cache.get<WeatherData>(cacheKey);
  if (hit) return hit;

  try {
    const { data } = await axios.get(`${BASE}/weather`, {
      params: { lat, lon, appid: KEY(), units: 'metric' },
      timeout: 45000,
    });
    const result = normalizeWeather(data);
    cache.set(cacheKey, result, TTL.WEATHER);
    return result;
  } catch (err) {
    owmError(err);
  }
}

export async function get5DayForecast(query: string): Promise<ForecastDay[]> {
  const cacheKey = `weather:forecast:${query.toLowerCase().trim()}`;
  const hit = cache.get<ForecastDay[]>(cacheKey);
  if (hit) return hit;

  const type = detectQueryType(query);
  let params: Record<string, string | number>;

  if (type === 'coordinates') {
    const c = parseCoordinates(query);
    if (!c) throw new Error('Invalid coordinate format.');
    params = { lat: c.lat, lon: c.lon };
  } else if (type === 'zipcode') {
    params = { zip: query };
  } else {
    params = { q: query };
  }

  try {
    const { data } = await axios.get(`${BASE}/forecast`, {
      params: { ...params, appid: KEY(), units: 'metric', cnt: 40 },
      timeout: 45000,
    });

    const byDay = new Map<string, Record<string, any>[]>();
    for (const item of data.list) {
      const date = (item.dt_txt as string).split(' ')[0];
      if (!byDay.has(date)) byDay.set(date, []);
      byDay.get(date)!.push(item);
    }

    const result: ForecastDay[] = [];
    for (const [date, slots] of byDay) {
      const noon = slots.find((s: Record<string, any>) => (s.dt_txt as string).includes('12:00')) ?? slots[Math.floor(slots.length / 2)];
      const temps = slots.map((s: Record<string, any>) => s.main.temp as number);
      result.push({
        date,
        temperature: Math.round(noon.main.temp),
        minTemp: Math.round(Math.min(...temps)),
        maxTemp: Math.round(Math.max(...temps)),
        humidity: noon.main.humidity,
        windSpeed: noon.wind.speed,
        condition: noon.weather[0].main,
        icon: noon.weather[0].icon,
      });
    }

    const forecast = result.slice(0, 5);
    cache.set(cacheKey, forecast, TTL.FORECAST);
    return forecast;
  } catch (err) {
    owmError(err);
  }
}
