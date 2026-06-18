'use client';
import dynamic from 'next/dynamic';
import { LoadingOverlay } from '@/components/ui/Loading';

const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => <LoadingOverlay message="Loading map…" />,
});

interface Props {
  latitude: number;
  longitude: number;
  location: string;
}

export function WeatherMap({ latitude, longitude, location }: Props) {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/10">
      <MapClient latitude={latitude} longitude={longitude} location={location} />
    </div>
  );
}
