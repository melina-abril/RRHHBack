import { z } from 'zod';

export const EMPLOYMENT_CATEGORIES = ['INTERN', 'PERMANENT'] as const;
export type EmploymentCategory = (typeof EMPLOYMENT_CATEGORIES)[number];

export const EMPLOYMENT_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

export const MOVEMENT_TYPES = ['HIRE', 'CATEGORY_CHANGE', 'DEPARTURE', 'REHIRE'] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

const effectiveDateSchema = z.iso.date({ error: 'Ingresa una fecha válida en formato AAAA-MM-DD.' });
const reasonSchema = z.string().trim().min(1, 'Ingresa un motivo.').max(500, 'Usa hasta 500 caracteres.');

export const categoryChangeSchema = z.object({
  effectiveDate: effectiveDateSchema,
  category: z.enum(EMPLOYMENT_CATEGORIES, { error: 'Elige una categoría válida.' }),
  reason: reasonSchema,
});
export type CategoryChangeRequest = z.output<typeof categoryChangeSchema>;

export const departureSchema = z.object({
  effectiveDate: effectiveDateSchema,
  reason: reasonSchema,
});
export type DepartureRequest = z.output<typeof departureSchema>;

export const rehireSchema = z.object({
  effectiveDate: effectiveDateSchema,
  category: z.enum(EMPLOYMENT_CATEGORIES, { error: 'Elige una categoría válida.' }),
  reason: reasonSchema,
});
export type RehireRequest = z.output<typeof rehireSchema>;

export interface EmploymentMovementResponse {
  id: string;
  type: MovementType;
  effectiveDate: string;
  previousCategory: EmploymentCategory | null;
  category: EmploymentCategory;
  previousStatus: EmploymentStatus | null;
  status: EmploymentStatus;
  reason: string | null;
  recordedById: string;
  recordedAt: string;
}

export interface EmploymentMovementsResponse {
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  category: EmploymentCategory;
  status: EmploymentStatus;
  startDate: string;
  movements: EmploymentMovementResponse[];
}
