import { z } from 'zod';

export const EMPLOYEE_DEDICATIONS = ['FULL_TIME', 'PART_TIME'] as const;
export const EMPLOYEE_WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE'] as const;
export const EMPLOYEE_CATEGORIES = ['PERMANENT', 'INTERN'] as const;
export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

const dateSchema = z.iso.date({ error: 'Ingresa una fecha válida con formato AAAA-MM-DD.' });

/** El legajo, la categoría, el estado y las asignaciones se modifican mediante otros procesos. */
export const updateEmployeeSchema = z.object({
  firstName: z.string({ error: 'El nombre es obligatorio.' }).trim().min(1, 'El nombre es obligatorio.').max(120),
  lastName: z.string({ error: 'El apellido es obligatorio.' }).trim().min(1, 'El apellido es obligatorio.').max(120),
  birthDate: dateSchema,
  residenceCountry: z.string({ error: 'El país de residencia es obligatorio.' }).trim().min(1, 'El país de residencia es obligatorio.').max(120),
  personalEmail: z.email({ error: 'Ingresa un correo personal válido.' }).max(254),
  dedication: z.enum(EMPLOYEE_DEDICATIONS, { error: 'Selecciona una dedicación válida.' }),
  workMode: z.enum(EMPLOYEE_WORK_MODES, { error: 'Selecciona una modalidad de trabajo válida.' }),
  jobRole: z.string({ error: 'El rol laboral es obligatorio.' }).trim().min(1, 'El rol laboral es obligatorio.').max(120),
}).strict();

export type UpdateEmployeeRequest = z.output<typeof updateEmployeeSchema>;

export interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  startDate: string;
  category: (typeof EMPLOYEE_CATEGORIES)[number];
  dedication: (typeof EMPLOYEE_DEDICATIONS)[number];
  workMode: (typeof EMPLOYEE_WORK_MODES)[number];
  jobRole: string;
  status: (typeof EMPLOYEE_STATUSES)[number];
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  createdAt: string;
  deletedAt: string | null;
}
