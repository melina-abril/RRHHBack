import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export const EMPLOYEE_CATEGORIES = ['PERMANENT', 'INTERN'] as const;
export const EMPLOYEE_DEDICATIONS = ['FULL_TIME', 'PART_TIME'] as const;
export const EMPLOYEE_WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE'] as const;

export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];
export type EmployeeCategory = (typeof EMPLOYEE_CATEGORIES)[number];
export type EmployeeDedication = (typeof EMPLOYEE_DEDICATIONS)[number];
export type EmployeeWorkMode = (typeof EMPLOYEE_WORK_MODES)[number];

export const employeeRequestSchema = z.object({
  firstName: z.string({ error: 'Ingresa el nombre.' }).trim().min(1, 'Ingresa el nombre.').max(100),
  lastName: z.string({ error: 'Ingresa el apellido.' }).trim().min(1, 'Ingresa el apellido.').max(100),
  birthDate: z.iso.date({ error: 'Ingresa una fecha de nacimiento válida.' }),
  residenceCountry: z.string({ error: 'Ingresa el país de residencia.' }).trim().min(1, 'Ingresa el país de residencia.').max(100),
  personalEmail: z.email({ error: 'Ingresa un correo personal válido.' }).trim().max(254),
  startDate: z.iso.date({ error: 'Ingresa una fecha de ingreso válida.' }),
  category: z.enum(EMPLOYEE_CATEGORIES, { error: 'Selecciona una categoría válida.' }),
  dedication: z.enum(EMPLOYEE_DEDICATIONS, { error: 'Selecciona una dedicación válida.' }),
  workMode: z.enum(EMPLOYEE_WORK_MODES, { error: 'Selecciona una modalidad válida.' }),
  jobRole: z.string({ error: 'Ingresa el rol laboral.' }).trim().min(1, 'Ingresa el rol laboral.').max(120),
  initialClient: z.string().trim().max(120).nullable().optional(),
  initialProject: z.string().trim().max(120).nullable().optional(),
  initialManager: z.string().trim().max(120).nullable().optional(),
});
export type EmployeeRequest = z.output<typeof employeeRequestSchema>;

export const employeeListQuerySchema = pageQuerySchema.extend({
  search: z.string().trim().max(100).optional(),
  status: z.enum(EMPLOYEE_STATUSES, { error: 'Selecciona un estado válido.' }).optional(),
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
  createdAt: string;
}
