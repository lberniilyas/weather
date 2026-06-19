import { Router } from 'express';
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkDeleteRecords,
  deleteAllRecords,
} from '../controllers/recordController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// IMPORTANT: specific paths before parameterised :id
// Auth guard applied to all write / delete operations
router.delete('/all', requireApiKey, deleteAllRecords);
router.delete('/', requireApiKey, bulkDeleteRecords);

router.get('/', getRecords);
router.post('/', requireApiKey, createRecord);
router.get('/:id', getRecordById);
router.patch('/:id', requireApiKey, updateRecord);
router.delete('/:id', requireApiKey, deleteRecord);

export default router;
