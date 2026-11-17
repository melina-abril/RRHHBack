import { z } from 'zod';

const textItemSchema = z.string().trim().min(1, 'Ingresa un valor.').max(120, 'Usa hasta 120 caracteres.');

export const professionalProfileRequestSchema = z.object({
  skills: z.array(textItemSchema).max(50, 'Agrega hasta 50 habilidades.'),
  technologies: z.array(textItemSchema).max(50, 'Agrega hasta 50 tecnologías.'),
  experienceYears: z.number().min(0, 'Los años no pueden ser negativos.').max(80, 'Revisa los años de experiencia.').nullable(),
  experienceDescription: z.string().trim().max(2000, 'Usa hasta 2000 caracteres.'),
  certifications: z.array(textItemSchema).max(50, 'Agrega hasta 50 certificaciones.'),
});
export type ProfessionalProfileRequest = z.output<typeof professionalProfileRequestSchema>;

export const professionalDocumentRequestSchema = z.object({
  title: z.string().trim().min(1, 'Ingresa un título.').max(120, 'Usa hasta 120 caracteres.'),
  category: z.string().trim().min(1, 'Ingresa una categoría.').max(80, 'Usa hasta 80 caracteres.'),
  description: z.string().trim().max(500, 'Usa hasta 500 caracteres.').default(''),
  fileName: z.string().trim().min(1, 'Ingresa el nombre del archivo.').max(180, 'Usa hasta 180 caracteres.').optional(),
  contentType: z.enum(['application/pdf', 'image/png', 'image/jpeg']).optional(),
  contentBase64: z.string().regex(/^[A-Za-z0-9+/]+={0,2}$/, 'El archivo debe estar codificado en base64.').max(600_000, 'El archivo es demasiado grande.').optional(),
}).refine(
  (value) => [value.fileName, value.contentType, value.contentBase64].every((field) => field !== undefined) ||
    [value.fileName, value.contentType, value.contentBase64].every((field) => field === undefined),
  { message: 'Para adjuntar un archivo, indica su nombre, tipo y contenido.', path: ['contentBase64'] },
);
export type ProfessionalDocumentRequest = z.output<typeof professionalDocumentRequestSchema>;

export interface ProfessionalDocumentResponse {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string | null;
  contentType: 'application/pdf' | 'image/png' | 'image/jpeg' | null;
  contentBase64: string | null;
  createdAt: string;
}

export interface ProfessionalProfileResponse {
  employeeId: string;
  skills: string[];
  technologies: string[];
  experienceYears: number | null;
  experienceDescription: string;
  certifications: string[];
  documents: ProfessionalDocumentResponse[];
}
