'use client';
import { useState, useCallback, useRef } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import apiClient from '@/lib/axios';
import type { GeocodingResult } from '@/types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [suggLoading, setSuggLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getCurrentLocation, loading: geoLoading, latitude, longitude, error: geoError } = useGeolocation();

  // When geo resolves, trigger search
  const prevCoords = useRef<string>('');
  if (latitude !== null && longitude !== null) {
    const key = `${latitude},${longitude}`;
    if (prevCoords.current !== key) {
      prevCoords.current = key;
      onSearch(key);
    }
  }

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setSuggLoading(true);
    try {
      const { data } = await apiClient.get('/api/weather/suggestions', { params: { query: q } });
      setSuggestions(data.data ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounce.current) clearTimeout(debounce.current);
    if (v.length >= 2) {
      setShowSugg(true);
      debounce.current = setTimeout(() => fetchSuggestions(v), 380);
    } else {
      setSuggestions([]);
      setShowSugg(false);
    }
  };

  const submit = (q?: string) => {
    const val = (q ?? query).trim();
    if (!val) return;
    setShowSugg(false);
    setQuery(q ?? query);
    onSearch(val);
  };

  const pickSuggestion = (s: GeocodingResult) => {
    setQuery(s.name);
    setSuggestions([]);
    setShowSugg(false);
    onSearch(`${s.latitude},${s.longitude}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        {/* Input + suggestions wrapper */}
        <div className="relative flex-1">
          <div className="flex items-center gap-3 glass rounded-xl px-5 py-4 border border-white/10 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
            <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={query}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              onFocus={() => suggestions.length > 0 && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 160)}
              placeholder="City, landmark, zip, or 40.71,-74.00…"
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
              aria-label="Search location"
              aria-autocomplete="list"
              aria-expanded={showSugg}
            />
            {suggLoading && (
              <svg className="animate-spin w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSugg && suggestions.length > 0 && (
            <ul
              className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl overflow-hidden shadow-2xl border border-white/10"
              style={{ background: 'rgba(15,23,42,0.97)', backdropFilter: 'blur(16px)' }}
              role="listbox"
            >
              {suggestions.map((s, i) => (
                <li key={i} role="option">
                  <button
                    type="button"
                    onMouseDown={() => pickSuggestion(s)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/8 hover:text-white flex items-start gap-3 transition-colors border-b border-white/5 last:border-0"
                  >
                    <span className="text-blue-400 mt-0.5 shrink-0">📍</span>
                    <span className="truncate">{s.displayName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={() => submit()}
          disabled={loading || !query.trim()}
          className="px-6 py-4 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap"
          aria-label="Search weather"
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : 'Search'}
        </button>

        {/* GPS button */}
        <button
          onClick={getCurrentLocation}
          disabled={geoLoading}
          title="Use my current location"
          aria-label="Use my current location"
          className="px-4 py-4 glass border border-white/10 hover:border-blue-400/40 hover:bg-white/10 text-white rounded-xl transition-all disabled:opacity-40"
        >
          {geoLoading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>

      {geoError && (
        <p className="mt-2 text-red-400 text-xs" role="alert">{geoError}</p>
      )}

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {['Tokyo', 'New York', 'Dubai', 'London', 'Paris'].map((city) => (
          <button
            key={city}
            onClick={() => { setQuery(city); submit(city); }}
            className="text-xs text-slate-400 hover:text-white glass px-3 py-1.5 rounded-lg hover:border-blue-500/30 transition-all"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
