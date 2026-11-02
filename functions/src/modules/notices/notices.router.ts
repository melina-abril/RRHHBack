import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import { NOTICE_DELIVERY_STATES, NoticeRequest, NoticeDeliveryState } from './notices.dto';
import { noticesService } from './notices.service';

/**
 * Router del módulo notices: comunicados.
 * - GET /notices: listado paginado y filtrado de comunicados.
 * - POST /notices: crea y envía un comunicado, solo ADMIN.
 * - GET /notices/:id: detalle de un comunicado.
 */
export const noticesRouter = Router();

function readNoticeRequest(req: Request): NoticeRequest {
  const body = new BodyReader(req.body);
  const request: NoticeRequest = {
    subject: body.text('subject', { max: 120, message: 'El asunto es obligatorio.' }),
    body: body.text('body', { max: 2000, message: 'El contenido es obligatorio.' }),
    targetEmployeeIds: Array.isArray(req.body.targetEmployeeIds) ? req.body.targetEmployeeIds.filter((v: unknown) => typeof v === 'string') : [],
    targetDepartments: Array.isArray(req.body.targetDepartments)
      ? req.body.targetDepartments.filter((v: unknown) => typeof v === 'string')
      : null,
  };
  if (!request.targetDepartments || request.targetDepartments.length === 0) {
    request.targetDepartments = null;
  }
  body.done();
  return request;
}

// GET /api/notices?search=&deliveryState=&department=&page=&size=
noticesRouter.get('/', async (req, res) => {
  const deliveryState = queryText(req.query, 'deliveryState');
  const filters = {
    search: queryText(req.query, 'search'),
    department: queryText(req.query, 'department'),
    deliveryState:
      deliveryState && (NOTICE_DELIVERY_STATES as readonly string[]).includes(deliveryState)
        ? (deliveryState as NoticeDeliveryState)
        : null,
  };
  res.json(await noticesService.list(filters, parsePageQuery(req.query)));
});

// GET /api/notices/:id
noticesRouter.get('/:id', async (req: Request<{ id: string }>, res) => {
  res.json(await noticesService.get(req.params.id));
});

// POST /api/notices — solo ADMIN
noticesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  res.status(201).json(await noticesService.create(readNoticeRequest(req), req));
});
