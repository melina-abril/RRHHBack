import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const EMPLOYEE_CATEGORIES = ['PERMANENT', 'INTERN'] as const;
export const EMPLOYEE_COMMITMENTS = ['FULL_TIME', 'PART_TIME'] as const;
export const EMPLOYEE_WORK_MODES = ['REMOTE', 'HYBRID', 'ON_SITE'] as const;
export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export type EmployeeCategory = (typeof EMPLOYEE_CATEGORIES)[number];
export type EmployeeCommitment = (typeof EMPLOYEE_COMMITMENTS)[number];
export type EmployeeWorkMode = (typeof EMPLOYEE_WORK_MODES)[number];
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

const dateSchema = z.string({ error: 'Ingresa una fecha.' }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD.').refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}, 'Ingresa una fecha válida.');

const optionalName = z.string().trim().max(120, 'Usa hasta 120 caracteres.').nullish().transform((value) => value || null);

export const employeeRequestSchema = z.object({
  firstName: z.string({ error: 'Ingresa el nombre.' }).trim().min(1, 'Ingresa el nombre.').max(120, 'Usa hasta 120 caracteres.'),
  lastName: z.string({ error: 'Ingresa el apellido.' }).trim().min(1, 'Ingresa el apellido.').max(120, 'Usa hasta 120 caracteres.'),
  birthDate: dateSchema,
  residenceCountry: z.string({ error: 'Ingresa el país de residencia.' }).trim().min(1, 'Ingresa el país de residencia.').max(120, 'Usa hasta 120 caracteres.'),
  personalEmail: z.email({ error: 'Ingresa un correo electrónico válido.' }).trim().max(254, 'Usa hasta 254 caracteres.'),
  hireDate: dateSchema,
  category: z.enum(EMPLOYEE_CATEGORIES, { error: 'Elige una categoría válida.' }),
  commitment: z.enum(EMPLOYEE_COMMITMENTS, { error: 'Elige una dedicación válida.' }),
  workMode: z.enum(EMPLOYEE_WORK_MODES, { error: 'Elige una modalidad válida.' }),
  jobRole: z.string({ error: 'Ingresa el puesto.' }).trim().min(1, 'Ingresa el puesto.').max(120, 'Usa hasta 120 caracteres.'),
  clientName: optionalName,
  projectName: optionalName,
  contactName: optionalName,
});
export type EmployeeRequest = z.output<typeof employeeRequestSchema>;

export const employeeListQuerySchema = pageQuerySchema.extend({
  search: z.string().trim().max(100, 'Usa hasta 100 caracteres.').optional(),
});
export type EmployeeListQuery = z.output<typeof employeeListQuerySchema>;

export interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  hireDate: string;
  category: EmployeeCategory;
  commitment: EmployeeCommitment;
  workMode: EmployeeWorkMode;
  jobRole: string;
  clientName: string | null;
  projectName: string | null;
  contactName: string | null;
  status: EmployeeStatus;
  createdAt: string;
}
