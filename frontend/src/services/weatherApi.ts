import apiClient from '@/lib/axios';
import type { WeatherData, ForecastDay, GeocodingResult, YouTubeVideo } from '@/types';

export const weatherApi = {
  search: async (query: string): Promise<WeatherData> => {
    const { data } = await apiClient.get('/api/weather/search', { params: { query } });
    return data.data;
  },

  getByCoordinates: async (lat: number, lon: number): Promise<WeatherData> => {
    const { data } = await apiClient.get('/api/weather/coordinates', { params: { lat, lon } });
    return data.data;
  },

  getForecast: async (query: string): Promise<ForecastDay[]> => {
    const { data } = await apiClient.get('/api/weather/forecast', { params: { query } });
    return data.data;
  },

  getSuggestions: async (query: string): Promise<GeocodingResult[]> => {
    const { data } = await apiClient.get('/api/weather/suggestions', { params: { query } });
    return data.data;
  },

  getVideos: async (location: string, maxResults = 6): Promise<YouTubeVideo[]> => {
    const { data } = await apiClient.get('/api/youtube/videos', {
      params: { location, maxResults },
    });
    return data.data;
  },
};
