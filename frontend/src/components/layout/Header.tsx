'use client';
import { useState } from 'react';

const NAV = [
  { label: 'Weather', href: '#weather' },
  { label: 'Forecast', href: '#forecast' },
  { label: 'Map', href: '#map' },
  { label: 'Videos', href: '#videos' },
  { label: 'Records', href: '#records' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <div className="mx-4 mt-4">
        <div
          className="max-w-6xl mx-auto rounded-2xl px-5 py-3.5 flex items-center justify-between"
          style={{
            background: 'rgba(10, 15, 30, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group" aria-label="WeatherPro home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-base shadow-lg shadow-blue-500/30">
              🌤️
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Weather<span className="text-blue-400">Pro</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 font-medium"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all font-medium">
              Export data
            </button>
            <button className="text-sm font-semibold bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-500/20">
              Search weather
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl px-4 py-3 flex flex-col gap-1"
            style={{
              background: 'rgba(10, 15, 30, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {NAV.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium"
              >
                {label}
              </a>
            ))}
            <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-2">
              <button className="text-sm text-slate-400 hover:text-white px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-left font-medium">
                Export data
              </button>
              <button className="text-sm font-semibold bg-blue-500 hover:bg-blue-400 text-white px-4 py-3 rounded-xl transition-colors text-left">
                Search weather
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
