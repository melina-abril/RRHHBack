import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { withId } from '../../shared/db/db-utils.js';
import type { EmploymentCategory, EmploymentStatus, MovementType } from './employment-movements.schemas.js';

/** Colección compartida con el módulo employees; no se crea otra colección para los movimientos. */
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

export interface EmploymentMovementDocument {
  id: string;
  type: MovementType;
  effectiveDate: string;
  previousCategory: EmploymentCategory | null;
  category: EmploymentCategory;
  previousStatus: EmploymentStatus | null;
  status: EmploymentStatus;
  reason: string | null;
  recordedById: string;
  recordedAt: Timestamp;
}

/** Campos laborales de employees. Los documentos cargados inicialmente pueden no tener movements. */
export interface EmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  category: EmploymentCategory;
  status: EmploymentStatus;
  startDate: Timestamp;
  createdById: string;
  createdAt: Timestamp;
  movements?: EmploymentMovementDocument[];
}

export type Employee = EmployeeDocument & { id: string };
export type EmploymentChanges = Pick<EmployeeDocument, 'category' | 'status' | 'startDate'> & {
  movements: EmploymentMovementDocument[];
};

const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

export const employmentMovementsRepository = {
  async findById(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },

  /** La lectura y la escritura comparten transacción para no perder movimientos concurrentes. */
  async update(id: string, calculate: (employee: Employee) => EmploymentChanges): Promise<Employee | undefined> {
    const ref = collection().doc(id);
    return db.runTransaction(async (transaction): Promise<Employee | undefined> => {
      const snapshot = await transaction.get(ref);
      const employee = withId<EmployeeDocument>(snapshot);
      if (!employee) return undefined;
      const changes = calculate(employee);
      transaction.update(ref, changes);
      return { ...employee, ...changes };
    });
  },
};
