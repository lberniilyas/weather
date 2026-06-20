import { Router } from 'express';
import { getWeatherInsights, parseLocation } from '../controllers/aiController';

const router = Router();

router.post('/insights', getWeatherInsights);
router.post('/parse-location', parseLocation);

export default router;
