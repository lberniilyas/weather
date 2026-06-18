import { Router } from 'express';

const router = Router();

// GET    /api/records          — list with pagination/search/sort/filter
// POST   /api/records          — create
// GET    /api/records/:id      — read one
// PATCH  /api/records/:id      — update
// DELETE /api/records/:id      — delete one
// DELETE /api/records          — bulk delete (body: { ids })
// DELETE /api/records/all      — delete all

export default router;
