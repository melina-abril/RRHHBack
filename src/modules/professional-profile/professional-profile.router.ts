import { Router } from 'express';
import { currentUser } from '../../shared/auth/current-user.js';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { professionalDocumentRequestSchema, professionalProfileRequestSchema } from './professional-profile.schemas.js';
import { professionalProfileService } from './professional-profile.service.js';

/** Montado bajo /api/professional-profiles; la sesión ya se exige en app.ts. */
export const professionalProfileRouter = Router();

professionalProfileRouter.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await professionalProfileService.get(id));
});

professionalProfileRouter.put('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await professionalProfileService.update(id, parse(professionalProfileRequestSchema, req.body), currentUser(res).id));
});

professionalProfileRouter.post('/:id/documents', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const document = await professionalProfileService.addDocument(id, parse(professionalDocumentRequestSchema, req.body), currentUser(res).id);
  res.status(201).json(document);
});
