import type { Query, Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, createWithNextCode, nowTimestamp, toTimestamp, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeCategory, EmployeeDedication, EmployeeListQuery, EmployeeStatus, EmployeeWorkMode } from './employees.schemas.js';

/** Campos de la colección compartida employees; el id del documento es el legajo. */
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

const normalizeName = (name: string): string => name.toLocaleLowerCase('es');
const matchesName = (employee: Employee, search: string): boolean => {
  const first = normalizeName(employee.firstName);
  const last = normalizeName(employee.lastName);
  return first.startsWith(search) || last.startsWith(search) || `${first} ${last}`.startsWith(search);
};

export const employeesRepository = {
  async findPage(query: EmployeeListQuery): Promise<{ items: Employee[]; total: number }> {
    let base: Query = collection();
    if (query.status) base = base.where('status', '==', query.status);

    if (query.search) {
      // Los documentos existentes no tienen un campo de búsqueda normalizado. Firestore no permite
      // consultas de prefijo sin distinguir mayúsculas; se filtra el conjunto recuperado sin escribirlo.
      const snapshot = await base.get();
      const search = normalizeName(query.search);
      const matches = snapshot.docs
        .map((doc) => ({ ...(doc.data() as EmployeeDocument), id: doc.id }))
        .filter((employee) => matchesName(employee, search));
      return { items: matches.slice(offsetOf(query), offsetOf(query) + query.size), total: matches.length };
    }

    // El orden implícito por id del documento es el orden estable del legajo y no requiere índice compuesto.
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
    let assignedCode = '';
    await createWithNextCode(EMPLOYEES_COLLECTION.collectionName, 'E-', (code) => {
      assignedCode = code;
      const document: EmployeeDocument = {
        ...employee,
        employeeNumber: code,
        createdAt: nowTimestamp(),
      };
      return document;
    });
    const created = await this.findById(assignedCode);
    if (!created) throw new Error('No se pudo recuperar el colaborador recién creado.');
    return created;
  },
};
