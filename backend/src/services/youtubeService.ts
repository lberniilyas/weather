import axios from 'axios';
import config from '../config/env';
import type { YouTubeVideo } from '../types';

const BASE = 'https://www.googleapis.com/youtube/v3';

export async function searchVideos(location: string, maxResults = 6): Promise<YouTubeVideo[]> {
  if (!config.youtubeApiKey) return [];

  const query = `${location} travel guide tourism`;

  const { data } = await axios.get(`${BASE}/search`, {
    params: {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults,
      videoCategoryId: '19', // Travel & Events
      relevanceLanguage: 'en',
      key: config.youtubeApiKey,
    },
  });

  if (!data.items?.length) return [];

  return data.items.map((item: Record<string, any>) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? '',
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}
