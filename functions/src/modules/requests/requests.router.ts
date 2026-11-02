import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import {
  REQUEST_STATUSES,
  RequestFilters
} from './requests.dto';
import { currentUser } from '../../shared/auth/session-user';
import { requestsService } from './requests.service';

export const requestsRouter = Router();

// Filtros de búsqueda
function parseRequestFilters(req: Request): RequestFilters {
  const status = queryText(req.query, 'status');
  let parsedStatus = null;
  if (status && (REQUEST_STATUSES as readonly string[]).includes(status)) {
    parsedStatus = status;
  }
  let type = queryText(req.query, 'type');
  const validTypes = ['VACATION', 'LEAVE', 'ABSENCE'];
  if (type && !validTypes.includes(type)) type = null;
  const filters: RequestFilters = {
    search: queryText(req.query, 'search'),
    employeeId: queryText(req.query, 'employeeId'),
    status: parsedStatus,
    type: type as 'VACATION' | 'LEAVE' | 'ABSENCE' | null
  };
  return filters;
}

/**
 * Lista las solicitudes de los tres tipos (vacaciones, licencias, ausencias), paginadas y filtradas.
 * GET /api/requests?search=&status=&employeeId=&type=&page=&size=
 */
requestsRouter.get('/', async (req, res) => {
  const filters = parseRequestFilters(req);
  const pageQuery = parsePageQuery(req.query);
  res.json(await requestsService.list(filters, pageQuery));
});

/**
 * Detalles de una solicitud.
 * GET /api/requests/:id
 */
requestsRouter.get('/:id', async (req: Request<{ id: string }>, res) => {
  res.json(await requestsService.get(req.params.id));
});

/**
 * Aprueba una solicitud pendiente. POST /api/requests/:id/approve
 * Solo ADMIN o HR_ANALYST pueden aprobar/rechazar solicitudes.
 */
requestsRouter.post('/:id/approve', requireRole('ADMIN', 'HR_ANALYST'), async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const user = currentUser(req);
  res.json(await requestsService.approve(id, user.id));
});

/**
 * Rechaza una solicitud pendiente. POST /api/requests/:id/reject
 * Body: { reason: string }
 */
requestsRouter.post('/:id/reject', requireRole('ADMIN', 'HR_ANALYST'), async (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const user = currentUser(req);
  const body = new BodyReader(req.body);
  const reason = body.text('reason', { max: 300, message: 'Debes ingresar el motivo.' });
  body.done();
  res.json(await requestsService.reject(id, user.id, reason));
});
