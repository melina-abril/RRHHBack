import type { DocumentData, Query } from 'firebase-admin/firestore';
import { db } from '../../shared/firestore';
import {
  EmployeeDoc,
  MovementDoc,
  EmployeeStatus,
  MovementType
} from './employees.dto';

/**
 * Repositorio de empleados: CRUD y consulta en la colección 'employees'.
 */
const employeesCol = () => db.collection('employees');

type EmployeeRecord = EmployeeDoc & { id: string };

type MovementRecord = MovementDoc & { id: string };

function toEmployeeRecord(id: string, data: DocumentData): EmployeeRecord {
  return { id, ...(data as EmployeeDoc) };
}

function toMovementRecord(id: string, data: DocumentData): MovementRecord {
  return { id, ...(data as MovementDoc) };
}

export const employeesRepository = {
  async findAll(): Promise<EmployeeRecord[]> {
    // Listado completo, sin los eliminados
    const snapshot = await employeesCol().where('deletedAt', '==', null).orderBy('lastName').get();
    return snapshot.docs.map(doc => toEmployeeRecord(doc.id, doc.data()));
  },
  async findById(id: string): Promise<EmployeeRecord | null> {
    const doc = await employeesCol().doc(id).get();
    const data = doc.data();
    return data && (!data.deletedAt) ? toEmployeeRecord(doc.id, data) : null;
  },
  async findByDocument(documentType: string, documentNumber: string): Promise<EmployeeRecord | null> {
    const snapshot = await employeesCol()
      .where('documentType', '==', documentType)
      .where('documentNumber', '==', documentNumber)
      .where('deletedAt', '==', null)
      .limit(1)
      .get();
    const doc = snapshot.docs[0];
    return doc ? toEmployeeRecord(doc.id, doc.data()) : null;
  },
  async create(employeeData: Omit<EmployeeDoc, 'employeeNumber' | 'createdAt' | 'updatedAt' | 'status' | 'deletedAt'>): Promise<EmployeeRecord> {
    // Usa createWithNextCode para id/employeeNumber correlativo
    const now = new Date();
    const { createWithNextCode, fromIsoDate } = await import('../../shared/firestore');
    const { id, data } = await createWithNextCode('employees', 'E-', eid => ({
      ...employeeData,
      employeeNumber: eid,
      status: 'ACTIVE',
      terminationDate: null,
      deletedAt: null,
      createdAt: fromIsoDate(employeeData.hireDate),
      updatedAt: fromIsoDate(employeeData.hireDate),
    }));
    return { id, ...data };
  },
  async update(id: string, updates: Partial<EmployeeDoc>): Promise<EmployeeRecord | null> {
    const ref = employeesCol().doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.deletedAt) return null;
    const updateData = { ...updates, updatedAt: new Date() };
    await ref.update(updateData);
    const updated = await ref.get();
    return toEmployeeRecord(id, updated.data()!);
  },
  async setStatus(id: string, status: EmployeeStatus, terminationDate?: string | null): Promise<EmployeeRecord | null> {
    const ref = employeesCol().doc(id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.deletedAt) return null;
    const { fromIsoDate } = await import('../../shared/firestore');
    const updatePayload: Partial<EmployeeDoc> = { status, updatedAt: new Date() };
    if (status === 'TERMINATED') {
      updatePayload.terminationDate = terminationDate ? fromIsoDate(terminationDate) : null;
    } else if (status === 'ACTIVE') {
      updatePayload.terminationDate = null;
    }
    await ref.update(updatePayload);
    const updated = await ref.get();
    return toEmployeeRecord(id, updated.data()!);
  },
  async getMovements(employeeId: string): Promise<MovementRecord[]> {
    const movementsCol = employeesCol().doc(employeeId).collection('movements');
    const snapshot = await movementsCol.orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => toMovementRecord(doc.id, doc.data()));
  },
  async addMovement(employeeId: string, movement: Omit<MovementDoc, 'createdAt'>): Promise<MovementRecord> {
    const movementsCol = employeesCol().doc(employeeId).collection('movements');
    const { FieldValue } = await import('firebase-admin/firestore');
    const ref = await movementsCol.add({ ...movement, createdAt: FieldValue.serverTimestamp() });
    const doc = await ref.get();
    return toMovementRecord(doc.id, doc.data()!);
  }
};
