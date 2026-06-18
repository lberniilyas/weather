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

const router = Router();

// IMPORTANT: specific paths before parameterised :id
router.delete('/all', deleteAllRecords);
router.delete('/', bulkDeleteRecords);

router.get('/', getRecords);
router.post('/', createRecord);
router.get('/:id', getRecordById);
router.patch('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
