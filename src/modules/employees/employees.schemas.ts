import { z } from 'zod';
import { pageQuerySchema } from '../../shared/http/page.js';

export const EMPLOYEE_CATEGORIES = ['PERMANENT', 'INTERN'] as const;
export type EmployeeCategory = (typeof EMPLOYEE_CATEGORIES)[number];

export const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export const employeeListQuerySchema = pageQuerySchema.extend({
  search: z.string().trim().max(100, 'Usa hasta 100 caracteres.').optional(),
  category: z.enum(EMPLOYEE_CATEGORIES, { error: 'Elige una categoría válida.' }).optional(),
  status: z.enum(EMPLOYEE_STATUSES, { error: 'Elige un estado válido.' }).optional(),
  country: z.string().trim().max(100).optional(),
  client: z.string().trim().max(120).optional(),
  project: z.string().trim().max(120).optional(),
});
export type EmployeeListQuery = z.output<typeof employeeListQuerySchema>;

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
