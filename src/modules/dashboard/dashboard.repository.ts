import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { withId } from '../../shared/db/db-utils.js';

/** Campos de los documentos existentes en la colección compartida employees. */
export interface EmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  residenceCountry: string;
  personalEmail: string;
  startDate: Timestamp;
  category: 'PERMANENT' | 'INTERN';
  dedication: 'FULL_TIME' | 'PART_TIME';
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  jobRole: string;
  status: 'ACTIVE' | 'INACTIVE';
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
}

export type Employee = EmployeeDocument & { id: string };

export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

export const dashboardRepository = {
  async findActiveEmployees(): Promise<Employee[]> {
    const snapshot = await db.collection(EMPLOYEES_COLLECTION.collectionName)
      .where('status', '==', 'ACTIVE')
      .get();
    return snapshot.docs.flatMap((doc) => {
      const employee = withId<EmployeeDocument>(doc);
      return employee ? [employee] : [];
    });
  },
};
