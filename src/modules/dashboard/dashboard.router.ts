import { Router } from 'express';
import { requireRole } from '../../shared/auth/require-session.js';
import { dashboardService } from './dashboard.service.js';

/** Montado en /api/dashboard por src/routes.ts. La sesión ya se exige en app.ts. */
export const dashboardRouter = Router();

dashboardRouter.get('/summary', requireRole('ADMIN'), async (_req, res) => {
  res.json(await dashboardService.getSummary());
});
