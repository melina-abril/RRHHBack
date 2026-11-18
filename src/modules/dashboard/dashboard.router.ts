import { Router } from 'express';
import { requireRole } from '../../shared/auth/require-session.js';
import { dashboardService } from './dashboard.service.js';

export const dashboardRouter = Router();

/** GET /api/dashboard/summary */
dashboardRouter.get('/summary', requireRole('ADMIN'), async (_req, res) => {
  res.json(await dashboardService.getSummary());
});
