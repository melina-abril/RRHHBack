import { Router } from 'express';
import { currentUser } from '../../shared/auth/current-user.js';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { remunerationRequestSchema } from './remuneration.schemas.js';
import { remunerationService } from './remuneration.service.js';

export const remunerationRouter = Router();

/** GET /api/remunerations/:id */
remunerationRouter.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await remunerationService.listPeriods(id));
});

/** POST /api/remunerations/:id */
remunerationRouter.post('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const request = parse(remunerationRequestSchema, req.body);
  res.status(201).json(await remunerationService.createPeriod(id, request, currentUser(res).id));
});
