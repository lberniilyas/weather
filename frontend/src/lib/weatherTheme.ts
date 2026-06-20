export interface WeatherTheme {
  cardGradient: string;
  pageAccent: string;
  bgImage: string;
}

const UNS = 'https://images.unsplash.com/photo-';
const OPT = '?auto=format&fit=crop&w=1920&q=85';

const BG: Record<string, string> = {
  Clear:        `${UNS}1507525428034-b723cf961d3e${OPT}`, // tropical beach, golden sun
  Rain:         `${UNS}1519692933481-e162a57d6721${OPT}`, // rain on city street
  Drizzle:      `${UNS}1519692933481-e162a57d6721${OPT}`,
  Thunderstorm: `${UNS}1472145246862-b24cf25495bf${OPT}`, // lightning over landscape
  Snow:         `${UNS}1491002052546-bf38f186af56${OPT}`, // snowy mountain valley
  Clouds:       `${UNS}1534374228664-75b5c9f0bbaa${OPT}`, // dramatic cloudscape
  Fog:          `${UNS}1487621167305-5d248087c724${OPT}`, // misty forest
  Mist:         `${UNS}1487621167305-5d248087c724${OPT}`,
  Haze:         `${UNS}1487621167305-5d248087c724${OPT}`,
  Smoke:        `${UNS}1487621167305-5d248087c724${OPT}`,
};
const DEFAULT_BG = `${UNS}1506905925346-21bda4d32df4${OPT}`; // mountain peaks, blue sky

export function getWeatherTheme(condition: string): WeatherTheme {
  const bgImage = BG[condition] ?? DEFAULT_BG;

  switch (condition) {
    case 'Clear':
      return { cardGradient: 'linear-gradient(135deg, #78350f 0%, #b45309 45%, #d97706 100%)', pageAccent: 'rgba(217,119,6,0.07)', bgImage };
    case 'Rain':
    case 'Drizzle':
      return { cardGradient: 'linear-gradient(135deg, #0c2340 0%, #1e3a5f 50%, #1e4d89 100%)', pageAccent: 'rgba(30,77,137,0.09)', bgImage };
    case 'Thunderstorm':
      return { cardGradient: 'linear-gradient(135deg, #1a0533 0%, #3b0764 50%, #5b21b6 100%)', pageAccent: 'rgba(91,33,182,0.09)', bgImage };
    case 'Snow':
      return { cardGradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563a0 40%, #60a5fa 100%)', pageAccent: 'rgba(147,197,253,0.07)', bgImage };
    case 'Clouds':
      return { cardGradient: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)', pageAccent: 'rgba(107,114,128,0.07)', bgImage };
    case 'Fog':
    case 'Mist':
    case 'Haze':
    case 'Smoke':
    case 'Dust':
    case 'Sand':
    case 'Ash':
      return { cardGradient: 'linear-gradient(135deg, #292524 0%, #44403c 50%, #57534e 100%)', pageAccent: 'rgba(120,113,108,0.07)', bgImage };
    default:
      return { cardGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', pageAccent: 'rgba(37,99,235,0.07)', bgImage };
  }
}

export function getTempColor(temp: number): string {
  if (temp <= 0)  return '#93c5fd'; // ice blue
  if (temp <= 10) return '#60a5fa'; // cool blue
  if (temp <= 18) return '#34d399'; // mild teal
  if (temp <= 25) return '#fbbf24'; // warm amber
  if (temp <= 32) return '#f97316'; // hot orange
  return '#f87171';                  // very hot red
}
