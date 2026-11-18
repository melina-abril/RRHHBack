import type { Query, Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { countOf, prefixRange, withId } from '../../shared/db/db-utils.js';
import { offsetOf } from '../../shared/http/page.js';
import type { EmployeeCategory, EmployeeListQuery, EmployeeStatus } from './employees.schemas.js';

/** Campos de employees tal como los carga la base de datos. */
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
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;
const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

const normalized = (value: string): string => value.trim().toLocaleLowerCase('es');

/** Búsqueda por prefijo de nombre o legajo; ambas consultan un único campo ordenado. */
const filtered = (query: EmployeeListQuery): Query => {
  const search = normalized(query.search ?? '');
  if (search) {
    const byNumber = /^e-?\d*$/.test(search);
    const field = byNumber ? 'employeeNumber' : 'normalizedName';
    const { from, to } = prefixRange(byNumber ? search.toUpperCase() : search);
    return collection().where(field, '>=', from).where(field, '<=', to).orderBy(field);
  }
  return collection().orderBy('normalizedName');
};

const matches = (employee: Employee, query: EmployeeListQuery): boolean => {
  const includes = (values: string[], filter: string | undefined): boolean =>
    !filter || values.some((value) => normalized(value) === normalized(filter));

  return (!query.category || employee.category === query.category)
    && (!query.status || employee.status === query.status)
    && (!query.country || normalized(employee.country) === normalized(query.country))
    && includes(employee.clientNames, query.client)
    && includes(employee.projectNames, query.project);
};

const hasAdditionalFilters = (query: EmployeeListQuery): boolean =>
  Boolean(query.category || query.status || query.country || query.client || query.project);

export const employeesRepository = {
  async findPage(query: EmployeeListQuery): Promise<{ items: Employee[]; total: number }> {
    const base = filtered(query);

    if (!hasAdditionalFilters(query)) {
      const [snapshot, total] = await Promise.all([
        base.offset(offsetOf(query)).limit(query.size).get(),
        countOf(base),
      ]);
      return {
        items: snapshot.docs.map((doc) => ({ ...(doc.data() as EmployeeDocument), id: doc.id })),
        total,
      };
    }

    // La base no declara índices compuestos. Aplicar los filtros restantes antes de paginar
    // mantiene el total correcto sin exigir índices para cada combinación de filtros.
    const snapshot = await base.get();
    const matched = snapshot.docs
      .map((doc) => ({ ...(doc.data() as EmployeeDocument), id: doc.id }))
      .filter((employee) => matches(employee, query));
    return { items: matched.slice(offsetOf(query), offsetOf(query) + query.size), total: matched.length };
  },

  async findById(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },
};
