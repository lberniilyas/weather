'use client';
// Main weather card: temperature, condition icon, humidity, wind, pressure, visibility, sunrise/sunset
import type { WeatherData } from '@/types';

export function WeatherCard({ data }: { data: WeatherData }) {
  void data;
  return <div className="rounded-xl bg-blue-900 text-white p-6" />;
}
