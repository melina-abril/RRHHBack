import type { DocumentData, Timestamp } from 'firebase-admin/firestore';
import { db } from '../../shared/firestore';
import { NoticeDoc } from './notices.dto';

const collection = () => db.collection('notices');

export type NoticeRecord = NoticeDoc & { id: string };

const toRecord = (id: string, data: DocumentData): NoticeRecord => ({ id, ...(data as NoticeDoc) });

export const noticesRepository = {
  async findAll(): Promise<NoticeRecord[]> {
    const snapshot = await collection().orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => toRecord(doc.id, doc.data()));
  },

  async findById(id: string): Promise<NoticeRecord | null> {
    const docSnap = await collection().doc(id).get();
    const data = docSnap.data();
    return data ? toRecord(docSnap.id, data) : null;
  },

  /** Alta: Firestore genera el id. sentAt y deliveryState las maneja el servicio (al crear puede ser null al inicio). */
  async create(data: NoticeDoc): Promise<NoticeRecord> {
    const ref = await collection().add(data);
    return { id: ref.id, ...data };
  }
};
