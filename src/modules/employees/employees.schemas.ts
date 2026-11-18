import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const EMPLOYEE_CATEGORIES = ['PERMANENT', 'INTERN'] as const;
export type EmployeeCategory = (typeof EMPLOYEE_CATEGORIES)[number];

export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

const categorySchema = z.enum(EMPLOYEE_CATEGORIES, { error: 'Selecciona una categoría válida.' });
const statusSchema = z.enum(EMPLOYEE_STATUSES, { error: 'Selecciona un estado válido.' });

export const employeeListQuerySchema = pageQuerySchema.extend({
  search: z.string().trim().max(100, 'Usa hasta 100 caracteres.').optional(),
  category: categorySchema.optional(),
  status: statusSchema.optional(),
  country: z.string().trim().min(1).max(100).optional(),
  client: z.string().trim().min(1).max(120).optional(),
  project: z.string().trim().min(1).max(120).optional(),
});
export type EmployeeListQuery = z.output<typeof employeeListQuerySchema>;

export const employeeCreateSchema = z.object({
  firstName: z.string({ error: 'Ingresa el nombre.' }).trim().min(1, 'Ingresa el nombre.').max(100),
  lastName: z.string({ error: 'Ingresa el apellido.' }).trim().min(1, 'Ingresa el apellido.').max(100),
  email: z.email({ error: 'Ingresa un correo válido.' }).max(254),
  category: categorySchema,
  country: z.string({ error: 'Ingresa el país.' }).trim().min(1, 'Ingresa el país.').max(100),
  position: z.string({ error: 'Ingresa el puesto.' }).trim().min(1, 'Ingresa el puesto.').max(120),
  clientNames: z.array(z.string().trim().min(1).max(120)).default([]),
  projectNames: z.array(z.string().trim().min(1).max(120)).default([]),
  hireDate: z.iso.date({ error: 'Ingresa una fecha de ingreso válida.' }),
});
export type EmployeeCreateRequest = z.output<typeof employeeCreateSchema>;

export interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  category: EmployeeCategory;
  country: string;
  position: string;
  clientNames: string[];
  projectNames: string[];
  status: EmployeeStatus;
  hireDate: string;
  terminationDate: string | null;
}
