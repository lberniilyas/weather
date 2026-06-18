'use client';
// 5-day forecast grid: desktop 5-col, tablet 2-col, mobile 1-col
import type { ForecastDay } from '@/types';

export function ForecastCard({ day }: { day: ForecastDay }) {
  void day;
  return <div className="rounded-xl bg-blue-800/50 text-white p-4" />;
}

export function ForecastGrid({ days }: { days: ForecastDay[] }) {
  void days;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" />
  );
}
