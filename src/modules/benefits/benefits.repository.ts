import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { withId } from '../../shared/db/db-utils.js';

/** La base aprobada solo declara employees y users; este módulo no tiene colección propia. */
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

export interface BenefitEmployeeDocument {
  employeeNumber: string;
  category: 'PERMANENT' | 'INTERN';
  status: 'ACTIVE' | 'INACTIVE';
  startDate: Timestamp;
}

export type BenefitEmployee = BenefitEmployeeDocument & { id: string };

export const benefitsRepository = {
  async findEmployee(id: string): Promise<BenefitEmployee | undefined> {
    return withId<BenefitEmployeeDocument>(await db.collection(EMPLOYEES_COLLECTION.collectionName).doc(id).get());
  },
};
