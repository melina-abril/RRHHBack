import type { DocumentData, Timestamp } from 'firebase-admin/firestore';
import { db, createWithNextCode, fromIsoDate } from '../../shared/firestore';
import { EmployeeDoc } from './employees.dto';

/** Única pieza que accede a Firestore: colecciones compartidas (employees). Devuelve { id, ...doc } */
const collection = () => db.collection('employees');

export type EmployeeRecord = EmployeeDoc & { id: string };

function toRecord(id: string, data: DocumentData): EmployeeRecord {
  return { id, ...(data as EmployeeDoc) };
}

export const employeesRepository = {
  /** Devuelve todos los empleados, opcionalmente filtrados */
  async findAll(): Promise<EmployeeRecord[]> {
    // Listado completo (por ahora, ordenado por lastName y firstName); los filtros se aplican en el servicio
    const snapshot = await collection().orderBy('lastName').orderBy('firstName').get();
    return snapshot.docs
      .filter((doc) => !(doc.data().deletedAt))
      .map((doc) => toRecord(doc.id, doc.data()));
  },

  async findById(id: string): Promise<EmployeeRecord | null> {
    const doc = await collection().doc(id).get();
    if (!doc.exists || doc.data()?.deletedAt) return null;
    return toRecord(doc.id, doc.data()!);
  },

  /** Alta nuevo colaborador: id correlativo con createWithNextCode (prefijo 'E-') */
  async create(data: Omit<EmployeeDoc, 'employeeNumber' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<EmployeeRecord> {
    const { id, data: docData } = await createWithNextCode('employees', 'E-', (employeeNumber) => ({
      ...data,
      employeeNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }));
    await collection().doc(id).set(docData);
    return { id, ...docData } as EmployeeRecord;
  },

  /** Edita datos del colaborador existente (NUNCA cambia el employeeNumber, ni lo repite) */
  async update(id: string, updates: Partial<EmployeeDoc> & { updatedAt: Timestamp }): Promise<EmployeeRecord | null> {
    const ref = collection().doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.deletedAt) return null;
    const before = doc.data() as EmployeeDoc;
    const after = { ...before, ...updates };
    await ref.set(after);
    return { id, ...after };
  },

  /** Marca al colaborador como terminado (egreso): actualiza terminationDate y status */
  async terminate(id: string, terminationDate: Timestamp, updatedAt: Timestamp): Promise<EmployeeRecord | null> {
    const ref = collection().doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.deletedAt) return null;
    const before = doc.data() as EmployeeDoc;
    const after: EmployeeDoc = {
      ...before,
      status: 'TERMINATED',
      terminationDate,
      updatedAt,
    };
    await ref.set(after);
    return { id, ...after };
  },

  /** Reingreso de un ex-colaborador: reutiliza el id (employeeNumber), borra terminationDate y pone nueva hireDate */
  async reinstate(id: string, updates: {
    hireDate: Timestamp,
    departmentId: string,
    positionId: string,
    managerId: string | null,
    updatedAt: Timestamp,
  }): Promise<EmployeeRecord | null> {
    const ref = collection().doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.deletedAt) return null;
    const before = doc.data() as EmployeeDoc;
    const after: EmployeeDoc = {
      ...before,
      hireDate: updates.hireDate,
      departmentId: updates.departmentId,
      positionId: updates.positionId,
      managerId: updates.managerId,
      terminationDate: null,
      status: 'ACTIVE',
      updatedAt: updates.updatedAt,
    };
    await ref.set(after);
    return { id, ...after };
  }
};
