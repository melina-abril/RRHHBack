import { db } from '../../shared/firestore';
import type {
  VacationRequestDoc,
  LeaveRequestDoc,
  AbsenceRequestDoc
} from './requests.dto';

export type VacationRequestRecord = VacationRequestDoc & { id: string };
export type LeaveRequestRecord = LeaveRequestDoc & { id: string };
export type AbsenceRequestRecord = AbsenceRequestDoc & { id: string };

// Devuelve todos los documentos de las 3 colecciones, sin paginar ni filtrar (el servicio filtra).
export const requestsRepository = {
  async findAllRaw(): Promise<{
    vacations: VacationRequestRecord[];
    leaves: LeaveRequestRecord[];
    absences: AbsenceRequestRecord[];
  }> {
    const [vr, lr, ar] = await Promise.all([
      db.collection('vacationRequests').where('deletedAt', '==', null).get(),
      db.collection('leaveRequests').where('deletedAt', '==', null).get(),
      db.collection('absenceRequests').where('deletedAt', '==', null).get(),
    ]);
    const vacations = vr.docs.map(doc => ({ id: doc.id, ...(doc.data() as VacationRequestDoc) }));
    const leaves = lr.docs.map(doc => ({ id: doc.id, ...(doc.data() as LeaveRequestDoc) }));
    const absences = ar.docs.map(doc => ({ id: doc.id, ...(doc.data() as AbsenceRequestDoc) }));
    return { vacations, leaves, absences };
  },

  async findById(id: string): Promise<
    | { kind: 'VACATION'; data: VacationRequestRecord }
    | { kind: 'LEAVE'; data: LeaveRequestRecord }
    | { kind: 'ABSENCE'; data: AbsenceRequestRecord }
    | null
  > {
    // Vacations
    const vrSnap = await db.collection('vacationRequests').doc(id).get();
    if (vrSnap.exists && (vrSnap.data() as VacationRequestDoc).deletedAt === null) {
      return { kind: 'VACATION', data: { id: vrSnap.id, ...(vrSnap.data() as VacationRequestDoc) } };
    }
    // Leaves
    const lrSnap = await db.collection('leaveRequests').doc(id).get();
    if (lrSnap.exists && (lrSnap.data() as LeaveRequestDoc).deletedAt === null) {
      return { kind: 'LEAVE', data: { id: lrSnap.id, ...(lrSnap.data() as LeaveRequestDoc) } };
    }
    // Absences
    const arSnap = await db.collection('absenceRequests').doc(id).get();
    if (arSnap.exists && (arSnap.data() as AbsenceRequestDoc).deletedAt === null) {
      return { kind: 'ABSENCE', data: { id: arSnap.id, ...(arSnap.data() as AbsenceRequestDoc) } };
    }
    return null;
  },

  async updateStatus(
    kind: 'VACATION' | 'LEAVE' | 'ABSENCE',
    id: string,
    status: 'APPROVED' | 'REJECTED',
    approverId: string,
    decidedAt: Date,
    reason: string | null
  ): Promise<void> {
    const baseUpdate = {
      status,
      approverId,
      decidedAt,
      ...(status === 'REJECTED' ? { reason } : {})
    };
    let ref;
    if (kind === 'VACATION') {
      ref = db.collection('vacationRequests').doc(id);
    } else if (kind === 'LEAVE') {
      ref = db.collection('leaveRequests').doc(id);
    } else {
      ref = db.collection('absenceRequests').doc(id);
    }
    await ref.update(baseUpdate);
  }
};
