import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const EMPLOYEE_CATEGORIES = ['PERMANENT', 'INTERN'] as const;
export const EMPLOYEE_DEDICATIONS = ['FULL_TIME', 'PART_TIME'] as const;
export const EMPLOYEE_WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE'] as const;
export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export type EmployeeCategory = (typeof EMPLOYEE_CATEGORIES)[number];
export type EmployeeDedication = (typeof EMPLOYEE_DEDICATIONS)[number];
export type EmployeeWorkMode = (typeof EMPLOYEE_WORK_MODES)[number];
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

const requiredText = (label: string, maximum: number) =>
  z.string({ error: `${label} es obligatorio.` }).trim().min(1, `${label} es obligatorio.`).max(maximum, `Usa hasta ${maximum} caracteres.`);

const editableFields = {
  firstName: requiredText('El nombre', 100),
  lastName: requiredText('El apellido', 100),
  birthDate: z.iso.date({ error: 'Ingresa una fecha de nacimiento válida.' }),
  residenceCountry: requiredText('El país de residencia', 100),
  personalEmail: z.email({ error: 'Ingresa un correo personal válido.' }),
  dedication: z.enum(EMPLOYEE_DEDICATIONS, { error: 'Elige una dedicación válida.' }),
  workMode: z.enum(EMPLOYEE_WORK_MODES, { error: 'Elige una modalidad de trabajo válida.' }),
  jobRole: requiredText('El rol laboral', 120),
};

/** El legajo, la categoría, las asignaciones y el estado no se editan aquí. */
export const employeeUpdateSchema = z.strictObject(editableFields);
export type EmployeeUpdateRequest = z.output<typeof employeeUpdateSchema>;

export const employeeCreateSchema = z.strictObject({
  ...editableFields,
  startDate: z.iso.date({ error: 'Ingresa una fecha de ingreso válida.' }),
  category: z.enum(EMPLOYEE_CATEGORIES, { error: 'Elige una categoría válida.' }),
  initialClient: z.string().trim().max(120).nullable().optional(),
  initialProject: z.string().trim().max(120).nullable().optional(),
  initialManager: z.string().trim().max(120).nullable().optional(),
});
export type EmployeeCreateRequest = z.output<typeof employeeCreateSchema>;

export const employeeListQuerySchema = pageQuerySchema.extend({
  search: z.string().trim().max(100).optional(),
  category: z.enum(EMPLOYEE_CATEGORIES).optional(),
  client: z.string().trim().max(120).optional(),
  project: z.string().trim().max(120).optional(),
  status: z.enum(EMPLOYEE_STATUSES).optional(),
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
  startDate: string;
  category: EmployeeCategory;
  dedication: EmployeeDedication;
  workMode: EmployeeWorkMode;
  jobRole: string;
  status: EmployeeStatus;
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  createdAt: string;
  deletedAt: string | null;
}
