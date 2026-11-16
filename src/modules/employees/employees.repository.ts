import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, createWithNextCode, nowTimestamp, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeCategory, EmployeeDedication, EmployeeListQuery, EmployeeStatus, EmployeeWorkMode } from './employees.schemas.js';

/** Campos de la colección compartida employees, incluidos los de la carga inicial. */
export interface EmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  residenceCountry: string;
  personalEmail: string;
  startDate: Timestamp;
  category: EmployeeCategory;
  dedication: EmployeeDedication;
  workMode: EmployeeWorkMode;
  jobRole: string;
  status: EmployeeStatus;
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
}

export type Employee = EmployeeDocument & { id: string };
export type NewEmployee = Omit<EmployeeDocument, 'employeeNumber' | 'createdAt'>;
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

export const employeesRepository = {
  async findPage(query: EmployeeListQuery): Promise<{ items: Employee[]; total: number }> {
    const base = collection().orderBy('createdAt', 'desc');
    const [snapshot, total] = await Promise.all([
      base.offset(offsetOf(query)).limit(query.size).get(),
      countOf(base),
    ]);
    return {
      items: snapshot.docs.map((doc) => ({ ...(doc.data() as EmployeeDocument), id: doc.id })),
      total,
    };
  },

  async findById(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },

  async existsByPersonalEmail(email: string): Promise<boolean> {
    const snapshot = await collection().where('personalEmail', '==', email).limit(1).get();
    return !snapshot.empty;
  },

  async insert(employee: NewEmployee): Promise<Employee> {
    const created = await createWithNextCode(EMPLOYEES_COLLECTION.collectionName, 'E-', (code) => ({
      ...employee,
      employeeNumber: code,
      createdAt: nowTimestamp(),
    }));
    return { ...created, id: created.id };
  },
};
