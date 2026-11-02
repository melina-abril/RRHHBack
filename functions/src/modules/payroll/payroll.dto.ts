/**
 * DTOs, Documentos y enums del módulo Sueldos y Bonos.
 * Periodos: payrollPeriods/{id}
 * Recibos: payslips/{id}
 * Bonos: bonuses/{id}
 */
import type { Timestamp } from 'firebase-admin/firestore';

export const PAYROLL_PERIOD_STATUSES = ['OPEN', 'CLOSED'] as const;
export type PayrollPeriodStatus = (typeof PAYROLL_PERIOD_STATUSES)[number];

export const PAYSLIP_STATUSES = ['ISSUED', 'PAID'] as const;
export type PayslipStatus = (typeof PAYSLIP_STATUSES)[number];

export const BONUS_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type BonusStatus = (typeof BONUS_STATUSES)[number];

export const BONUS_CONCEPTS = [
  'PERFORMANCE_SEMESTER',
  'BIRTHDAY_BENEFIT',
  'TRAINING_BENEFIT',
  'EQUIPMENT_BENEFIT'
] as const;
export type BonusConcept = (typeof BONUS_CONCEPTS)[number];

export const CURRENCIES = ['ARS', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Documento payrollPeriods/{id} */
export interface PayrollPeriodDoc {
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: PayrollPeriodStatus;
  createdAt: Timestamp;
}

/** Lo que devuelve la API */
export interface PayrollPeriodDto {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: PayrollPeriodStatus;
}

/** Documento payslips/{id} */
export interface PayslipDoc {
  employeeId: string;
  periodId: string;
  baseAmount: number;
  currency: Currency;
  additional: number;
  total: number;
  issueDate: Timestamp;
  status: PayslipStatus;
  createdAt: Timestamp;
}

/** Lo que devuelve la API para un pago */
export interface PayslipDto {
  id: string;
  employeeId: string;
  periodId: string;
  baseAmount: number;
  currency: Currency;
  additional: number;
  total: number;
  issueDate: string;
  status: PayslipStatus;
}

/** Alta de recibo de sueldo (body) */
export interface PayslipRequest {
  employeeId: string;
  periodId: string;
  baseAmount: number;
  currency: Currency;
  additional: number;
  total: number;
  issueDate: string;
  status: PayslipStatus;
}

/** Documento bonuses/{id} */
export interface BonusDoc {
  employeeId: string;
  periodId: string;
  concept: BonusConcept;
  amount: number;
  currency: Currency;
  approvedBy: string;
  status: BonusStatus;
  grantDate: Timestamp | null;
  createdAt: Timestamp;
}

/** Lo que devuelve la API para un bono */
export interface BonusDto {
  id: string;
  employeeId: string;
  periodId: string;
  concept: BonusConcept;
  amount: number;
  currency: Currency;
  approvedBy: string;
  status: BonusStatus;
  grantDate: string | null;
}

/** Alta de bono (body) */
export interface BonusRequest {
  employeeId: string;
  periodId: string;
  concept: BonusConcept;
  amount: number;
  currency: Currency;
  approvedBy: string;
  status: BonusStatus;
  grantDate: string | null;
}
