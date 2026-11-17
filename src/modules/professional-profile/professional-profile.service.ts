import { newId, toIsoDateTime } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { professionalProfileRepository, type Employee, type ProfessionalDocumentDocument } from './professional-profile.repository.js';
import type { ProfessionalDocumentRequest, ProfessionalDocumentResponse, ProfessionalProfileRequest, ProfessionalProfileResponse } from './professional-profile.schemas.js';

const notFound = (id: string): NotFoundError => new NotFoundError(`No existe el colaborador ${id}.`);

const toDocumentResponse = (document: ProfessionalDocumentDocument): ProfessionalDocumentResponse => ({
  id: document.id,
  title: document.title,
  category: document.category,
  description: document.description,
  fileName: document.fileName,
  contentType: document.contentType,
  contentBase64: document.contentBase64,
  createdAt: toIsoDateTime(document.createdAt),
});

const toResponse = (employee: Employee): ProfessionalProfileResponse => {
  const profile = employee.professionalProfile;
  return {
    employeeId: employee.id,
    skills: profile?.skills ?? [],
    technologies: profile?.technologies ?? [],
    experienceYears: profile?.experienceYears ?? null,
    experienceDescription: profile?.experienceDescription ?? '',
    certifications: profile?.certifications ?? [],
    documents: (profile?.documents ?? []).map(toDocumentResponse),
  };
};

export const professionalProfileService = {
  async get(id: string): Promise<ProfessionalProfileResponse> {
    const employee = await professionalProfileRepository.findEmployee(id);
    if (!employee) throw notFound(id);
    return toResponse(employee);
  },

  async update(id: string, request: ProfessionalProfileRequest, userId: string): Promise<ProfessionalProfileResponse> {
    const employee = await professionalProfileRepository.updateProfile(id, request, userId);
    if (!employee) throw notFound(id);
    return toResponse(employee);
  },

  async addDocument(id: string, request: ProfessionalDocumentRequest, userId: string): Promise<ProfessionalDocumentResponse> {
    const document = await professionalProfileRepository.addDocument(id, request, newId(), userId);
    if (!document) throw notFound(id);
    return toDocumentResponse(document);
  },
};
