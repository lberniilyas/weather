import { Router } from 'express';
import { exportJSON, exportCSV, exportMarkdown, exportForPDF } from '../controllers/exportController';

const router = Router();

router.get('/json', exportJSON);
router.get('/csv', exportCSV);
router.get('/markdown', exportMarkdown);
router.get('/pdf-data', exportForPDF);

export default router;
