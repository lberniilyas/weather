interface Entry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, Entry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  size(): number {
    return this.store.size;
  }
}

export const cache = new MemoryCache();

export const TTL = {
  WEATHER: 5 * 60 * 1000,   // 5 min — current conditions update infrequently
  FORECAST: 30 * 60 * 1000, // 30 min — forecast data is stable
};
