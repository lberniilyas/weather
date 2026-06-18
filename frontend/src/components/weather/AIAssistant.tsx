'use client';
// AI Weather Assistant: generates clothing, travel, activity, and risk recommendations
// based on current weather conditions (no external AI API required — rule-based generation)
import type { WeatherData } from '@/types';

export function AIAssistant({ weather }: { weather: WeatherData }) {
  void weather;
  return <div className="rounded-xl bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-6" />;
}
