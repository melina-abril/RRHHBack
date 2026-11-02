import type { DocumentData } from 'firebase-admin/firestore';
import { db, createWithNextCode } from '../../shared/firestore';
import { EmployeeDoc } from './employees.dto';

const collectionName = 'employees';
const prefix = 'E-';

const collection = () => db.collection(collectionName);

export type EmployeeRecord = EmployeeDoc & { id: string };

const toRecord = (id: string, data: DocumentData): EmployeeRecord => ({ id, ...(data as EmployeeDoc) });

export const employeesRepository = {
  async findAll(): Promise<EmployeeRecord[]> {
    const snapshot = await collection()
      .where('deletedAt', '==', null)
      .orderBy('lastName')
      .orderBy('firstName')
      .get();
    return snapshot.docs.map((doc) => toRecord(doc.id, doc.data()));
  },

  async findById(id: string): Promise<EmployeeRecord | null> {
    const snapshot = await collection().doc(id).get();
    const data = snapshot.data();
    if (!data || data['deletedAt']) return null;
    return toRecord(snapshot.id, data);
  },

  async findByEmployeeNumber(employeeNumber: string): Promise<EmployeeRecord | null> {
    const snapshot = await collection().where('employeeNumber', '==', employeeNumber).limit(1).get();
    const doc = snapshot.docs[0];
    return doc ? toRecord(doc.id, doc.data()) : null;
  },

  /** Alta: usa createWithNextCode para generar legajo único correlativo (E-0004...) */
  async create(data: Omit<EmployeeDoc, 'employeeNumber' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<EmployeeRecord> {
    const now = new Date();
    const { id, data: doc } = await createWithNextCode(collectionName, prefix, (employeeNumber) => ({
      ...data,
      employeeNumber,
      createdAt: null, // lo pone el trigger/script
      updatedAt: null,
      deletedAt: null
    }));
    return { id, ...doc };
  },

  async update(id: string, data: Partial<EmployeeDoc>): Promise<EmployeeRecord> {
    await collection().doc(id).update({ ...data, updatedAt: null });
    const snapshot = await collection().doc(id).get();
    return toRecord(id, snapshot.data()!);
  },

  async softDelete(id: string, terminationDate: Date | null): Promise<void> {
    await collection().doc(id).update({
      status: 'TERMINATED',
      terminationDate: terminationDate ? terminationDate : null,
      deletedAt: null // puede quedar en null, el historial es por estado
    });
  },

  async rejoin(id: string, hireDate: Date): Promise<EmployeeRecord> {
    await collection().doc(id).update({
      status: 'ACTIVE',
      hireDate: hireDate,
      terminationDate: null
    });
    const snapshot = await collection().doc(id).get();
    return toRecord(id, snapshot.data()!);
  }
};
