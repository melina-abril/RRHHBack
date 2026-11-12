import { Timestamp, type Query } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, nowTimestamp, prefixRange, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeCategory, EmployeeCommitment, EmployeeListQuery, EmployeeStatus, EmployeeWorkMode } from './employee-management.schemas.js';

/** Campos de la colección employees cargados por V3__employee_management.js. */
export interface EmployeeDocument {
  employeeNumber: string;
  normalizedName: string;
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  residenceCountry: string;
  personalEmail: string;
  hireDate: Timestamp;
  category: EmployeeCategory;
  commitment: EmployeeCommitment;
  workMode: EmployeeWorkMode;
  jobRole: string;
  clientName: string | null;
  projectName: string | null;
  contactName: string | null;
  status: EmployeeStatus;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
}

export type Employee = EmployeeDocument & { id: string };
export type NewEmployee = Omit<EmployeeDocument, 'createdAt'>;
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;
const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

const filtered = (query: EmployeeListQuery): Query => {
  let result: Query = collection();
  if (query.search) {
    const { from, to } = prefixRange(query.search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    result = result.where('normalizedName', '>=', from).where('normalizedName', '<=', to);
    return result.orderBy('normalizedName');
  }
  return result.orderBy('createdAt', 'desc');
};

export const employeeManagementRepository = {
  async findPage(query: EmployeeListQuery): Promise<{ items: Employee[]; total: number }> {
    const base = filtered(query);
    const [snapshot, total] = await Promise.all([base.offset(offsetOf(query)).limit(query.size).get(), countOf(base)]);
    return {
      items: snapshot.docs.map((doc) => ({ ...(doc.data() as EmployeeDocument), id: doc.id })),
      total,
    };
  },

  async findById(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },

  async existsByEmail(email: string): Promise<boolean> {
    const snapshot = await collection().where('personalEmail', '==', email).limit(1).get();
    return !snapshot.empty;
  },

  async insert(id: string, employee: NewEmployee): Promise<Employee> {
    const document: EmployeeDocument = { ...employee, createdAt: nowTimestamp() };
    await collection().doc(id).create(document);
    return { ...document, id };
  },
};
