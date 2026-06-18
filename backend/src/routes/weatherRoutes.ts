import { Router } from 'express';
import {
  searchWeather,
  getWeatherByCoordinates,
  getForecast,
  getLocationSuggestions,
  getYouTubeVideos,
} from '../controllers/weatherController';

const router = Router();

router.get('/search', searchWeather);
router.get('/coordinates', getWeatherByCoordinates);
router.get('/forecast', getForecast);
router.get('/suggestions', getLocationSuggestions);
router.get('/videos', getYouTubeVideos);

export default router;
