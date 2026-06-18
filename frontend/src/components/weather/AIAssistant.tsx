'use client';
import type { WeatherData } from '@/types';

interface Rec { type: 'clothing' | 'activity' | 'health' | 'travel' | 'warning'; icon: string; title: string; text: string }

function generateRecommendations(w: WeatherData): Rec[] {
  const recs: Rec[] = [];
  const { temperature, feelsLike, condition, windSpeed, humidity, visibility } = w;

  // Clothing
  if (feelsLike < 0)
    recs.push({ type: 'clothing', icon: '🧥', title: 'Heavy Winter Gear', text: 'Wear a heavy coat, thermal layers, gloves and a hat. Frostbite risk is elevated.' });
  else if (feelsLike < 10)
    recs.push({ type: 'clothing', icon: '🧣', title: 'Layer Up', text: 'A warm coat and scarf will keep you comfortable. Temperatures feel cold.' });
  else if (feelsLike < 18)
    recs.push({ type: 'clothing', icon: '🧤', title: 'Light Jacket', text: 'A light jacket or long sleeves is recommended for outdoor comfort.' });
  else if (feelsLike > 32)
    recs.push({ type: 'clothing', icon: '👕', title: 'Light Clothing', text: 'Wear breathable, light-coloured fabrics. Avoid prolonged direct sun exposure.' });

  // Precipitation & storms
  if (['Rain', 'Drizzle'].includes(condition))
    recs.push({ type: 'warning', icon: '☂️', title: 'Rain Expected', text: 'Bring an umbrella or waterproof jacket. Roads and pavements may be slippery.' });
  if (condition === 'Thunderstorm')
    recs.push({ type: 'warning', icon: '⚡', title: 'Thunderstorm Alert', text: 'Stay indoors where possible. Avoid open fields, tall trees and bodies of water.' });
  if (condition === 'Snow')
    recs.push({ type: 'warning', icon: '❄️', title: 'Snow Warning', text: 'Allow extra travel time. Wear appropriate footwear and drive with caution.' });
  if (condition === 'Fog' || visibility < 1000)
    recs.push({ type: 'warning', icon: '🌫️', title: 'Low Visibility', text: 'Use fog lights when driving and reduce speed. Visibility is significantly reduced.' });

  // Wind
  if (windSpeed > 15)
    recs.push({ type: 'warning', icon: '💨', title: 'Strong Winds', text: 'Secure loose outdoor objects. Avoid cycling and activities in exposed areas.' });
  else if (windSpeed > 8)
    recs.push({ type: 'clothing', icon: '🌬️', title: 'Breezy Conditions', text: 'A windproof outer layer will make outdoor activities noticeably more comfortable.' });

  // UV & sun
  if (condition === 'Clear' && temperature > 20)
    recs.push({ type: 'health', icon: '🕶️', title: 'UV Protection', text: 'Apply SPF 30+ sunscreen and wear sunglasses. UV exposure is significant today.' });

  // Activity
  if (['Clear', 'Clouds'].includes(condition) && temperature > 14 && temperature < 29 && windSpeed < 10)
    recs.push({ type: 'activity', icon: '🏃', title: 'Great for Outdoors', text: 'Excellent conditions for walking, running, cycling or sightseeing.' });
  if (temperature > 26 && condition === 'Clear')
    recs.push({ type: 'activity', icon: '🏖️', title: 'Beach Weather', text: 'Perfect day for swimming, sunbathing or beach activities.' });

  // Humidity
  if (humidity > 80 && temperature > 25)
    recs.push({ type: 'health', icon: '💧', title: 'High Humidity', text: 'Stay hydrated and take breaks in the shade. Heat index feels significantly higher.' });

  // Travel
  if (['Clear', 'Clouds'].includes(condition) && visibility > 5000)
    recs.push({ type: 'travel', icon: '✈️', title: 'Good Travel Conditions', text: 'Clear visibility and stable conditions make today ideal for travel.' });

  if (recs.length === 0)
    recs.push({ type: 'activity', icon: '🌤️', title: 'Mild Conditions', text: 'Weather is comfortable. A great day to enjoy outdoor activities.' });

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
  warning:  'text-red-400',
  clothing: 'text-blue-400',
  health:   'text-amber-400',
  activity: 'text-green-400',
  travel:   'text-purple-400',
};

interface Props { weather: WeatherData }

export function AIAssistant({ weather }: Props) {
  const recs = generateRecommendations(weather);

  return (
    <section
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(88,28,135,0.15) 0%, rgba(30,64,175,0.15) 100%)' }}
      aria-labelledby="ai-heading"
    >
      <div className="px-6 py-5 border-b border-white/8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-lg" aria-hidden="true">🤖</div>
        <div>
          <h3 id="ai-heading" className="text-white font-semibold">AI Weather Assistant</h3>
          <p className="text-slate-400 text-xs">Smart recommendations based on current conditions in {weather.location}</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recs.map((rec, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${TYPE_STYLE[rec.type]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl" aria-hidden="true">{rec.icon}</span>
              <span className={`text-xs font-semibold uppercase tracking-wide ${TYPE_LABEL_STYLE[rec.type]}`}>
                {rec.type}
              </span>
            </div>
            <p className="text-white text-sm font-medium mb-1">{rec.title}</p>
            <p className="text-slate-400 text-xs leading-relaxed">{rec.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
