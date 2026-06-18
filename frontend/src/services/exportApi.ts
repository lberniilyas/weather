import apiClient from '@/lib/axios';
import type { ExportFormat } from '@/types';

const CONTENT_TYPES: Record<ExportFormat, string> = {
  json: 'application/json',
  csv: 'text/csv',
  markdown: 'text/markdown',
  pdf: 'application/pdf',
};

const EXTENSIONS: Record<ExportFormat, string> = {
  json: 'json',
  csv: 'csv',
  markdown: 'md',
  pdf: 'pdf',
};

export const exportApi = {
  export: async (format: ExportFormat): Promise<void> => {
    const response = await apiClient.get(`/api/export/${format}`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: CONTENT_TYPES[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-records-${new Date().toISOString().split('T')[0]}.${EXTENSIONS[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
