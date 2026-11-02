import type { DocumentData } from 'firebase-admin/firestore';
import { db } from '../../shared/firestore';
import { OvertimeRequestDoc } from './overtime.dto';

const collection = () => db.collection('overtimeRequests');

export type OvertimeRequestRecord = OvertimeRequestDoc & { id: string };

function toRecord(id: string, data: DocumentData): OvertimeRequestRecord {
  return { id, ...(data as OvertimeRequestDoc) };
}

export const overtimeRepository = {
  /** Lista todas las solicitudes ordenadas por createdAt descendente. */
  async findAll(): Promise<OvertimeRequestRecord[]> {
    const snapshot = await collection().orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => toRecord(doc.id, doc.data()));
  },

  /** Busca una solicitud por id. */
  async findById(id: string): Promise<OvertimeRequestRecord | null> {
    const doc = await collection().doc(id).get();
    const data = doc.data();
    return data ? toRecord(doc.id, data) : null;
  },

  /** Alta: el id lo genera la capa database como OT-YYYYMM correlativo. */
  async create(id: string, data: OvertimeRequestDoc): Promise<OvertimeRequestRecord> {
    await collection().doc(id).set(data);
    return { id, ...data };
  },

  /** Actualiza los campos indicados en la solicitud. */
  async update(id: string, data: Partial<OvertimeRequestDoc>): Promise<OvertimeRequestRecord | null> {
    const docRef = collection().doc(id);
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) return null;
    await docRef.update(data);
    const updated = await docRef.get();
    return toRecord(updated.id, updated.data()!);
  }
};
