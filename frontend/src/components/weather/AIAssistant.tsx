'use client';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import type { WeatherData } from '@/types';

// ── Rule-based fallback (used when API key is not configured) ─────────────────
interface Rec { type: 'clothing' | 'activity' | 'health' | 'travel' | 'warning'; icon: string; title: string; text: string }

function generateFallbackRecs(w: WeatherData): Rec[] {
  const recs: Rec[] = [];
  const { temperature, feelsLike, condition, windSpeed, humidity, visibility } = w;
  if (feelsLike < 0)   recs.push({ type: 'clothing', icon: '🧥', title: 'Heavy Winter Gear', text: 'Wear a heavy coat, thermal layers, gloves and a hat. Frostbite risk is elevated.' });
  else if (feelsLike < 10) recs.push({ type: 'clothing', icon: '🧣', title: 'Layer Up', text: 'A warm coat and scarf will keep you comfortable. Temperatures feel cold.' });
  else if (feelsLike < 18) recs.push({ type: 'clothing', icon: '🧤', title: 'Light Jacket', text: 'A light jacket or long sleeves is recommended for outdoor comfort.' });
  else if (feelsLike > 32) recs.push({ type: 'clothing', icon: '👕', title: 'Light Clothing', text: 'Wear breathable, light-coloured fabrics. Avoid prolonged direct sun exposure.' });
  if (['Rain', 'Drizzle'].includes(condition)) recs.push({ type: 'warning', icon: '☂️', title: 'Rain Expected', text: 'Bring an umbrella or waterproof jacket. Roads may be slippery.' });
  if (condition === 'Thunderstorm') recs.push({ type: 'warning', icon: '⚡', title: 'Thunderstorm Alert', text: 'Stay indoors. Avoid open fields, tall trees and water.' });
  if (condition === 'Snow') recs.push({ type: 'warning', icon: '❄️', title: 'Snow Warning', text: 'Allow extra travel time. Wear appropriate footwear and drive with caution.' });
  if (condition === 'Fog' || visibility < 1000) recs.push({ type: 'warning', icon: '🌫️', title: 'Low Visibility', text: 'Use fog lights when driving and reduce speed.' });
  if (windSpeed > 15) recs.push({ type: 'warning', icon: '💨', title: 'Strong Winds', text: 'Secure loose outdoor objects. Avoid cycling in exposed areas.' });
  if (condition === 'Clear' && temperature > 20) recs.push({ type: 'health', icon: '🕶️', title: 'UV Protection', text: 'Apply SPF 30+ sunscreen and wear sunglasses.' });
  if (['Clear', 'Clouds'].includes(condition) && temperature > 14 && temperature < 29 && windSpeed < 10)
    recs.push({ type: 'activity', icon: '🏃', title: 'Great for Outdoors', text: 'Excellent conditions for walking, running, or sightseeing.' });
  if (['Clear', 'Clouds'].includes(condition) && visibility > 5000)
    recs.push({ type: 'travel', icon: '✈️', title: 'Good Travel Conditions', text: 'Clear visibility and stable conditions make today ideal for travel.' });
  if (recs.length === 0) recs.push({ type: 'activity', icon: '🌤️', title: 'Mild Conditions', text: 'Weather is comfortable. A great day to enjoy outdoor activities.' });
  return recs;
}

const TYPE_STYLE: Record<Rec['type'], string> = {
  warning:  'border-red-500/30  bg-red-500/5',
  clothing: 'border-blue-500/30 bg-blue-500/5',
  health:   'border-amber-500/30 bg-amber-500/5',
  activity: 'border-green-500/30 bg-green-500/5',
  travel:   'border-purple-500/30 bg-purple-500/5',
};
const TYPE_LABEL_STYLE: Record<Rec['type'], string> = {
  warning: 'text-red-400', clothing: 'text-blue-400',
  health: 'text-amber-400', activity: 'text-green-400', travel: 'text-purple-400',
};

function FallbackView({ weather }: { weather: WeatherData }) {
  const recs = generateFallbackRecs(weather);
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recs.map((rec, i) => (
        <div key={i} className={`rounded-xl border p-4 ${TYPE_STYLE[rec.type]}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl" aria-hidden="true">{rec.icon}</span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${TYPE_LABEL_STYLE[rec.type]}`}>{rec.type}</span>
          </div>
          <p className="text-white text-sm font-medium mb-1">{rec.title}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{rec.text}</p>
        </div>
      ))}
    </div>
  );
}

// ── Claude streaming view ─────────────────────────────────────────────────────
function StreamingCursor() {
  return <span className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 animate-pulse align-middle" aria-hidden="true" />;
}

function ClaudeView({ weather }: { weather: WeatherData }) {
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setText('');
    setDone(false);
    setError(null);
    setStreaming(true);

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai/insights`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.NEXT_PUBLIC_API_KEY ? { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY } : {}),
          },
          body: JSON.stringify({ weatherData: weather }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error('Failed to connect to AI service');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;

          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const payload = trimmed.slice(6);
            if (payload === '[DONE]') { setDone(true); break; }
            try {
              const { text: t, error: e } = JSON.parse(payload);
              if (e) throw new Error(e);
              if (t) setText((prev) => prev + t);
            } catch { /* partial JSON — skip */ }
          }
        }
      } catch (err: unknown) {
        if ((err as Error).name !== 'AbortError') {
          setError((err as Error).message ?? 'AI generation failed');
        }
      } finally {
        setStreaming(false);
      }
    })();

    return () => controller.abort();
  }, [weather.location, weather.condition, weather.temperature]);

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {streaming && !text && (
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <svg className="animate-spin w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating intelligence insights…
        </div>
      )}

      {text && (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold prose-headings:text-base prose-headings:mt-5 prose-headings:mb-2 prose-headings:first:mt-0
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-1
          prose-strong:text-white prose-li:text-slate-300 prose-ul:my-1">
          <ReactMarkdown>{text}</ReactMarkdown>
          {!done && <StreamingCursor />}
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props { weather: WeatherData }

export function AIAssistant({ weather }: Props) {
  const [mode, setMode] = useState<'claude' | 'fallback'>('claude');
  const [checked, setChecked] = useState(false);

  // Check once if the AI service is available
  useEffect(() => {
    if (checked) return;
    setChecked(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weatherData: { location: '' } }),
      signal: AbortSignal.timeout(3000),
    })
      .then((r) => { if (r.status === 503) setMode('fallback'); })
      .catch(() => { /* network error — try Claude anyway, it'll show its own error */ });
  }, [checked]);

  return (
    <section
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(88,28,135,0.15) 0%, rgba(30,64,175,0.15) 100%)' }}
      aria-labelledby="ai-heading"
    >
      <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg" aria-hidden="true">
            {mode === 'claude' ? '✨' : '🤖'}
          </div>
          <div>
            <h3 id="ai-heading" className="text-white font-semibold flex items-center gap-2">
              AI Weather Assistant
              {mode === 'claude' && (
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Powered by Claude
                </span>
              )}
            </h3>
            <p className="text-slate-400 text-xs">
              {mode === 'claude'
                ? `Live AI insights for ${weather.location} · Updates on every search`
                : `Smart recommendations based on current conditions in ${weather.location}`}
            </p>
          </div>
        </div>

        {/* Toggle between Claude and rule-based */}
        <button
          onClick={() => setMode((m) => m === 'claude' ? 'fallback' : 'claude')}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-white/5 whitespace-nowrap"
          title={mode === 'claude' ? 'Switch to classic mode' : 'Switch to AI mode'}
        >
          {mode === 'claude' ? 'Classic mode' : 'AI mode'}
        </button>
      </div>

      {mode === 'claude'
        ? <ClaudeView weather={weather} />
        : <FallbackView weather={weather} />
      }
    </section>
  );
}
