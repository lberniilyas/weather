'use client';
// Grid of embedded YouTube videos — travel, tourism, and city guides for the searched location
import type { YouTubeVideo } from '@/types';

export function VideoGrid({ videos }: { videos: YouTubeVideo[] }) {
  void videos;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
  );
}
