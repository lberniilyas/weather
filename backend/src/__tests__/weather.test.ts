import request from 'supertest';
import app from '../app';

// Mock all external service calls — tests must never hit real APIs
jest.mock('../services/weatherService', () => ({
  getCurrentWeather: jest.fn().mockResolvedValue({
    location: 'Paris',
    country: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    temperature: 18,
    feelsLike: 17,
    humidity: 65,
    condition: 'Clear',
    description: 'clear sky',
    windSpeed: 3.5,
    pressure: 1013,
    visibility: 10000,
    cloudCoverage: 5,
    sunrise: 1700000000,
    sunset: 1700040000,
    timezone: 3600,
    icon: '01d',
  }),
  getWeatherByCoords: jest.fn().mockResolvedValue({
    location: 'London',
    country: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    temperature: 14,
    feelsLike: 13,
    humidity: 75,
    condition: 'Clouds',
    description: 'overcast clouds',
    windSpeed: 5.1,
    pressure: 1008,
    visibility: 9000,
    cloudCoverage: 90,
    sunrise: 1700001000,
    sunset: 1700038000,
    timezone: 0,
    icon: '04d',
  }),
  get5DayForecast: jest.fn().mockResolvedValue([
    { date: '2026-06-20', temperature: 19, minTemp: 14, maxTemp: 22, humidity: 60, windSpeed: 3.0, condition: 'Clear', icon: '01d' },
    { date: '2026-06-21', temperature: 21, minTemp: 15, maxTemp: 24, humidity: 55, windSpeed: 2.8, condition: 'Clear', icon: '01d' },
  ]),
}));

jest.mock('../services/geocodingService', () => ({
  geocodeLocation: jest.fn().mockResolvedValue([
    { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'FR', displayName: 'Paris, France' },
  ]),
}));

jest.mock('../services/youtubeService', () => ({
  searchVideos: jest.fn().mockResolvedValue([
    { id: 'abc123', title: 'Paris Travel Guide', description: '', thumbnail: '', channelTitle: 'Travel Channel', publishedAt: '2024-01-01T00:00:00Z' },
  ]),
}));

describe('GET /api/weather/search', () => {
  it('returns 400 when query is missing', async () => {
    const res = await request(app).get('/api/weather/search');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 400 when query is blank', async () => {
    const res = await request(app).get('/api/weather/search?query=   ');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 with weather data for valid query', async () => {
    const res = await request(app).get('/api/weather/search?query=Paris');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.location).toBe('Paris');
    expect(typeof res.body.data.temperature).toBe('number');
    expect(typeof res.body.data.humidity).toBe('number');
  });
});

describe('GET /api/weather/coordinates', () => {
  it('returns 400 when lat/lon are missing', async () => {
    const res = await request(app).get('/api/weather/coordinates');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when lat/lon are not numbers', async () => {
    const res = await request(app).get('/api/weather/coordinates?lat=abc&lon=xyz');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 with weather data for valid coordinates', async () => {
    const res = await request(app).get('/api/weather/coordinates?lat=51.5074&lon=-0.1278');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.location).toBe('London');
  });
});

describe('GET /api/weather/forecast', () => {
  it('returns 400 when query is missing', async () => {
    const res = await request(app).get('/api/weather/forecast');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 200 with forecast array', async () => {
    const res = await request(app).get('/api/weather/forecast?query=Paris');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('date');
    expect(res.body.data[0]).toHaveProperty('temperature');
  });
});

describe('GET /api/weather/suggestions', () => {
  it('returns empty array when query is too short', async () => {
    const res = await request(app).get('/api/weather/suggestions?query=P');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('returns suggestions for valid query', async () => {
    const res = await request(app).get('/api/weather/suggestions?query=Paris');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
