import axios from 'axios';
import config from '../config/env';
import type { YouTubeVideo } from '../types';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

// Searches YouTube for travel/tourism videos for a given location
export async function searchVideos(location: string, maxResults = 6): Promise<YouTubeVideo[]> {
  void location;
  void maxResults;
  void axios;
  void config;
  void YT_BASE;
  throw new Error('youtubeService.searchVideos — to be implemented');
}
