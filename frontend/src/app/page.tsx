import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const FEATURES = [
  {
    icon: '🌡️',
    title: 'Live Weather',
    desc: 'Real-time conditions from any city, zip code, landmark, or GPS coordinate worldwide.',
  },
  {
    icon: '📅',
    title: '5-Day Forecast',
    desc: 'Daily temperature, humidity, and wind data with dynamic weather icons.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Map',
    desc: 'Explore any location on a full Leaflet/OpenStreetMap with precise coordinates.',
  },
  {
    icon: '🎥',
    title: 'Destination Videos',
    desc: 'Curated YouTube travel and tourism videos for every location you search.',
  },
  {
    icon: '💾',
    title: 'Weather Records',
    desc: 'Save, organise, search and export your weather history in JSON, CSV, Markdown or PDF.',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    desc: 'Smart clothing, activity, and travel tips generated from current conditions.',
  },
];

const STATS = [
  { value: '200K+', label: 'Cities covered' },
  { value: '5-day', label: 'Forecast range' },
  { value: '4', label: 'Export formats' },
  { value: '< 1s', label: 'Avg. load time' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e]">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-32">

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="animate-drift   absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="animate-drift-2 absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="animate-drift-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />
        </div>

        {/* Floating weather icons */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute top-[12%] left-[8%]  text-5xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>⛅</span>
          <span className="absolute top-[20%] right-[10%] text-4xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🌧️</span>
          <span className="absolute bottom-[25%] left-[12%] text-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }}>❄️</span>
          <span className="absolute bottom-[20%] right-[8%]  text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>☀️</span>
          <span className="absolute top-[55%] left-[5%]   text-2xl opacity-10 animate-float" style={{ animationDelay: '0.8s' }}>🌩️</span>
          <span className="absolute top-[40%] right-[6%]  text-3xl opacity-10 animate-float" style={{ animationDelay: '2.5s' }}>🌈</span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto w-full">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-blue-300 font-medium mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live data · Powered by OpenWeatherMap
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-5 leading-tight tracking-tight">
            Weather at your
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              fingertips
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Search any city, landmark, or coordinate. Get real-time conditions,
            5-day forecasts, interactive maps, and AI-powered recommendations — instantly.
          </p>

          {/* Search mockup */}
          <div className="glass rounded-2xl p-2 max-w-2xl mx-auto mb-6 flex gap-2">
            <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-5 py-3.5">
              <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-slate-400 text-sm sm:text-base">Paris, London, 10001, 40.7128,-74.0060…</span>
            </div>
            <button className="bg-blue-500 hover:bg-blue-400 transition-colors text-white font-semibold px-6 py-3.5 rounded-xl text-sm whitespace-nowrap">
              Search
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
            <button className="flex items-center gap-2 glass rounded-lg px-4 py-2 hover:text-white transition-colors">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use my location
            </button>
            {['Tokyo', 'New York', 'Dubai', 'London'].map((city) => (
              <button key={city} className="glass rounded-lg px-4 py-2 hover:text-white hover:border-blue-500/40 transition-colors">
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to know about the weather
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From live conditions to historical records — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 text-center">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-400/10 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to explore the forecast?
              </h2>
              <p className="text-blue-200 text-lg mb-8 max-w-lg mx-auto">
                Search any location and get live weather, maps, videos, and personalised insights in seconds.
              </p>
              <button className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-base shadow-lg">
                Get started — it&apos;s free
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
