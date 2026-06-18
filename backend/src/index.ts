import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes';
import recordRoutes from './routes/recordRoutes';
import exportRoutes from './routes/exportRoutes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'WeatherPro API running', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.use('/api/weather', weatherRoutes);
app.use('/api/youtube', weatherRoutes);   // /api/youtube/videos re-uses the weather router's /videos handler
app.use('/api/records', recordRoutes);
app.use('/api/export', exportRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
