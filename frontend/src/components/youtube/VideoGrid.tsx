'use client';
import type { YouTubeVideo } from '@/types';

interface Props { videos: YouTubeVideo[] }

export function VideoGrid({ videos }: Props) {
  if (!videos.length) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-slate-500 text-sm">
        No travel videos found for this location.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list" aria-label="Travel videos">
      {videos.map((v) => (
        <div
          key={v.id}
          className="glass rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
          role="listitem"
        >
          <div className="relative aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${v.id}?rel=0&modestbranding=1`}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
          <div className="p-3">
            <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{v.title}</p>
            <p className="text-slate-500 text-xs mt-1 truncate">{v.channelTitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
