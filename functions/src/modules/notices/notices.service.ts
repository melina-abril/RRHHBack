import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDateTime } from '../../shared/firestore';
import { NotFoundError, BusinessRuleError } from '../../shared/http/errors';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import {
  NoticeDto,
  NoticeRequest,
  NoticeFilters,
  NoticeDeliveryState,
  NOTICE_DELIVERY_STATES
} from './notices.dto';
import { NoticeRecord, noticesRepository } from './notices.repository';
import { currentUser } from '../../shared/auth/session-user';
import type { Request } from 'express';

/** Mapea de Firestore a DTO. */
const toDto = (notice: NoticeRecord): NoticeDto => ({
  id: notice.id,
  subject: notice.subject,
  body: notice.body,
  sentById: notice.sentById,
  sentByName: notice.sentByName,
  targetEmployeeIds: notice.targetEmployeeIds,
  targetDepartments: notice.targetDepartments,
  sentAt: toIsoDateTime(notice.sentAt),
  deliveryState: notice.deliveryState,
  deliveryResult: notice.deliveryResult ?? null,
  errors: notice.errors ?? null
});

function matchesFilters(notice: NoticeRecord, filters: NoticeFilters): boolean {
  // Por ahora sólo búsqueda por search (en subject o body) y estado de entrega.
  const term = filters.search?.toLowerCase() ?? '';
  const matchesTerm = !term || notice.subject.toLowerCase().includes(term) || notice.body.toLowerCase().includes(term);
  const matchesDepartment = !filters.department || (notice.targetDepartments && notice.targetDepartments.includes(filters.department));
  const matchesState = !filters.deliveryState || notice.deliveryState === filters.deliveryState;
  return matchesTerm && matchesDepartment && matchesState;
}

export const noticesService = {
  /** Listado paginado, filtrado por filtros básicos. */
  async list(filters: NoticeFilters, pageQuery: PageQuery): Promise<Page<NoticeDto>> {
    const all = await noticesRepository.findAll();
    const filtered = all.filter((n) => matchesFilters(n, filters));
    return toPage(filtered, pageQuery, toDto);
  },

  async get(id: string): Promise<NoticeDto> {
    const notice = await noticesRepository.findById(id);
    if (!notice) throw new NotFoundError(`No existe el comunicado ${id}.`);
    return toDto(notice);
  },

  /** Alta: añade el comunicado, con estado 'SENT' y sentAt en el momento. Envía a los destinatarios seleccionados. */
  async create(request: NoticeRequest, req: Request): Promise<NoticeDto> {
    const user = currentUser(req);
    // Validación de destinatarios
    if ((!request.targetEmployeeIds || request.targetEmployeeIds.length === 0) && (!request.targetDepartments || request.targetDepartments.length === 0)) {
      throw new BusinessRuleError('NO_RECIPIENTS', 'Debes seleccionar al menos un destinatario.');
    }
    // Simulación del envío del correo: los errores reales de mail los maneja la integración posterior.
    const docData = {
      subject: request.subject,
      body: request.body,
      sentById: user.id,
      sentByName: user.name,
      targetEmployeeIds: request.targetEmployeeIds,
      targetDepartments: request.targetDepartments,
      sentAt: Timestamp.now(),
      deliveryState: 'SENT' as NoticeDeliveryState,
      deliveryResult: `Enviado a ${request.targetEmployeeIds.length} destinatario(s).`,
      errors: [] as any[],
      createdAt: Timestamp.now(),
    };
    const created = await noticesRepository.create(docData);
    return toDto(created);
  }
};
