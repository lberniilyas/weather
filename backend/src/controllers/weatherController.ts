import { Request, Response } from 'express';
import { getCurrentWeather, getWeatherByCoords, get5DayForecast } from '../services/weatherService';
import { geocodeLocation } from '../services/geocodingService';
import { searchVideos } from '../services/youtubeService';

export const searchWeather = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query as { query: string };
  if (!query?.trim()) {
    res.status(400).json({ success: false, error: 'Search query is required' });
    return;
  }
  try {
    const data = await getCurrentWeather(query.trim());
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: (err as Error).message });
  }
};

export const getWeatherByCoordinates = async (req: Request, res: Response): Promise<void> => {
  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);
  if (isNaN(lat) || isNaN(lon)) {
    res.status(400).json({ success: false, error: 'Valid lat and lon parameters are required' });
    return;
  }
  try {
    const data = await getWeatherByCoords(lat, lon);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const getForecast = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query as { query: string };
  if (!query?.trim()) {
    res.status(400).json({ success: false, error: 'Search query is required' });
    return;
  }
  try {
    const data = await get5DayForecast(query.trim());
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: (err as Error).message });
  }
};

export const getLocationSuggestions = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query as { query: string };
  if (!query || query.trim().length < 2) {
    res.json({ success: true, data: [] });
    return;
  }
  try {
    const data = await geocodeLocation(query.trim());
    res.json({ success: true, data });
  } catch {
    res.json({ success: true, data: [] });
  }
};

export const getYouTubeVideos = async (req: Request, res: Response): Promise<void> => {
  const { location, maxResults } = req.query as { location: string; maxResults?: string };
  if (!location?.trim()) {
    res.status(400).json({ success: false, error: 'Location is required' });
    return;
  }
  try {
    const data = await searchVideos(location.trim(), maxResults ? parseInt(maxResults) : 6);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
