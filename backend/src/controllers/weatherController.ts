import { Request, Response } from 'express';

// Handles: search by city/zip/landmark/coordinates, current location, forecast, suggestions
export const searchWeather = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'searchWeather — to be implemented' });
};

export const getWeatherByCoordinates = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'getWeatherByCoordinates — to be implemented' });
};

export const getForecast = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'getForecast — to be implemented' });
};

export const getLocationSuggestions = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'getLocationSuggestions — to be implemented' });
};

export const getYouTubeVideos = async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'getYouTubeVideos — to be implemented' });
};
