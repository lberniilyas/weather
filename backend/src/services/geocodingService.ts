import axios from 'axios';
import type { GeocodingResult } from '../types';

const BASE = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'User-Agent': 'WeatherPro/1.0 (weather-app)' };

export async function geocodeLocation(query: string): Promise<GeocodingResult[]> {
  const { data } = await axios.get(`${BASE}/search`, {
    headers: HEADERS,
    params: { q: query, format: 'json', limit: 5, addressdetails: 1 },
  });

  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((item: Record<string, any>) => ({
    name: item.name ?? item.display_name?.split(',')[0] ?? query,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    country: item.address?.country ?? '',
    state: item.address?.state,
    displayName: item.display_name,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  const { data } = await axios.get(`${BASE}/reverse`, {
    headers: HEADERS,
    params: { lat, lon, format: 'json', addressdetails: 1 },
  });

  return {
    name: data.name ?? data.display_name?.split(',')[0] ?? `${lat},${lon}`,
    latitude: lat,
    longitude: lon,
    country: data.address?.country ?? '',
    state: data.address?.state,
    displayName: data.display_name,
  };
}
