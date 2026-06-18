'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default icon URLs in bundled environments
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  latitude: number;
  longitude: number;
  location: string;
}

export default function MapClient({ latitude, longitude, location }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [latitude, longitude],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<strong>${location}</strong><br/>${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      .openPopup();

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pan / re-marker when location changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo([latitude, longitude], 10, { animate: true, duration: 1 });
    map.eachLayer((l) => { if ((l as L.Marker).getLatLng) map.removeLayer(l); });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<strong>${location}</strong><br/>${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      .openPopup();
  }, [latitude, longitude, location]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[360px] rounded-2xl overflow-hidden border border-white/10"
      aria-label={`Interactive map showing ${location}`}
    />
  );
}
