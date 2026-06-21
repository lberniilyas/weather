export interface WeatherData {
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  description: string;
  windSpeed: number;
  pressure: number;
  visibility: number;
  cloudCoverage: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  icon: string;
}

export interface ForecastDay {
  date: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  cloudCoverage: number;
  condition: string;
  icon: string;
}

export interface WeatherRecord {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  temperature: number;
  feelsLike?: number | null;
  humidity: number;
  windSpeed?: number | null;
  pressure?: number | null;
  visibility?: number | null;
  cloudCoverage?: number | null;
  sunrise?: number | null;
  sunset?: number | null;
  timezone?: number | null;
  condition: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordInput {
  location: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface UpdateRecordInput {
  location?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  displayName: string;
}

export type ExportFormat = 'json' | 'csv' | 'markdown' | 'pdf';

export interface RecordQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'location' | 'temperature' | 'startDate';
  sortOrder?: 'asc' | 'desc';
}
