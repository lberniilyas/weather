import axios from 'axios';
import config from '../config/env';
import type { WeatherData, ForecastDay } from '../types';

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

// Fetches current weather from OpenWeatherMap
export async function getCurrentWeather(query: string): Promise<WeatherData> {
  void query;
  void axios;
  void config;
  throw new Error('weatherService.getCurrentWeather — to be implemented');
}

// Fetches 5-day / 3-hour forecast and aggregates into daily summaries
export async function get5DayForecast(query: string): Promise<ForecastDay[]> {
  void query;
  void OWM_BASE;
  throw new Error('weatherService.get5DayForecast — to be implemented');
}

// Fetches weather by lat/lon
export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  void lat;
  void lon;
  throw new Error('weatherService.getWeatherByCoords — to be implemented');
}
