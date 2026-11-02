import { NotFoundError, BusinessRuleError } from '../../shared/http/errors';
import { toIsoDate } from '../../shared/firestore';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import {
  VacationRequestDoc,
  LeaveRequestDoc,
  AbsenceRequestDoc,
  RequestDto,
  RequestFilters
} from './requests.dto';
import { requestsRepository } from './requests.repository';

const toVacationRequestDto = (doc: VacationRequestDoc & { id: string }): RequestDto => ({
  id: doc.id,
  type: 'VACATION',
  employeeId: doc.employeeId,
  status: doc.status,
  reason: doc.reason ?? null,
  submittedAt: toIsoDate(doc.submittedAt) ?? '',
  decidedAt: doc.decidedAt ? toIsoDate(doc.decidedAt) : null,
  approverId: doc.approverId,
  startDate: toIsoDate(doc.startDate) ?? '',
  endDate: toIsoDate(doc.endDate) ?? '',
  days: doc.days
});

const toLeaveRequestDto = (doc: LeaveRequestDoc & { id: string }): RequestDto => ({
  id: doc.id,
  type: 'LEAVE',
  employeeId: doc.employeeId,
  status: doc.status,
  reason: doc.reason ?? null,
  submittedAt: toIsoDate(doc.submittedAt) ?? '',
  decidedAt: doc.decidedAt ? toIsoDate(doc.decidedAt) : null,
  approverId: doc.approverId,
  leaveType: doc.leaveType,
  startDate: toIsoDate(doc.startDate) ?? '',
  endDate: toIsoDate(doc.endDate) ?? '',
  days: doc.days,
  documentation: doc.documentation ?? null
});

const toAbsenceRequestDto = (doc: AbsenceRequestDoc & { id: string }): RequestDto => ({
  id: doc.id,
  type: 'ABSENCE',
  employeeId: doc.employeeId,
  status: doc.status,
  reason: doc.reason ?? null,
  submittedAt: toIsoDate(doc.submittedAt) ?? '',
  decidedAt: doc.decidedAt ? toIsoDate(doc.decidedAt) : null,
  approverId: doc.approverId,
  absenceType: doc.type,
  date: toIsoDate(doc.date) ?? '',
  hours: doc.hours
});

function applyFilters(
  list: RequestDto[],
  filters: RequestFilters
): RequestDto[] {
  return list.filter((req) => {
    if (filters.type && req.type !== filters.type) return false;
    if (filters.status && req.status !== filters.status) return false;
    if (filters.employeeId && req.employeeId !== filters.employeeId) return false;
    if (filters.search) {
      // Busca coincidencias simples en el motivo o id.
      const term = filters.search.toLowerCase();
      if (
        !(req.id.toLowerCase().includes(term) || (req.reason?.toLowerCase().includes(term) ?? false))
      ) {
        return false;
      }
    }
    return true;
  });
}

export const requestsService = {
  async list(filters: RequestFilters, pageQuery: PageQuery): Promise<Page<RequestDto>> {
    const { vacations, leaves, absences } = await requestsRepository.findAllRaw();
    const all: RequestDto[] = [
      ...vacations.map(toVacationRequestDto),
      ...leaves.map(toLeaveRequestDto),
      ...absences.map(toAbsenceRequestDto)
    ];
    const filtered = applyFilters(all, filters);
    // Por defecto, ordenar descendente por submittedAt
    filtered.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    return toPage(filtered, pageQuery, (x) => x);
  },
  async get(id: string): Promise<RequestDto> {
    const request = await requestsRepository.findById(id);
    if (!request) throw new NotFoundError('No existe la solicitud.');
    if (request.kind === 'VACATION') return toVacationRequestDto(request.data);
    if (request.kind === 'LEAVE') return toLeaveRequestDto(request.data);
    return toAbsenceRequestDto(request.data);
  },
  async approve(id: string, approverId: string): Promise<RequestDto> {
    const wrapper = await requestsRepository.findById(id);
    if (!wrapper) throw new NotFoundError('No existe la solicitud.');
    const { kind, data } = wrapper;
    if (data.status !== 'PENDING') {
      throw new BusinessRuleError('REQUEST_NOT_PENDING', 'La solicitud no está pendiente.');
    }
    await requestsRepository.updateStatus(kind, id, 'APPROVED', approverId, new Date(), null);
    // Actualizar y devolver el nuevo DTO
    const updated = await requestsRepository.findById(id);
    if (!updated) throw new NotFoundError('No existe la solicitud.');
    if (updated.kind === 'VACATION') return toVacationRequestDto(updated.data);
    if (updated.kind === 'LEAVE') return toLeaveRequestDto(updated.data);
    return toAbsenceRequestDto(updated.data);
  },
  async reject(id: string, approverId: string, reason: string): Promise<RequestDto> {
    const wrapper = await requestsRepository.findById(id);
    if (!wrapper) throw new NotFoundError('No existe la solicitud.');
    const { kind, data } = wrapper;
    if (data.status !== 'PENDING') {
      throw new BusinessRuleError('REQUEST_NOT_PENDING', 'La solicitud no está pendiente.');
    }
    await requestsRepository.updateStatus(kind, id, 'REJECTED', approverId, new Date(), reason);
    const updated = await requestsRepository.findById(id);
    if (!updated) throw new NotFoundError('No existe la solicitud.');
    if (updated.kind === 'VACATION') return toVacationRequestDto(updated.data);
    if (updated.kind === 'LEAVE') return toLeaveRequestDto(updated.data);
    return toAbsenceRequestDto(updated.data);
  }
};
