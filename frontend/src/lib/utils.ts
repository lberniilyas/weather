import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') return `${Math.round((temp * 9) / 5 + 32)}°F`;
  return `${Math.round(temp)}°C`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function detectQueryType(query: string): 'coordinates' | 'zipcode' | 'city' {
  const trimmed = query.trim();
  if (/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(trimmed)) return 'coordinates';
  if (/^\d{4,10}$/.test(trimmed)) return 'zipcode';
  return 'city';
}

export function parseCoordinates(query: string): { lat: number; lon: number } | null {
  const match = query.trim().match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
}
