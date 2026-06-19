import request from 'supertest';
import app from '../app';

describe('Health & routing', () => {
  it('GET /health → 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('WeatherPro API running');
    expect(res.body.version).toBe('1.0.0');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('GET /unknown-route → 404 with error message', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Route not found');
  });
});
