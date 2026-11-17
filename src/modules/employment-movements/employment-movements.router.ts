import { Router } from 'express';
import { currentUser } from '../../shared/auth/current-user.js';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import {
  categoryChangeSchema,
  departureSchema,
  rehireSchema,
} from './employment-movements.schemas.js';
import { employmentMovementsService } from './employment-movements.service.js';

export const employmentMovementsRouter = Router();

employmentMovementsRouter.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await employmentMovementsService.get(id));
});

employmentMovementsRouter.post('/:id/category-change', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const request = parse(categoryChangeSchema, req.body);
  res.json(await employmentMovementsService.changeCategory(id, request, currentUser(res).id));
});

employmentMovementsRouter.post('/:id/departure', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const request = parse(departureSchema, req.body);
  res.json(await employmentMovementsService.registerDeparture(id, request, currentUser(res).id));
});

employmentMovementsRouter.post('/:id/rehire', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const request = parse(rehireSchema, req.body);
  res.json(await employmentMovementsService.registerRehire(id, request, currentUser(res).id));
});
