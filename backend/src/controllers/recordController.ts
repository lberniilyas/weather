import { Request, Response } from 'express';
import prisma from '../config/database';
import { geocodeLocation } from '../services/geocodingService';
import { getWeatherByCoords } from '../services/weatherService';

function dbError(err: unknown): string {
  const msg = (err as Error).message ?? '';
  if (msg.includes("Can't reach database") || msg.includes('connect ECONNREFUSED') || msg.includes('connection refused'))
    return 'Database is unreachable. If you are using Supabase, please check your project is active (free-tier projects pause after inactivity — visit your Supabase dashboard to resume it).';
  if (msg.includes('timed out') || msg.includes('ETIMEDOUT'))
    return 'Database connection timed out. Please try again in a moment.';
  // Strip internal Prisma invocation details (file paths etc.) from the message
  const firstLine = msg.split('\n')[0].replace(/in C:\\.*?\.\w+:\d+:\d+/g, '').trim();
  return firstLine || 'A database error occurred.';
}

export const getRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = (req.query.search as string)?.trim() || undefined;
    const sortBy = (['createdAt', 'location', 'temperature', 'startDate'].includes(req.query.sortBy as string)
      ? req.query.sortBy
      : 'createdAt') as string;
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    const where = search ? { location: { contains: search, mode: 'insensitive' as const } } : {};

    const [records, total] = await Promise.all([
      prisma.weatherRecord.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.weatherRecord.count({ where }),
    ]);

    res.json({
      success: true,
      data: { data: records, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};

export const getRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const record = await prisma.weatherRecord.findUnique({ where: { id: req.params.id } });
    if (!record) { res.status(404).json({ success: false, error: 'Record not found' }); return; }
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};

export const createRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { location, startDate, endDate, notes } = req.body as {
      location: string; startDate: string; endDate: string; notes?: string;
    };

    // Validate and geocode location
    const geoResults = await geocodeLocation(location);
    if (!geoResults.length) {
      res.status(400).json({ success: false, error: `Location "${location}" not found. Please try a more specific name.` });
      return;
    }

    const { latitude, longitude, name } = geoResults[0];

    // Fetch live weather for that location
    const weather = await getWeatherByCoords(latitude, longitude);

    const record = await prisma.weatherRecord.create({
      data: {
        location: weather.location || name,
        latitude,
        longitude,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        temperature: weather.temperature,
        humidity: weather.humidity,
        condition: weather.condition,
        notes: notes?.trim() || null,
      },
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};

export const updateRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await prisma.weatherRecord.findUnique({ where: { id: req.params.id } });
    if (!existing) { res.status(404).json({ success: false, error: 'Record not found' }); return; }

    const { location, startDate, endDate, notes } = req.body as {
      location?: string; startDate?: string; endDate?: string; notes?: string | null;
    };

    let updateData: Record<string, unknown> = {};

    // Re-geocode only if location changed
    if (location && location !== existing.location) {
      const geoResults = await geocodeLocation(location);
      if (!geoResults.length) {
        res.status(400).json({ success: false, error: `Location "${location}" not found.` });
        return;
      }
      const { latitude, longitude, name } = geoResults[0];
      const weather = await getWeatherByCoords(latitude, longitude);
      updateData = { location: weather.location || name, latitude, longitude, temperature: weather.temperature, humidity: weather.humidity, condition: weather.condition };
    }

    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (notes !== undefined) updateData.notes = notes?.trim() || null;

    // Validate date range
    const finalStart = updateData.startDate as Date ?? existing.startDate;
    const finalEnd = updateData.endDate as Date ?? existing.endDate;
    if (finalStart > finalEnd) {
      res.status(400).json({ success: false, error: 'Start date must be before or equal to end date' });
      return;
    }

    const record = await prisma.weatherRecord.update({ where: { id: req.params.id }, data: updateData });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};

export const deleteRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await prisma.weatherRecord.findUnique({ where: { id: req.params.id } });
    if (!existing) { res.status(404).json({ success: false, error: 'Record not found' }); return; }
    await prisma.weatherRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};

export const bulkDeleteRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.body as { ids: string[] };
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, error: 'ids array is required' });
      return;
    }
    const { count } = await prisma.weatherRecord.deleteMany({ where: { id: { in: ids } } });
    res.json({ success: true, message: `${count} records deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};

export const deleteAllRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { count } = await prisma.weatherRecord.deleteMany();
    res.json({ success: true, message: `All ${count} records deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: dbError(err) });
  }
};
