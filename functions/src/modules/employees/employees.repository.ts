import type { DocumentData } from 'firebase-admin/firestore';
import { db } from '../../shared/firestore';
import { EmployeeDoc, EmployeeStatus } from './employees.models';

/** Acceso a Firestore para la colección employees. Devuelve { id, ...doc } */
const collection = () => db.collection('employees');

export type EmployeeRecord = EmployeeDoc & { id: string };

const toRecord = (id: string, data: DocumentData): EmployeeRecord => ({ id, ...(data as EmployeeDoc) });

export const employeesRepository = {
  async findAll(): Promise<EmployeeRecord[]> {
    const snapshot = await collection().where('deletedAt', '==', null).orderBy('lastName').orderBy('firstName').get();
    return snapshot.docs.map((doc) => toRecord(doc.id, doc.data()));
  },

  async findById(id: string): Promise<EmployeeRecord | null> {
    const snapshot = await collection().doc(id).get();
    const data = snapshot.data();
    if (!data || data['deletedAt']) return null;
    return toRecord(snapshot.id, data);
  },

  async findByDocument(documentType: string, documentNumber: string): Promise<EmployeeRecord | null> {
    const snapshot = await collection()
      .where('documentType', '==', documentType)
      .where('documentNumber', '==', documentNumber)
      .where('deletedAt', '==', null)
      .limit(1).get();
    const doc = snapshot.docs[0];
    return doc ? toRecord(doc.id, doc.data()) : null;
  },

  /** Alta del empleado, id es el legajo (employeeNumber). */
  async create(id: string, data: Omit<EmployeeDoc, 'employeeNumber'>): Promise<EmployeeRecord> {
    await collection().doc(id).create({ ...data, employeeNumber: id });
    return { id, employeeNumber: id, ...data };
  },

  async update(id: string, data: Partial<EmployeeDoc>): Promise<EmployeeRecord | null> {
    const ref = collection().doc(id);
    await ref.update(data);
    const updated = await ref.get();
    const doc = updated.data();
    if (!doc || doc['deletedAt']) return null;
    return toRecord(updated.id, doc);
  },

  /** Lógica: "borrado lógico" usando el campo deletedAt. */
  async softDelete(id: string, deletedAt: FirebaseFirestore.Timestamp): Promise<void> {
    await collection().doc(id).update({ deletedAt });
  },

  /** Filtro por criterios. Busca por status, department, position y texto. */
  async findFiltered(filters: {
    search: string | null;
    status: EmployeeStatus | null;
    departmentId: string | null;
    positionId: string | null;
  }): Promise<EmployeeRecord[]> {
    let query: FirebaseFirestore.Query = collection().where('deletedAt', '==', null);
    if (filters.status) query = query.where('status', '==', filters.status);
    if (filters.departmentId) query = query.where('departmentId', '==', filters.departmentId);
    if (filters.positionId) query = query.where('positionId', '==', filters.positionId);
    const snapshot = await query.get();
    let docs = snapshot.docs.map((doc) => toRecord(doc.id, doc.data()));
    if (filters.search) {
      const term = filters.search.trim().toLowerCase();
      docs = docs.filter((emp) =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.employeeNumber.toLowerCase().includes(term)
      );
    }
    return docs;
  }
};
