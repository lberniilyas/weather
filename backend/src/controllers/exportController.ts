import { Request, Response } from 'express';
import prisma from '../config/database';
import { toJSON, toCSV, toMarkdown } from '../services/exportService';

const DATE_SUFFIX = () => new Date().toISOString().split('T')[0];

async function getAllRecords() {
  return prisma.weatherRecord.findMany({ orderBy: { createdAt: 'desc' } });
}

export const exportJSON = async (_req: Request, res: Response): Promise<void> => {
  try {
    const records = await getAllRecords();
    const json = toJSON(records);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="weather-records-${DATE_SUFFIX()}.json"`);
    res.send(json);
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const exportCSV = async (_req: Request, res: Response): Promise<void> => {
  try {
    const records = await getAllRecords();
    const csv = toCSV(records);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="weather-records-${DATE_SUFFIX()}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

export const exportMarkdown = async (_req: Request, res: Response): Promise<void> => {
  try {
    const records = await getAllRecords();
    const md = toMarkdown(records);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="weather-records-${DATE_SUFFIX()}.md"`);
    res.send(md);
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};

// Returns all records as JSON for the frontend to generate a PDF with jsPDF
export const exportForPDF = async (_req: Request, res: Response): Promise<void> => {
  try {
    const records = await getAllRecords();
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
};
