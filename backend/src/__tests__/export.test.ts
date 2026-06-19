import request from 'supertest';
import app from '../app';

jest.mock('../config/database', () => ({
  __esModule: true,
  default: {
    weatherRecord: {
      findMany: jest.fn(),
    },
  },
}));

const mockRecords = [
  {
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
    sunrise: 1748764800,
    sunset: 1748808000,
    timezone: 7200,
    condition: 'Clear',
    notes: 'Business trip',
    createdAt: new Date('2026-06-01T12:00:00Z'),
    updatedAt: new Date('2026-06-01T12:00:00Z'),
  },
];

beforeEach(() => {
  const prisma = require('../config/database').default;
  prisma.weatherRecord.findMany.mockResolvedValue(mockRecords);
});

describe('GET /api/export/json', () => {
  it('returns 200 with application/json and attachment header', async () => {
    const res = await request(app).get('/api/export/json');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.headers['content-disposition']).toMatch(/attachment/);
    expect(res.headers['content-disposition']).toMatch(/\.json/);
  });

  it('body is a JSON array with formatted fields', async () => {
    const res = await request(app).get('/api/export/json');
    const data = JSON.parse(res.text);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].location).toBe('Paris');
    expect(data[0].temperature).toBe('18°C');
    expect(data[0].humidity).toBe('65%');
    expect(data[0].condition).toBe('Clear');
  });
});

describe('GET /api/export/csv', () => {
  it('returns 200 with text/csv content-type', async () => {
    const res = await request(app).get('/api/export/csv');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    expect(res.headers['content-disposition']).toMatch(/\.csv/);
  });

  it('CSV header row contains expected column names', async () => {
    const res = await request(app).get('/api/export/csv');
    const header = res.text.split('\n')[0];
    expect(header).toContain('Location');
    expect(header).toContain('Temp');
    expect(header).toContain('Humidity');
    expect(header).toContain('Condition');
  });

  it('CSV data row contains Paris record', async () => {
    const res = await request(app).get('/api/export/csv');
    expect(res.text).toContain('Paris');
    expect(res.text).toContain('Clear');
  });
});

describe('GET /api/export/markdown', () => {
  it('returns 200 with text/markdown content-type', async () => {
    const res = await request(app).get('/api/export/markdown');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/markdown/);
    expect(res.headers['content-disposition']).toMatch(/\.md/);
  });

  it('Markdown body contains title, table header, and data', async () => {
    const res = await request(app).get('/api/export/markdown');
    expect(res.text).toContain('# WeatherPro');
    expect(res.text).toContain('| Location |');
    expect(res.text).toContain('Paris');
    expect(res.text).toContain('Clear');
  });
});

describe('GET /api/export/pdf-data', () => {
  it('returns 200 with JSON array for client-side PDF rendering', async () => {
    const res = await request(app).get('/api/export/pdf-data');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].location).toBe('Paris');
    expect(res.body.data[0].temperature).toBe(18);
  });
});
