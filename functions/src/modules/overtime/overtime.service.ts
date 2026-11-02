import { Timestamp } from 'firebase-admin/firestore';
import { createWithNextCode, toIsoDateTime } from '../../shared/firestore';
import { NotFoundError, ConflictError, BusinessRuleError } from '../../shared/http/errors';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import {
  AuthorizeOvertimeRequestRequest,
  CompensationStatus,
  OVERTIME_STATUSES,
  OvertimeRequestDoc,
  OvertimeRequestDto,
  OvertimeRequestRequest,
  OvertimeRequestStatus
} from './overtime.dto';
import { OvertimeRequestRecord, overtimeRepository } from './overtime.repository';

function toDto(record: OvertimeRequestRecord): OvertimeRequestDto {
  return {
    id: record.id,
    employeeId: record.employeeId,
    month: record.month,
    requestedById: record.requestedById,
    leaderId: record.leaderId,
    directorId: record.directorId,
    status: record.status,
    requestedHours: record.requestedHours,
    authorizedHours: record.authorizedHours,
    workedHours: record.workedHours,
    compensationHours: record.compensationHours,
    compensationStatus: record.compensationStatus,
    comments: record.comments,
    createdAt: toIsoDateTime(record.createdAt) ?? '',
    updatedAt: toIsoDateTime(record.updatedAt) ?? ''
  };
}

export const overtimeService = {
  /**
   * Lista todas las solicitudes de horas extras.
   */
  async list(pageQuery: PageQuery): Promise<Page<OvertimeRequestDto>> {
    const all = await overtimeRepository.findAll();
    return toPage(all, pageQuery, toDto);
  },

  /**
   * Crea una nueva solicitud de horas extras.
   * El id (OT-YYYYMM123) debe ser correlativo y generado por createWithNextCode.
   */
  async create(request: OvertimeRequestRequest): Promise<OvertimeRequestDto> {
    // Validar que no exista una solicitud igual en el mismo mes por el mismo empleado
    const all = await overtimeRepository.findAll();
    if (all.find((r) => r.employeeId === request.employeeId && r.month === request.month && r.status !== 'REJECTED')) {
      throw new ConflictError('Ya existe una solicitud de horas extras para ese empleado y mes.', 'month');
    }
    // Id correlativo: OT-YYYYMMNNN
    const period = request.month.replace('-', '');
    const prefix = `OT-${period}`;
    const docObj = (id: string): OvertimeRequestDoc => ({
      employeeId: request.employeeId,
      month: request.month,
      requestedById: request.requestedById,
      leaderId: request.leaderId,
      directorId: request.directorId,
      status: 'PENDING_APPROVAL',
      requestedHours: request.requestedHours,
      authorizedHours: null,
      workedHours: null,
      compensationHours: null,
      compensationStatus: null,
      comments: request.comments ?? null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    const { id, data } = await createWithNextCode('overtimeRequests', prefix, docObj, 3);
    const record = await overtimeRepository.create(id, data);
    return toDto(record);
  },

  /**
   * Autoriza una solicitud de horas extras y registra los datos correspondientes.
   */
  async authorize(id: string, req: AuthorizeOvertimeRequestRequest): Promise<OvertimeRequestDto> {
    const record = await overtimeRepository.findById(id);
    if (!record) throw new NotFoundError('No existe la solicitud de horas extras.');
    if (record.status !== 'PENDING_APPROVAL') {
      throw new BusinessRuleError('OVERTIME_NOT_PENDING', 'Solo se pueden autorizar solicitudes en estado Pendiente de aprobación.');
    }
    const update: Partial<OvertimeRequestDoc> = {
      status: 'AUTHORIZED',
      authorizedHours: req.authorizedHours,
      workedHours: req.workedHours,
      compensationHours: req.compensationHours,
      compensationStatus: req.compensationStatus,
      comments: req.comments ?? null,
      updatedAt: Timestamp.now()
    };
    const updated = await overtimeRepository.update(id, update);
    if (!updated) throw new NotFoundError('No se pudo actualizar la solicitud.');
    return toDto(updated);
  }
};
