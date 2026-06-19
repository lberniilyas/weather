'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRecords } from '@/hooks/useRecords';
import { RecordForm } from './RecordForm';
import { LoadingOverlay } from '@/components/ui/Loading';
import type { WeatherData, WeatherRecord } from '@/types';

interface Props { currentWeather?: WeatherData | null }

function ConfirmModal({ onConfirm, onCancel, message }: { onConfirm: () => void; onCancel: () => void; message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
      <div className="glass rounded-2xl p-6 max-w-sm w-full border border-white/10">
        <p className="text-white text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 glass border border-white/10 text-slate-300 rounded-xl text-sm hover:text-white transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl text-sm font-semibold transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'location', label: 'Location' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'startDate', label: 'Start Date' },
];

export function RecordList({ currentWeather }: Props) {
  const { records, pagination, loading, error, loadRecords, removeRecord, removeMany } = useRecords();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<WeatherRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | 'bulk' | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const reload = useCallback(() => {
    loadRecords({ page, limit: 10, search: debouncedSearch || undefined, sortBy: sortBy as 'createdAt' | 'location' | 'temperature' | 'startDate', sortOrder });
  }, [loadRecords, page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => { reload(); }, [reload]);

  const toggleSelect = (id: string) => setSelected((prev) => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const toggleAll = () => {
    if (selected.size === records.length) setSelected(new Set());
    else setSelected(new Set(records.map((r) => r.id)));
  };

  const handleDelete = async (id: string) => {
    await removeRecord(id);
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {
    await removeMany([...selected]);
    setSelected(new Set());
    setDeleteTarget(null);
    reload();
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditRecord(null);
    reload();
  };

  const openEdit = (r: WeatherRecord) => { setEditRecord(r); setShowForm(true); };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by location…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-all"
          aria-label="Search records"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
        </select>
        <button
          onClick={() => setSortOrder((o) => o === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-2.5 glass border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition-all"
          aria-label="Toggle sort direction"
        >
          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
        <button
          onClick={() => { setEditRecord(null); setShowForm(true); }}
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/20 whitespace-nowrap"
        >
          + Add Record
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 glass rounded-xl border border-white/10 text-sm">
          <span className="text-slate-300">{selected.size} selected</span>
          <button
            onClick={() => setDeleteTarget('bulk')}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            Delete selected
          </button>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="glass rounded-2xl p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-semibold text-lg mb-5">{editRecord ? 'Edit Record' : 'Add Weather Record'}</h3>
            <RecordForm
              record={editRecord ?? undefined}
              defaultLocation={currentWeather?.location}
              onSuccess={handleFormSuccess}
              onCancel={() => { setShowForm(false); setEditRecord(null); }}
            />
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {deleteTarget && (
        <ConfirmModal
          message={deleteTarget === 'bulk' ? `Delete ${selected.size} selected records? This cannot be undone.` : 'Delete this record? This cannot be undone.'}
          onConfirm={deleteTarget === 'bulk' ? handleBulkDelete : () => handleDelete(deleteTarget as string)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Content */}
      {loading && <LoadingOverlay message="Loading records…" />}
      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">{error}</div>}

      {!loading && records.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🗂️</p>
          <p className="text-sm">No records yet. Search for a location and click "Add Record".</p>
        </div>
      )}

      {!loading && records.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden border border-white/10 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]" aria-label="Weather records">
            <thead>
              <tr className="border-b border-white/8">
                <th className="p-4 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === records.length && records.length > 0}
                    onChange={toggleAll}
                    className="accent-blue-500"
                    aria-label="Select all records"
                  />
                </th>
                {['Location', 'Dates', 'Temp', 'Condition', 'Notes', ''].map((h) => (
                  <th key={h} className="p-4 text-left text-slate-400 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="accent-blue-500" aria-label={`Select ${r.location}`} />
                  </td>
                  <td className="px-4 py-3 text-white font-medium max-w-[150px] truncate">{r.location}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-white">{Math.round(r.temperature)}°C</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">{r.condition}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate text-xs">{r.notes ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-white transition-colors text-xs px-2 py-1 rounded-lg hover:bg-white/10" aria-label={`Edit ${r.location}`}>Edit</button>
                      <button onClick={() => setDeleteTarget(r.id)} className="text-red-500/60 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-red-500/10" aria-label={`Delete ${r.location}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, pagination.total)} of {pagination.total}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 glass border border-white/10 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-all text-white"
            >←</button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg transition-all text-sm ${page === p ? 'bg-blue-500 text-white' : 'glass border border-white/10 text-slate-400 hover:bg-white/10'}`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 glass border border-white/10 rounded-lg disabled:opacity-30 hover:bg-white/10 transition-all text-white"
            >→</button>
          </div>
        </div>
      )}
    </div>
  );
}
