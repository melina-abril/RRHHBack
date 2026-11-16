import { Timestamp, type Query } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, createWithNextCode, prefixRange, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeListQuery, EmployeeCategory, EmployeeDedication, EmployeeStatus, EmployeeWorkMode } from './employees.schemas.js';

/** Campos de la colección compartida employees, incluidos los usados por el seed inicial. */
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
  createdAt: Timestamp;
  deletedAt: Timestamp | null;
}

export type Employee = EmployeeDocument & { id: string };
export type NewEmployee = Omit<EmployeeDocument, 'employeeNumber' | 'createdAt'>;
export type EmployeeChanges = Pick<EmployeeDocument,
  'firstName' | 'lastName' | 'birthDate' | 'residenceCountry' | 'personalEmail' |
  'startDate' | 'category' | 'dedication' | 'workMode' | 'jobRole' |
  'initialClient' | 'initialProject' | 'initialManager'>;

export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;
const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

/** La búsqueda es por prefijo del nombre. Los filtros combinados con la ordenación requieren índices compuestos en Firestore. */
const filtered = (query: EmployeeListQuery): Query => {
  let result: Query = collection();
  if (query.status) result = result.where('status', '==', query.status);
  if (query.category) result = result.where('category', '==', query.category);
  if (query.search) {
    const { from, to } = prefixRange(query.search);
    return result.where('firstName', '>=', from).where('firstName', '<=', to).orderBy('firstName');
  }
  return result.orderBy('firstName');
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

  async existsByPersonalEmail(email: string, exceptId?: string): Promise<boolean> {
    const snapshot = await collection().where('personalEmail', '==', email).limit(2).get();
    return snapshot.docs.some((doc) => doc.id !== exceptId);
  },

  /** El helper asigna el siguiente legajo E-0001… y usa ese mismo código como id del documento. */
  async insert(employee: NewEmployee): Promise<Employee> {
    const result: unknown = await createWithNextCode(EMPLOYEES_COLLECTION.collectionName, 'E-', (code) => ({
      ...employee,
      employeeNumber: code,
      createdAt: Timestamp.now(),
    }));
    const id = typeof result === 'string'
      ? result
      : typeof result === 'object' && result !== null && 'id' in result && typeof result.id === 'string'
        ? result.id
        : null;
    if (id === null) throw new Error('No se recibió el legajo del colaborador creado.');
    const created = await this.findById(id);
    if (!created) throw new Error('No se pudo recuperar el colaborador creado.');
    return created;
  },

  async update(id: string, changes: EmployeeChanges): Promise<Employee | undefined> {
    const ref = collection().doc(id);
    const updated = await db.runTransaction(async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists) return false;
      transaction.update(ref, changes);
      return true;
    });
    return updated ? this.findById(id) : undefined;
  },
};
