export function detectQueryType(query: string): 'coordinates' | 'zipcode' | 'city' {
  const trimmed = query.trim();
  if (/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(trimmed)) return 'coordinates';
  if (/^\d{4,10}$/.test(trimmed)) return 'zipcode';
  return 'city';
}

export function parseCoordinates(query: string): { lat: number; lon: number } | null {
  const match = query.trim().match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (!match) return null;
  return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
}
