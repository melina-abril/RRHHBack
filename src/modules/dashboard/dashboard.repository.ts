import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';

/** Campos de employees que necesita el resumen; la colección pertenece al core compartido. */
export interface DashboardEmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  status: 'ACTIVE' | 'INACTIVE';
}

export type DashboardEmployee = DashboardEmployeeDocument & { id: string };

export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

export const dashboardRepository = {
  async findActiveEmployees(): Promise<DashboardEmployee[]> {
    const snapshot = await db.collection(EMPLOYEES_COLLECTION.collectionName)
      .where('status', '==', 'ACTIVE')
      .get();
    return snapshot.docs.map((doc) => ({ ...(doc.data() as DashboardEmployeeDocument), id: doc.id }));
  },
};
