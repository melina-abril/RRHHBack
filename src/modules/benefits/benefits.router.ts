import { Router } from 'express';
import { currentUser } from '../../shared/auth/current-user.js';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { benefitAdjustmentSchema } from './benefits.schemas.js';
import { benefitsService } from './benefits.service.js';

export const benefitsRouter = Router();

benefitsRouter.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await benefitsService.getBenefitBalances(id));
});

benefitsRouter.get('/:id/movements', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await benefitsService.listBenefitMovements(id));
});

benefitsRouter.post('/:id/adjustments', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const request = parse(benefitAdjustmentSchema, req.body);
  res.status(201).json(await benefitsService.createBenefitAdjustment(id, request, currentUser(res).id));
});
