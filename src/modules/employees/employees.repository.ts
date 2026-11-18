import type { Query, Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, createWithNextCode, nowTimestamp, prefixRange, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeCategory, EmployeeListQuery, EmployeeStatus } from './employees.schemas.js';

/** Campos de la colección employees, incluidos los de los legajos cargados por la base. */
export interface EmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  normalizedName: string;
  email: string;
  category: EmployeeCategory;
  country: string;
  position: string;
  clientNames: string[];
  projectNames: string[];
  status: EmployeeStatus;
  hireDate: Timestamp;
  terminationDate: Timestamp | null;
  createdById: string;
  createdAt: Timestamp;
  deletedAt: Timestamp | null;
}

export type Employee = EmployeeDocument & { id: string };
export type NewEmployee = Omit<EmployeeDocument, 'employeeNumber' | 'createdAt'>;

export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;
const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

/**
 * Los filtros combinados con la ordenación por normalizedName necesitan índices compuestos
 * en Firestore. Sus definiciones pertenecen a la capa database.
 */
const filtered = (query: EmployeeListQuery): Query => {
  let result: Query = collection();
  if (query.category) result = result.where('category', '==', query.category);
  if (query.status) result = result.where('status', '==', query.status);
  if (query.country) result = result.where('country', '==', query.country);
  if (query.client) result = result.where('clientNames', 'array-contains', query.client);
  if (query.project) result = result.where('projectNames', 'array-contains', query.project);
  if (query.search) {
    const { from, to } = prefixRange(query.search.toLocaleLowerCase('es'));
    result = result.where('normalizedName', '>=', from).where('normalizedName', '<=', to);
  }
  return result.orderBy('normalizedName');
};

export const employeesRepository = {
  async findPage(query: EmployeeListQuery): Promise<{ items: Employee[]; total: number }> {
    const base = filtered(query);
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

  async existsByEmail(email: string): Promise<boolean> {
    const snapshot = await collection().where('email', '==', email).limit(1).get();
    return !snapshot.empty;
  },

  async insert(employee: NewEmployee): Promise<Employee> {
    const created = await createWithNextCode(EMPLOYEES_COLLECTION.collectionName, 'E-', (code) => ({
      ...employee,
      employeeNumber: code,
      createdAt: nowTimestamp(),
    }));
    return created;
  },
};
