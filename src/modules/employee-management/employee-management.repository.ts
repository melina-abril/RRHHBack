import { Timestamp, type Query } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, createWithNextCode, nowTimestamp, prefixRange, withId } from '../../shared/db/db-utils.js';
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
/** Prefijo de los legajos, el mismo que usan los datos de V3__employee_management.js (E-0001…). */
const EMPLOYEE_NUMBER_PREFIX = 'E-';

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

  /** Alta con el próximo legajo correlativo (E-0001, E-0002…): id del documento = employeeNumber. */
  async insertWithNextNumber(employee: Omit<NewEmployee, 'employeeNumber'>): Promise<Employee> {
    return createWithNextCode<EmployeeDocument>(EMPLOYEES_COLLECTION.collectionName, EMPLOYEE_NUMBER_PREFIX, (code) => ({
      ...employee,
      employeeNumber: code,
      createdAt: nowTimestamp(),
    }));
  },
};
