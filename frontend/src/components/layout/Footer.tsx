import { CloudSun } from 'lucide-react';

const FOOTER_LINKS = {
  Product: ['Weather Search', 'Forecast', 'Interactive Map', 'Travel Videos', 'AI Recommendations'],
  Data: ['Save Records', 'Export JSON', 'Export CSV', 'Export PDF', 'Export Markdown'],
  Support: ['Documentation', 'API Reference', 'Changelog', 'Status'],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-white/[0.01]" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-sm shadow-lg shadow-blue-500/30">
                <CloudSun className="h-4.5 w-4.5 text-white" aria-hidden="true" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Weather<span className="text-blue-400">Pro</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Real-time weather intelligence for travellers, planners, and professionals.
            </p>
            {/* PM Accelerator */}
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">About PM Accelerator</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                PM Accelerator helps aspiring professionals gain practical experience in product
                management, AI, and technology through mentorship, internships, and career
                acceleration programs.
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-white font-semibold text-sm mb-4">{group}</p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} WeatherPro. Built by{' '}
            <span className="text-slate-400 font-medium">Ilyas Lberni</span>.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Powered by OpenWeatherMap</span>
            <span>·</span>
            <span>Maps by OpenStreetMap</span>
            <span>·</span>
            <span>Videos by YouTube</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
