'use client';
// Detailed weather metrics: feels like, humidity, wind, pressure, visibility, cloud coverage, sunrise, sunset
import type { WeatherData } from '@/types';

export function WeatherDetails({ data }: { data: WeatherData }) {
  void data;
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-4" />;
}
