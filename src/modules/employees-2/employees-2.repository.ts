import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { toTimestamp, withId } from '../../shared/db/db-utils.js';
import type { UpdateEmployeeRequest } from './employees-2.schemas.js';
import type { EmployeeResponse } from './employees-2.schemas.js';

/** Campos de la colección compartida employees, conforme al script de carga de la base. */
export interface EmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  residenceCountry: string;
  personalEmail: string;
  startDate: Timestamp;
  category: EmployeeResponse['category'];
  dedication: EmployeeResponse['dedication'];
  workMode: EmployeeResponse['workMode'];
  jobRole: string;
  status: EmployeeResponse['status'];
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  createdAt: Timestamp;
  deletedAt: Timestamp | null;
}

export type Employee = EmployeeDocument & { id: string };
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;
const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

export const employees2Repository = {
  async findById(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },

  /** Edita únicamente los campos permitidos, sin reemplazar el documento ni cambiar el legajo. */
  async update(id: string, changes: UpdateEmployeeRequest): Promise<Employee | undefined> {
    const ref = collection().doc(id);
    return db.runTransaction(async (trx): Promise<Employee | undefined> => {
      const snapshot = await trx.get(ref);
      if (!snapshot.exists) return undefined;
      const current = snapshot.data() as EmployeeDocument;
      const updated: EmployeeDocument = {
        ...current,
        firstName: changes.firstName,
        lastName: changes.lastName,
        birthDate: toTimestamp(changes.birthDate),
        residenceCountry: changes.residenceCountry,
        personalEmail: changes.personalEmail,
        dedication: changes.dedication,
        workMode: changes.workMode,
        jobRole: changes.jobRole,
      };
      trx.update(ref, {
        firstName: updated.firstName,
        lastName: updated.lastName,
        birthDate: updated.birthDate,
        residenceCountry: updated.residenceCountry,
        personalEmail: updated.personalEmail,
        dedication: updated.dedication,
        workMode: updated.workMode,
        jobRole: updated.jobRole,
      });
      return { ...updated, id: snapshot.id };
    });
  },
};
