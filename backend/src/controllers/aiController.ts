import { Request, Response } from 'express';
import { streamWeatherInsights, parseNaturalLanguageLocation } from '../services/aiService';
import type { WeatherData } from '../types';

function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export const getWeatherInsights = async (req: Request, res: Response): Promise<void> => {
  if (!isConfigured()) {
    res.status(503).json({ success: false, error: 'AI service not configured' });
    return;
  }

  const { weatherData } = req.body as { weatherData: WeatherData };
  if (!weatherData?.location) {
    res.status(400).json({ success: false, error: 'weatherData is required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    await streamWeatherInsights(weatherData, res);
  } catch (err) {
    const msg = (err as Error).message ?? 'Unknown error';
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
};

export const parseLocation = async (req: Request, res: Response): Promise<void> => {
  if (!isConfigured()) {
    res.status(503).json({ success: false, error: 'AI service not configured' });
    return;
  }

  const { query } = req.body as { query: string };
  if (!query?.trim()) {
    res.status(400).json({ success: false, error: 'query is required' });
    return;
  }

  try {
    const location = await parseNaturalLanguageLocation(query.trim());
    res.json({ success: true, data: { location } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
