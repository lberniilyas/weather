import request from 'supertest';
import app from '../app';

// jest.mock is hoisted before variable declarations, so the factory must not
// reference outer `const` vars. Use jest.fn() stubs here; wire return values
// in beforeEach after the variables are initialized.
jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    weatherRecord: {
      findMany:    jest.fn(),
      count:       jest.fn(),
      findUnique:  jest.fn(),
      create:      jest.fn(),
      update:      jest.fn(),
      delete:      jest.fn(),
      deleteMany:  jest.fn(),
    },
  },
}));

jest.mock('../services/geocodingService', () => ({
  geocodeLocation: jest.fn(),
}));

jest.mock('../services/weatherService', () => ({
  getWeatherByCoords: jest.fn(),
}));

// Shared fixture — available to both beforeEach and test assertions
const mockRecord = {
  id: 'cltest123',
  location: 'Paris',
  latitude: 48.8566,
  longitude: 2.3522,
  startDate: new Date('2026-06-01'),
  endDate: new Date('2026-06-07'),
  temperature: 18,
  feelsLike: 17,
  humidity: 65,
  windSpeed: 3.5,
  pressure: 1013,
  visibility: 10000,
  cloudCoverage: 5,
  sunrise: 1700000000,
  sunset: 1700040000,
  timezone: 3600,
  condition: 'Clear',
  notes: 'Test note',
  createdAt: new Date('2026-06-01T12:00:00Z'),
  updatedAt: new Date('2026-06-01T12:00:00Z'),
};

const mockGeo = [{ name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'FR', displayName: 'Paris, France' }];

const mockWeather = {
  location: 'Paris', country: 'FR', latitude: 48.8566, longitude: 2.3522,
  temperature: 18, feelsLike: 17, humidity: 65, condition: 'Clear',
  description: 'clear sky', windSpeed: 3.5, pressure: 1013,
  visibility: 10000, cloudCoverage: 5, sunrise: 1700000000,
  sunset: 1700040000, timezone: 3600, icon: '01d',
};

beforeEach(() => {
  const prisma = require('../config/database').default;
  prisma.weatherRecord.findMany.mockResolvedValue([mockRecord]);
  prisma.weatherRecord.count.mockResolvedValue(1);
  prisma.weatherRecord.findUnique.mockResolvedValue(mockRecord);
  prisma.weatherRecord.create.mockResolvedValue(mockRecord);
  prisma.weatherRecord.update.mockResolvedValue(mockRecord);
  prisma.weatherRecord.delete.mockResolvedValue(mockRecord);
  prisma.weatherRecord.deleteMany.mockResolvedValue({ count: 1 });

  const { geocodeLocation } = require('../services/geocodingService');
  geocodeLocation.mockResolvedValue(mockGeo);

  const { getWeatherByCoords } = require('../services/weatherService');
  getWeatherByCoords.mockResolvedValue(mockWeather);
});

describe('GET /api/records', () => {
  it('returns paginated records', async () => {
    const res = await request(app).get('/api/records');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.data).toHaveLength(1);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.totalPages).toBe(1);
  });

  it('accepts pagination params', async () => {
    const res = await request(app).get('/api/records?page=2&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data.page).toBe(2);
    expect(res.body.data.limit).toBe(5);
  });
});

describe('GET /api/records/:id', () => {
  it('returns 200 with record when found', async () => {
    const res = await request(app).get('/api/records/cltest123');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('cltest123');
    expect(res.body.data.location).toBe('Paris');
  });

  it('returns 404 when record not found', async () => {
    const prisma = require('../config/database').default;
    prisma.weatherRecord.findUnique.mockResolvedValueOnce(null);

    const res = await request(app).get('/api/records/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('POST /api/records', () => {
  it('creates a record with valid data and returns 201', async () => {
    const res = await request(app).post('/api/records').send({
      location: 'Paris',
      startDate: '2026-06-01',
      endDate: '2026-06-07',
      notes: 'Test note',
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.location).toBe('Paris');
    expect(res.body.data.temperature).toBe(18);
  });

  it('returns 400 when location resolves to no results', async () => {
    const { geocodeLocation } = require('../services/geocodingService');
    geocodeLocation.mockResolvedValueOnce([]);

    const res = await request(app).post('/api/records').send({
      location: 'xyzunknownplace99999',
      startDate: '2026-06-01',
      endDate: '2026-06-07',
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('PATCH /api/records/:id', () => {
  it('updates notes and returns 200', async () => {
    const prisma = require('../config/database').default;
    prisma.weatherRecord.update.mockResolvedValueOnce({ ...mockRecord, notes: 'Updated note' });

    const res = await request(app).patch('/api/records/cltest123').send({ notes: 'Updated note' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 when record does not exist', async () => {
    const prisma = require('../config/database').default;
    prisma.weatherRecord.findUnique.mockResolvedValueOnce(null);

    const res = await request(app).patch('/api/records/nonexistent').send({ notes: 'hi' });
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/records/:id', () => {
  it('deletes an existing record', async () => {
    const res = await request(app).delete('/api/records/cltest123');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Record deleted');
  });

  it('returns 404 when record does not exist', async () => {
    const prisma = require('../config/database').default;
    prisma.weatherRecord.findUnique.mockResolvedValueOnce(null);

    const res = await request(app).delete('/api/records/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/records (bulk)', () => {
  it('bulk deletes by ids array', async () => {
    const res = await request(app).delete('/api/records').send({ ids: ['cltest123'] });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/deleted/);
  });

  it('returns 400 when ids array is empty', async () => {
    const res = await request(app).delete('/api/records').send({ ids: [] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
