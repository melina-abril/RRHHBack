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
  z.string({ error: `${label} es obligatorio.` }).trim().min(1, `${label} es obligatorio.`).max(maximum);

const optionalText = z.string().trim().max(120).nullable().optional().transform((value) => value || null);

export const employeeRequestSchema = z.object({
  firstName: requiredText('El nombre', 100),
  lastName: requiredText('El apellido', 100),
  birthDate: z.iso.date({ error: 'Ingresa una fecha de nacimiento válida.' }),
  residenceCountry: requiredText('El país de residencia', 100),
  personalEmail: z.email({ error: 'Ingresa un correo personal válido.' }).trim().toLowerCase(),
  startDate: z.iso.date({ error: 'Ingresa una fecha de ingreso válida.' }),
  category: z.enum(EMPLOYEE_CATEGORIES, { error: 'Selecciona una categoría válida.' }),
  dedication: z.enum(EMPLOYEE_DEDICATIONS, { error: 'Selecciona una dedicación válida.' }),
  workMode: z.enum(EMPLOYEE_WORK_MODES, { error: 'Selecciona una modalidad válida.' }),
  jobRole: requiredText('El puesto', 120),
  initialClient: optionalText,
  initialProject: optionalText,
  initialManager: optionalText,
}).refine((value) => value.birthDate < value.startDate, {
  path: ['startDate'],
  message: 'La fecha de ingreso debe ser posterior a la fecha de nacimiento.',
});
export type EmployeeRequest = z.output<typeof employeeRequestSchema>;

export const employeeListQuerySchema = pageQuerySchema;
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
  createdAt: string;
}
