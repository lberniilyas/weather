import Anthropic from '@anthropic-ai/sdk';
import type { WeatherData } from '../types';
import type { Response } from 'express';

const INSIGHTS_SYSTEM = `You are a professional travel and weather intelligence assistant for WeatherPro. Convert raw weather data into genuinely useful, context-aware insights for someone at that location right now.

Respond in exactly 4 sections using this markdown structure. Keep each section tight — 1-2 sentences max.

## 🌡️ Conditions
Describe how it actually *feels* outside — not the number, the experience. Reference the most notable factor.

## 👗 What to Wear
Name 2-3 specific garments or accessories. Precise: "a lightweight cotton shirt" not "comfortable clothing".

## 🎯 Best Activities
Suggest 2-3 specific activities that genuinely suit these conditions and the location's context.

## ✈️ Travel Note
One practical sentence about commuting, driving, or outdoor transit for these exact conditions.

Rules: Be specific to the exact numbers. Never be generic — the user can see the numbers themselves. If wind exceeds 10 m/s or humidity exceeds 85%, highlight it prominently.`;

const LOCATION_SYSTEM = `Extract the geographic location from a weather-related query. Return ONLY the location name in its most searchable form — a city name, "City, Country", or coordinates. Return nothing else. If the input is already a clean location name or coordinates, return it unchanged.`;

function buildUserMessage(w: WeatherData, localTime: string): string {
  return `Location: ${w.location}${w.country ? `, ${w.country}` : ''}
Coordinates: ${w.latitude.toFixed(4)}, ${w.longitude.toFixed(4)}
Local time: ${localTime}
Temperature: ${w.temperature}°C (feels like ${w.feelsLike}°C)
Condition: ${w.condition} — ${w.description}
Humidity: ${w.humidity}%
Wind: ${w.windSpeed} m/s
Visibility: ${(w.visibility / 1000).toFixed(1)} km
Cloud cover: ${w.cloudCoverage}%
Pressure: ${w.pressure} hPa

Generate weather intelligence insights for someone here right now.`;
}

function getLocalTime(timezone: number): string {
  const d = new Date(Date.now() + timezone * 1000);
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  const offsetH = Math.floor(Math.abs(timezone) / 3600);
  const offsetM = Math.floor((Math.abs(timezone) % 3600) / 60);
  const sign = timezone >= 0 ? '+' : '-';
  return `${h}:${m} (UTC${sign}${String(offsetH).padStart(2, '0')}:${String(offsetM).padStart(2, '0')})`;
}

export async function streamWeatherInsights(weather: WeatherData, res: Response): Promise<void> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const localTime = getLocalTime(weather.timezone ?? 0);

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 380,
    system: INSIGHTS_SYSTEM,
    messages: [{ role: 'user', content: buildUserMessage(weather, localTime) }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
}

export async function parseNaturalLanguageLocation(query: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 40,
    system: LOCATION_SYSTEM,
    messages: [{ role: 'user', content: query }],
  });

  const content = message.content[0];
  if (content.type !== 'text') return query;
  return content.text.trim() || query;
}
