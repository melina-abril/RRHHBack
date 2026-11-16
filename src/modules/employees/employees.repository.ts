import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { createWithNextCode, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeCategory, EmployeeDedication, EmployeeListQuery, EmployeeStatus, EmployeeWorkMode } from './employees.schemas.js';

/** Campos de employees definidos por el seed compartido de Firestore. */
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
export type EmployeeChanges = Pick<EmployeeDocument, 'firstName' | 'lastName' | 'birthDate' | 'residenceCountry' | 'personalEmail' | 'dedication' | 'workMode' | 'jobRole'>;

export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;
const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);
const matches = (value: string | null, filter: string | undefined): boolean =>
  !filter || (value ?? '').toLocaleLowerCase().includes(filter.toLocaleLowerCase());

export const employeesRepository = {
  async findPage(query: EmployeeListQuery): Promise<{ items: Employee[]; total: number }> {
    // La búsqueda combina nombre y legajo y los filtros son opcionales. Firestore no permite
    // esa disyunción y sus combinaciones sin índices compuestos; el contrato actual no declara
    // ninguno. Se filtra antes de paginar para que el total y las páginas sean coherentes.
    const snapshot = await collection().orderBy('employeeNumber').get();
    const filtered = snapshot.docs
      .map((doc) => ({ ...(doc.data() as EmployeeDocument), id: doc.id }))
      .filter((employee) => {
        const search = query.search?.toLocaleLowerCase();
        const name = `${employee.firstName} ${employee.lastName}`.toLocaleLowerCase();
        return (!search || name.includes(search) || employee.employeeNumber.toLocaleLowerCase().includes(search))
          && (!query.category || employee.category === query.category)
          && (!query.status || employee.status === query.status)
          && matches(employee.initialClient, query.client)
          && matches(employee.initialProject, query.project);
      });
    return { items: filtered.slice(offsetOf(query), offsetOf(query) + query.size), total: filtered.length };
  },

  async findById(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },

  async insert(document: NewEmployee): Promise<Employee> {
    const created = await createWithNextCode(EMPLOYEES_COLLECTION.collectionName, 'E-', (code) => ({
      ...document,
      employeeNumber: code,
      createdAt: Timestamp.now(),
    }));
    return created as Employee;
  },

  async update(id: string, changes: EmployeeChanges): Promise<Employee | undefined> {
    const ref = collection().doc(id);
    const exists = await db.runTransaction(async (transaction) => {
      const current = await transaction.get(ref);
      if (!current.exists) return false;
      transaction.update(ref, changes);
      return true;
    });
    return exists ? this.findById(id) : undefined;
  },
};
