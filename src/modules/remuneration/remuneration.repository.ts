import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { nowTimestamp } from '../../shared/db/db-utils.js';
import { ConflictError } from '../../shared/errors/http-errors.js';
import type { RemunerationCurrency } from './remuneration.schemas.js';

/** Las vigencias se guardan dentro del documento compartido employees/{id}. */
export interface RemunerationPeriodDocument {
  id: string;
  amount: number;
  currency: RemunerationCurrency;
  effectiveDate: string;
  reason: string;
  registeredById: string;
  registeredAt: Timestamp;
  categoryAtRegistration: 'INTERN' | 'PERMANENT';
}

export interface EmployeeRemunerationDocument {
  employeeNumber: string;
  category: 'INTERN' | 'PERMANENT';
  remunerationPeriods?: RemunerationPeriodDocument[];
}

export type EmployeeRemuneration = EmployeeRemunerationDocument & { id: string };

const employees = () => db.collection('employees');

export const remunerationRepository = {
  async findEmployee(id: string): Promise<EmployeeRemuneration | undefined> {
    const snapshot = await employees().doc(id).get();
    if (!snapshot.exists) return undefined;
    const data = snapshot.data() as EmployeeRemunerationDocument | undefined;
    return data ? { ...data, id: snapshot.id } : undefined;
  },

  /** La transacción impide registrar dos vigencias con la misma fecha, incluso ante solicitudes simultáneas. */
  async insertPeriod(employeeId: string, period: Omit<RemunerationPeriodDocument, 'registeredAt' | 'categoryAtRegistration'>): Promise<EmployeeRemuneration | undefined> {
    const ref = employees().doc(employeeId);
    return db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) return undefined;
      const employee = snapshot.data() as EmployeeRemunerationDocument | undefined;
      if (!employee) return undefined;
      const periods = employee.remunerationPeriods ?? [];
      if (periods.some((existing) => existing.effectiveDate === period.effectiveDate)) {
        throw new ConflictError('Ya existe una vigencia salarial con esa fecha.', 'effectiveDate');
      }
      const added: RemunerationPeriodDocument = {
        ...period,
        registeredAt: nowTimestamp(),
        categoryAtRegistration: employee.category,
      };
      const updated: EmployeeRemunerationDocument = {
        ...employee,
        remunerationPeriods: [...periods, added],
      };
      transaction.update(ref, { remunerationPeriods: updated.remunerationPeriods });
      return { ...updated, id: snapshot.id };
    });
  },
};
