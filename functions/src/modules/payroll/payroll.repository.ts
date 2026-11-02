import type { DocumentData } from 'firebase-admin/firestore';
import { db } from '../../shared/firestore';
import { PayrollPeriodDoc, PayslipDoc, BonusDoc } from './payroll.dto';

const payrollPeriodsCollection = () => db.collection('payrollPeriods');
const payslipsCollection = () => db.collection('payslips');
const bonusesCollection = () => db.collection('bonuses');

export type PayrollPeriodRecord = PayrollPeriodDoc & { id: string };
export type PayslipRecord = PayslipDoc & { id: string };
export type BonusRecord = BonusDoc & { id: string };

const toPayrollPeriodRecord = (id: string, data: DocumentData): PayrollPeriodRecord => ({ id, ...(data as PayrollPeriodDoc) });
const toPayslipRecord = (id: string, data: DocumentData): PayslipRecord => ({ id, ...(data as PayslipDoc) });
const toBonusRecord = (id: string, data: DocumentData): BonusRecord => ({ id, ...(data as BonusDoc) });

export const payrollRepository = {
  async findAllPeriods(): Promise<PayrollPeriodRecord[]> {
    const snapshot = await payrollPeriodsCollection().orderBy('startDate', 'desc').get();
    return snapshot.docs.map((doc) => toPayrollPeriodRecord(doc.id, doc.data()));
  },

  async findPayslipsByEmployee(employeeId: string): Promise<PayslipRecord[]> {
    const snapshot = await payslipsCollection().where('employeeId', '==', employeeId).orderBy('issueDate', 'desc').get();
    return snapshot.docs.map((doc) => toPayslipRecord(doc.id, doc.data()));
  },

  async createPayslip(data: PayslipDoc, id: string): Promise<PayslipRecord> {
    await payslipsCollection().doc(id).set(data);
    return { id, ...data };
  },

  async findBonusesByEmployee(employeeId: string): Promise<BonusRecord[]> {
    const snapshot = await bonusesCollection().where('employeeId', '==', employeeId).orderBy('grantDate', 'desc').get();
    return snapshot.docs.map((doc) => toBonusRecord(doc.id, doc.data()));
  },

  async createBonus(data: BonusDoc, id: string): Promise<BonusRecord> {
    await bonusesCollection().doc(id).set(data);
    return { id, ...data };
  },
};
