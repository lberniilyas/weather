import { z } from 'zod';

export const searchWeatherSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
});

export const coordinatesSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
});

export const youtubeSearchSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  maxResults: z.coerce.number().min(1).max(10).default(6),
});

export type SearchWeatherInput = z.infer<typeof searchWeatherSchema>;
export type CoordinatesInput = z.infer<typeof coordinatesSchema>;
export type YouTubeSearchInput = z.infer<typeof youtubeSearchSchema>;
