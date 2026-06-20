'use client';
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import apiClient from '@/lib/axios';
import type { WeatherRecord } from '@/types';

const CONDITION_COLORS: Record<string, string> = {
  Clear:        '#F59E0B',
  Clouds:       '#94A3B8',
  Rain:         '#3B82F6',
  Drizzle:      '#60A5FA',
  Snow:         '#BAE6FD',
  Thunderstorm: '#7C3AED',
  Mist:         '#6B7280',
  Fog:          '#9CA3AF',
  Haze:         '#D1D5DB',
};

function conditionColor(name: string): string {
  return CONDITION_COLORS[name] ?? '#6366F1';
}

interface ChartTooltipProps { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 px-3 py-2 text-xs shadow-xl" style={{ background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(12px)' }}>
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{p.name === 'Temp' || p.name === 'Feels like' ? '°C' : '%'}
        </p>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/10 flex flex-col gap-1">
      <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-white text-xl font-bold">{value}</p>
      {sub && <p className="text-slate-500 text-xs">{sub}</p>}
    </div>
  );
}

export function RecordCharts() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/api/records', { params: { limit: 100, sortBy: 'createdAt', sortOrder: 'asc' } })
      .then((r) => setRecords(r.data.data?.data ?? []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12 text-slate-500 text-sm">
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading trend data…
      </div>
    );
  }

  if (records.length < 2) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-4xl mb-3">📈</p>
        <p className="text-sm">Add at least 2 records to see trends and insights.</p>
      </div>
    );
  }

  // ── Data transforms ──────────────────────────────────────────────────────────
  const lineData = records.map((r) => ({
    date: new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    Temp: Math.round(r.temperature),
    Humidity: r.humidity,
    ...(r.feelsLike != null ? { 'Feels like': Math.round(r.feelsLike) } : {}),
  }));

  const conditionCounts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.condition] = (acc[r.condition] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(conditionCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const avgTemp  = records.reduce((s, r) => s + r.temperature, 0) / records.length;
  const avgHum   = records.reduce((s, r) => s + r.humidity, 0) / records.length;
  const hottest  = records.reduce((m, r) => r.temperature > m.temperature ? r : m);
  const coldest  = records.reduce((m, r) => r.temperature < m.temperature ? r : m);
  const mostCommon = pieData[0];

  return (
    <div className="flex flex-col gap-8">

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Avg Temperature" value={`${avgTemp.toFixed(1)}°C`} sub={`${records.length} records`} />
        <StatCard label="Avg Humidity" value={`${avgHum.toFixed(0)}%`} />
        <StatCard label="Hottest" value={`${Math.round(hottest.temperature)}°C`} sub={hottest.location} />
        <StatCard label="Coldest" value={`${Math.round(coldest.temperature)}°C`} sub={coldest.location} />
      </div>

      {/* Temperature & humidity over time */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-white font-semibold text-sm mb-5">Temperature & Humidity Over Time</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
            <Line type="monotone" dataKey="Temp" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, fill: '#3B82F6' }} activeDot={{ r: 5 }} />
            {'Feels like' in lineData[0] && (
              <Line type="monotone" dataKey="Feels like" stroke="#818CF8" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            )}
            <Line type="monotone" dataKey="Humidity" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3, fill: '#06B6D4' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Condition distribution */}
      <div className="glass rounded-2xl border border-white/10 p-6">
        <h3 className="text-white font-semibold text-sm mb-5">
          Condition Breakdown
          {mostCommon && <span className="ml-2 font-normal text-slate-400">· Most common: <span className="text-white">{mostCommon.name}</span></span>}
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={conditionColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const v = typeof value === 'number' ? value : 0;
                  return [`${v} record${v !== 1 ? 's' : ''}`, String(name)];
                }}
                contentStyle={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', fontSize: 12 }}
                labelStyle={{ color: '#94A3B8' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-3 text-sm">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: conditionColor(entry.name) }} />
                <span className="text-slate-300 truncate">{entry.name}</span>
                <span className="ml-auto text-slate-400 tabular-nums">{entry.value}</span>
                <span className="text-slate-600 tabular-nums w-10 text-right">
                  {Math.round((entry.value / records.length) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
