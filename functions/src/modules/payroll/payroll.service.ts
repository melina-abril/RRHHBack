import { Timestamp } from 'firebase-admin/firestore';
import { createWithNextCode, toIsoDate, fromIsoDate } from '../../shared/firestore';
import { PayrollPeriodDto, PayslipDto, PayslipRequest, BonusDto, BonusRequest } from './payroll.dto';
import { BonusRecord, PayrollPeriodRecord, PayslipRecord, payrollRepository } from './payroll.repository';

const toPayrollPeriodDto = (record: PayrollPeriodRecord): PayrollPeriodDto => ({
  id: record.id,
  name: record.name,
  startDate: toIsoDate(record.startDate) ?? '',
  endDate: toIsoDate(record.endDate) ?? '',
  status: record.status,
});

const toPayslipDto = (record: PayslipRecord): PayslipDto => ({
  id: record.id,
  employeeId: record.employeeId,
  periodId: record.periodId,
  baseAmount: record.baseAmount,
  currency: record.currency,
  additional: record.additional,
  total: record.total,
  issueDate: toIsoDate(record.issueDate) ?? '',
  status: record.status,
});

const toBonusDto = (record: BonusRecord): BonusDto => ({
  id: record.id,
  employeeId: record.employeeId,
  periodId: record.periodId,
  concept: record.concept,
  amount: record.amount,
  currency: record.currency,
  approvedBy: record.approvedBy,
  status: record.status,
  grantDate: record.grantDate ? toIsoDate(record.grantDate) : null,
});

export const payrollService = {
  async listPayrollPeriods(): Promise<PayrollPeriodDto[]> {
    const periods = await payrollRepository.findAllPeriods();
    return periods.map(toPayrollPeriodDto);
  },

  async getPayslipsByEmployee(employeeId: string): Promise<PayslipDto[]> {
    const payslips = await payrollRepository.findPayslipsByEmployee(employeeId);
    return payslips.map(toPayslipDto);
  },

  async createPayslip(request: PayslipRequest): Promise<PayslipDto> {
    // El id se genera correlativo: PSL-XXXX
    const codePrefix = 'PSL-';
    const { id, data } = await createWithNextCode('payslips', codePrefix, (newId) => ({
      employeeId: request.employeeId,
      periodId: request.periodId,
      baseAmount: request.baseAmount,
      currency: request.currency,
      additional: request.additional,
      total: request.total,
      issueDate: fromIsoDate(request.issueDate),
      status: request.status,
      createdAt: Timestamp.now(),
    }));
    return toPayslipDto({ id, ...data });
  },

  async getBonusesByEmployee(employeeId: string): Promise<BonusDto[]> {
    const bonuses = await payrollRepository.findBonusesByEmployee(employeeId);
    return bonuses.map(toBonusDto);
  },

  async assignBonus(request: BonusRequest): Promise<BonusDto> {
    // El id se genera correlativo: BON-yyyy-nn (simplificado: BON-XXXX)
    const codePrefix = 'BON-';
    const { id, data } = await createWithNextCode('bonuses', codePrefix, (newId) => ({
      employeeId: request.employeeId,
      periodId: request.periodId,
      concept: request.concept,
      amount: request.amount,
      currency: request.currency,
      approvedBy: request.approvedBy,
      status: request.status,
      grantDate: request.grantDate ? fromIsoDate(request.grantDate) : null,
      createdAt: Timestamp.now(),
    }));
    return toBonusDto({ id, ...data });
  }
};
