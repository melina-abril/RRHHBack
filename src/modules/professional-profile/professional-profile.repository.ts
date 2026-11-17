import type { Timestamp } from 'firebase-admin/firestore';
import { db } from '../../config/database.js';
import { nowTimestamp, withId } from '../../shared/db/db-utils.js';
import type { ProfessionalDocumentRequest, ProfessionalProfileRequest } from './professional-profile.schemas.js';

export interface ProfessionalDocumentDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string | null;
  contentType: 'application/pdf' | 'image/png' | 'image/jpeg' | null;
  contentBase64: string | null;
  createdAt: Timestamp;
  createdById: string;
}

export interface ProfessionalProfileDocument {
  skills: string[];
  technologies: string[];
  experienceYears: number | null;
  experienceDescription: string;
  certifications: string[];
  documents: ProfessionalDocumentDocument[];
  updatedAt: Timestamp;
  updatedById: string;
}

/** Colección compartida: no se crea una colección adicional para el perfil. */
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

export interface EmployeeDocument {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  residenceCountry: string;
  personalEmail: string;
  startDate: Timestamp;
  category: 'PERMANENT' | 'INTERN';
  dedication: 'FULL_TIME' | 'PART_TIME';
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  jobRole: string;
  status: 'ACTIVE' | 'INACTIVE';
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  createdAt: Timestamp;
  deletedAt: Timestamp | null;
  professionalProfile?: ProfessionalProfileDocument;
}
export type Employee = EmployeeDocument & { id: string };

const collection = () => db.collection(EMPLOYEES_COLLECTION.collectionName);

const emptyProfile = (userId: string): ProfessionalProfileDocument => ({
  skills: [],
  technologies: [],
  experienceYears: null,
  experienceDescription: '',
  certifications: [],
  documents: [],
  updatedAt: nowTimestamp(),
  updatedById: userId,
});

export const professionalProfileRepository = {
  async findEmployee(id: string): Promise<Employee | undefined> {
    return withId<EmployeeDocument>(await collection().doc(id).get());
  },

  async updateProfile(id: string, request: ProfessionalProfileRequest, userId: string): Promise<Employee | undefined> {
    const ref = collection().doc(id);
    const exists = await db.runTransaction(async (trx): Promise<boolean> => {
      const snapshot = await trx.get(ref);
      if (!snapshot.exists) return false;
      const employee = snapshot.data() as EmployeeDocument;
      const profile: ProfessionalProfileDocument = {
        ...emptyProfile(userId),
        ...employee.professionalProfile,
        ...request,
        updatedAt: nowTimestamp(),
        updatedById: userId,
      };
      trx.update(ref, { professionalProfile: profile });
      return true;
    });
    return exists ? this.findEmployee(id) : undefined;
  },

  async addDocument(id: string, document: ProfessionalDocumentRequest, documentId: string, userId: string): Promise<ProfessionalDocumentDocument | undefined> {
    const ref = collection().doc(id);
    return db.runTransaction(async (trx): Promise<ProfessionalDocumentDocument | undefined> => {
      const snapshot = await trx.get(ref);
      if (!snapshot.exists) return undefined;
      const employee = snapshot.data() as EmployeeDocument;
      const profile = employee.professionalProfile ?? emptyProfile(userId);
      const saved: ProfessionalDocumentDocument = {
        id: documentId,
        title: document.title,
        category: document.category,
        description: document.description,
        fileName: document.fileName ?? null,
        contentType: document.contentType ?? null,
        contentBase64: document.contentBase64 ?? null,
        createdAt: nowTimestamp(),
        createdById: userId,
      };
      const updated: ProfessionalProfileDocument = {
        ...profile,
        documents: [...profile.documents, saved],
        updatedAt: nowTimestamp(),
        updatedById: userId,
      };
      trx.update(ref, { professionalProfile: updated });
      return saved;
    });
  },
};
