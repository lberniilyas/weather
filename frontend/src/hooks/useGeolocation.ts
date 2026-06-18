'use client';
import { useState, useCallback } from 'react';

interface GeoState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const GEO_ERRORS: Record<number, string> = {
  1: 'Location access denied. Please allow location permission and try again.',
  2: 'Location unavailable. Please try again.',
  3: 'Location request timed out. Please try again.',
};

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator?.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({
          latitude: coords.latitude,
          longitude: coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setState((s) => ({
          ...s,
          error: GEO_ERRORS[err.code] ?? 'Failed to get your location.',
          loading: false,
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  return { ...state, getCurrentLocation };
}
