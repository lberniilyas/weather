import type { WeatherRecord } from '@prisma/client';

// Serialises records to JSON string
export function toJSON(records: WeatherRecord[]): string {
  void records;
  throw new Error('exportService.toJSON — to be implemented');
}

// Serialises records to CSV string
export function toCSV(records: WeatherRecord[]): string {
  void records;
  throw new Error('exportService.toCSV — to be implemented');
}

// Serialises records to Markdown table
export function toMarkdown(records: WeatherRecord[]): string {
  void records;
  throw new Error('exportService.toMarkdown — to be implemented');
}

// Generates a PDF buffer from records
export async function toPDF(records: WeatherRecord[]): Promise<Buffer> {
  void records;
  throw new Error('exportService.toPDF — to be implemented');
}
