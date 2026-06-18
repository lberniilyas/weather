'use client';
import { useState, useCallback } from 'react';
import { recordApi } from '@/services/recordApi';
import type { WeatherRecord, RecordQueryParams } from '@/types';

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useRecords() {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async (params: RecordQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recordApi.getAll(params);
      setRecords(result.data);
      setPagination({ total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecord = useCallback(async (id: string) => {
    await recordApi.delete(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const removeMany = useCallback(async (ids: string[]) => {
    await recordApi.deleteMany(ids);
    setRecords((prev) => prev.filter((r) => !ids.includes(r.id)));
  }, []);

  return { records, pagination, loading, error, loadRecords, removeRecord, removeMany };
}
