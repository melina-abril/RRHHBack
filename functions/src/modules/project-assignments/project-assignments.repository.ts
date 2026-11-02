import { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../shared/firestore';
import type { AssignmentAction, AssignmentDoc, AssignmentEventDoc, AssignmentValues, ClientCountryDoc, ClientDoc, ProjectContactDoc, ProjectDoc } from './project-assignments.dto';

export type RecordWithId<T> = T & { id: string };
export type ClientRecord = RecordWithId<ClientDoc>;
export type CountryRecord = RecordWithId<ClientCountryDoc>;
export type ProjectRecord = RecordWithId<ProjectDoc>;
export type ContactRecord = RecordWithId<ProjectContactDoc>;
export type AssignmentRecord = RecordWithId<AssignmentDoc>;
export type EventRecord = RecordWithId<AssignmentEventDoc>;
export interface EmployeeRecord {
  id: string;
  hireDate: Timestamp;
  status: string;
}

const clients = () => db.collection('clients');
const countries = () => db.collection('clientCountries');
const projects = () => db.collection('projects');
const contacts = () => db.collection('projectContacts');
const employees = () => db.collection('employees');
const assignments = () => db.collection('projectAssignments');
const events = () => db.collection('assignmentEvents');

const record = <T>(id: string, data: FirebaseFirestore.DocumentData): RecordWithId<T> => ({ id, ...data } as RecordWithId<T>);

export const projectAssignmentsRepository = {
  async listClients(): Promise<ClientRecord[]> {
    const snapshot = await clients().orderBy('name').get();
    return snapshot.docs.map((doc) => record<ClientDoc>(doc.id, doc.data()));
  },
  async client(id: string): Promise<ClientRecord | null> {
    const doc = await clients().doc(id).get();
    return doc.exists ? record<ClientDoc>(doc.id, doc.data() ?? {}) : null;
  },
  async createClient(data: ClientDoc): Promise<ClientRecord> {
    const ref = await clients().add(data);
    return { id: ref.id, ...data };
  },
  async listCountries(clientId: string): Promise<CountryRecord[]> {
    const snapshot = await countries().where('clientId', '==', clientId).get();
    return snapshot.docs.map((doc) => record<ClientCountryDoc>(doc.id, doc.data()));
  },
  async country(id: string): Promise<CountryRecord | null> {
    const doc = await countries().doc(id).get();
    return doc.exists ? record<ClientCountryDoc>(doc.id, doc.data() ?? {}) : null;
  },
  async createCountry(data: ClientCountryDoc): Promise<CountryRecord> {
    const ref = await countries().add(data);
    return { id: ref.id, ...data };
  },
  async listProjects(): Promise<ProjectRecord[]> {
    const snapshot = await projects().orderBy('name').get();
    return snapshot.docs.map((doc) => record<ProjectDoc>(doc.id, doc.data()));
  },
  async project(id: string): Promise<ProjectRecord | null> {
    const doc = await projects().doc(id).get();
    return doc.exists ? record<ProjectDoc>(doc.id, doc.data() ?? {}) : null;
  },
  async createProject(data: ProjectDoc): Promise<ProjectRecord> {
    const ref = await projects().add(data);
    return { id: ref.id, ...data };
  },
  async listContacts(projectId: string): Promise<ContactRecord[]> {
    const snapshot = await contacts().where('projectId', '==', projectId).get();
    return snapshot.docs.map((doc) => record<ProjectContactDoc>(doc.id, doc.data()));
  },
  async contact(id: string): Promise<ContactRecord | null> {
    const doc = await contacts().doc(id).get();
    return doc.exists ? record<ProjectContactDoc>(doc.id, doc.data() ?? {}) : null;
  },
  async createContact(data: ProjectContactDoc): Promise<ContactRecord> {
    const ref = await contacts().add(data);
    return { id: ref.id, ...data };
  },
  async employee(id: string): Promise<EmployeeRecord | null> {
    const doc = await employees().doc(id).get();
    const data = doc.data();
    return data ? { id: doc.id, hireDate: data['hireDate'] as Timestamp, status: data['status'] as string } : null;
  },
  async listAssignments(employeeId: string): Promise<AssignmentRecord[]> {
    const snapshot = await assignments().where('employeeId', '==', employeeId).get();
    return snapshot.docs.map((doc) => record<AssignmentDoc>(doc.id, doc.data()));
  },
  async assignment(id: string): Promise<AssignmentRecord | null> {
    const doc = await assignments().doc(id).get();
    return doc.exists ? record<AssignmentDoc>(doc.id, doc.data() ?? {}) : null;
  },
  async listEvents(assignmentIds: string[]): Promise<EventRecord[]> {
    if (!assignmentIds.length) return [];
    const snapshots = await Promise.all(
      assignmentIds.map((id) => events().where('assignmentId', '==', id).get()),
    );
    return snapshots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => record<AssignmentEventDoc>(doc.id, doc.data())),
    );
  },
  /** La asignación y su antecedente se escriben en la misma transacción. */
  async saveAssignment(id: string | null, data: AssignmentDoc, before: AssignmentValues | null, action: AssignmentAction, actorUserId: string): Promise<AssignmentRecord> {
    const ref = id ? assignments().doc(id) : assignments().doc();
    await db.runTransaction(async (transaction) => {
      if (id) {
        const existing = await transaction.get(ref);
        if (!existing.exists) throw new Error('La asignación dejó de existir durante el guardado.');
      }
      const now = Timestamp.now();
      const { createdAt: _createdAt, updatedAt: _updatedAt, ...afterValues } = data;
      void _createdAt;
      void _updatedAt;
      const event: AssignmentEventDoc = { assignmentId: ref.id, action, actorUserId, occurredAt: now, beforeValues: before, afterValues, createdAt: now };
      transaction.set(ref, data);
      transaction.set(events().doc(), event);
    });
    return { id: ref.id, ...data };
  },
};
