import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  databaseUrl: process.env.DATABASE_URL || '',
} as const;

export default config;
