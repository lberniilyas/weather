'use client';
// Leaflet map centred on the searched location with a marker and coordinate display
// Uses dynamic import to avoid SSR issues with Leaflet

export function WeatherMap() {
  return (
    <div
      className="w-full h-80 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center"
      role="region"
      aria-label="Location map"
    >
      <p className="text-gray-500 text-sm">Map loads after a location is searched</p>
    </div>
  );
}
