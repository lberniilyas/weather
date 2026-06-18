import apiClient from '@/lib/axios';
import type {
  WeatherRecord,
  CreateRecordInput,
  UpdateRecordInput,
  PaginatedResponse,
  RecordQueryParams,
} from '@/types';

export const recordApi = {
  getAll: async (params: RecordQueryParams = {}): Promise<PaginatedResponse<WeatherRecord>> => {
    const { data } = await apiClient.get('/api/records', { params });
    return data.data;
  },

  getById: async (id: string): Promise<WeatherRecord> => {
    const { data } = await apiClient.get(`/api/records/${id}`);
    return data.data;
  },

  create: async (input: CreateRecordInput): Promise<WeatherRecord> => {
    const { data } = await apiClient.post('/api/records', input);
    return data.data;
  },

  update: async (id: string, input: UpdateRecordInput): Promise<WeatherRecord> => {
    const { data } = await apiClient.patch(`/api/records/${id}`, input);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/records/${id}`);
  },

  deleteMany: async (ids: string[]): Promise<void> => {
    await apiClient.delete('/api/records', { data: { ids } });
  },

  deleteAll: async (): Promise<void> => {
    await apiClient.delete('/api/records/all');
  },
};
