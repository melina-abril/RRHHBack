import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery } from '../../shared/http/page';
import { COMPENSATION_STATUSES, OvertimeRequestRequest, AuthorizeOvertimeRequestRequest } from './overtime.dto';
import { overtimeService } from './overtime.service';

/**
 * Router del módulo Horas Extras.
 *
 * GET /api/overtime-requests
 * POST /api/overtime-requests (solo ADMIN)
 * POST /api/overtime-requests/:id/authorize (solo ADMIN)
 */
export const overtimeRouter = Router();

function readOvertimeRequest(req: Request): OvertimeRequestRequest {
  const body = new BodyReader(req.body);
  const request: OvertimeRequestRequest = {
    employeeId: body.text('employeeId', { max: 20, message: 'El ID de empleado es obligatorio.' }),
    month: body.text('month', { max: 7, message: 'El mes es obligatorio (YYYY-MM).' }),
    requestedById: body.text('requestedById', { max: 20, message: 'El ID del solicitante es obligatorio.' }),
    leaderId: body.text('leaderId', { max: 20, message: 'El ID de líder es obligatorio.' }),
    directorId: body.text('directorId', { max: 20, message: 'El ID de director es obligatorio.' }),
    requestedHours: body.number('requestedHours', { min: 1, max: 120, integer: true }),
    comments: body.optionalText('comments', { max: 255 }) ?? null
  };
  body.done();
  return request;
}

function readAuthorizeOvertimeRequest(req: Request): AuthorizeOvertimeRequestRequest {
  const body = new BodyReader(req.body);
  const request: AuthorizeOvertimeRequestRequest = {
    authorizedHours: body.number('authorizedHours', { min: 0, max: 120, integer: true }),
    workedHours: body.number('workedHours', { min: 0, max: 120, integer: true }),
    compensationHours: body.number('compensationHours', { min: 0, max: 120, integer: true }),
    compensationStatus: body.oneOf('compensationStatus', COMPENSATION_STATUSES, 'Selecciona un estado de compensación.'),
    comments: body.optionalText('comments', { max: 255 }) ?? null
  };
  body.done();
  return request;
}

// GET /api/overtime-requests? page & size
overtimeRouter.get('/overtime-requests', async (req, res) => {
  res.json(await overtimeService.list(parsePageQuery(req.query)));
});

// POST /api/overtime-requests — solo ADMIN
overtimeRouter.post('/overtime-requests', requireRole('ADMIN'), async (req, res) => {
  res.status(201).json(await overtimeService.create(readOvertimeRequest(req)));
});

// POST /api/overtime-requests/:id/authorize — solo ADMIN
overtimeRouter.post('/overtime-requests/:id/authorize', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  res.json(await overtimeService.authorize(req.params.id, readAuthorizeOvertimeRequest(req)));
});
