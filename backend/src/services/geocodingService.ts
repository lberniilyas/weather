import axios from 'axios';
import type { GeocodingResult } from '../types';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// Validates a location string and returns geocoded results (fuzzy-matching via Nominatim)
export async function geocodeLocation(query: string): Promise<GeocodingResult[]> {
  void query;
  void axios;
  void NOMINATIM_BASE;
  throw new Error('geocodingService.geocodeLocation — to be implemented');
}

// Reverse geocodes lat/lon to a location name
export async function reverseGeocode(lat: number, lon: number): Promise<GeocodingResult> {
  void lat;
  void lon;
  throw new Error('geocodingService.reverseGeocode — to be implemented');
}
