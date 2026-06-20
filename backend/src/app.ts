import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import weatherRoutes from './routes/weatherRoutes';
import recordRoutes from './routes/recordRoutes';
import exportRoutes from './routes/exportRoutes';
import aiRoutes from './routes/aiRoutes';

// dotenv.config() is intentionally called only in index.ts (the real server entry point).
// When app.ts is imported directly by tests, no .env is loaded, so API_KEY is undefined
// and the auth middleware correctly operates in passthrough mode.

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again in 15 minutes.' },
});

const weatherLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many weather searches. Please wait a moment.' },
});

const exportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many export requests. Please wait a moment.' },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many AI requests. Please wait a moment.' },
});

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(process.env.NODE_ENV === 'test' ? morgan('silent') : morgan('dev'));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'WeatherPro API running', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.use('/api/weather', weatherLimiter, weatherRoutes);
app.use('/api/youtube', weatherLimiter, weatherRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/export', exportLimiter, exportRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

export default app;
