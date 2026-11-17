import { newId, toIsoDateTime, toMoney } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { remunerationRepository, type EmployeeRemuneration, type RemunerationPeriodDocument } from './remuneration.repository.js';
import type { RemunerationHistoryResponse, RemunerationPeriodResponse, RemunerationPeriodStatus, RemunerationRequest } from './remuneration.schemas.js';

const notFound = (id: string): NotFoundError => new NotFoundError(`No se encontró el colaborador ${id}.`);

const toHistory = (employee: EmployeeRemuneration): RemunerationHistoryResponse => {
  const ordered = [...(employee.remunerationPeriods ?? [])].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  const today = new Date().toISOString().slice(0, 10);
  const currentIndex = ordered.findLastIndex((period) => period.effectiveDate <= today);

  const periods: RemunerationPeriodResponse[] = ordered.map((period: RemunerationPeriodDocument, index: number) => {
    let status: RemunerationPeriodStatus = 'HISTORICAL';
    if (period.effectiveDate > today) status = 'SCHEDULED';
    else if (index === currentIndex) status = 'CURRENT';

    return {
      id: period.id,
      amount: toMoney(period.amount),
      currency: period.currency,
      effectiveDate: period.effectiveDate,
      reason: period.reason,
      registeredById: period.registeredById,
      registeredAt: toIsoDateTime(period.registeredAt),
      status,
      internSupplement: status === 'CURRENT' && employee.category === 'INTERN' ? toMoney(period.amount * 0.01) : 0,
    };
  });

  return { employeeId: employee.id, periods };
};

export const remunerationService = {
  async listPeriods(id: string): Promise<RemunerationHistoryResponse> {
    const employee = await remunerationRepository.findEmployee(id);
    if (!employee) throw notFound(id);
    return toHistory(employee);
  },

  async createPeriod(id: string, request: RemunerationRequest, userId: string): Promise<RemunerationPeriodResponse> {
    const periodId = newId();
    const employee = await remunerationRepository.insertPeriod(id, {
      id: periodId,
      amount: request.amount,
      currency: request.currency,
      effectiveDate: request.effectiveDate,
      reason: request.reason,
      registeredById: userId,
    });
    if (!employee) throw notFound(id);
    const created = toHistory(employee).periods.find((period) => period.id === periodId);
    if (!created) throw new Error('No se pudo recuperar la vigencia salarial registrada.');
    return created;
  },
};
