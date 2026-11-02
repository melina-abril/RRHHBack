/**
 * Tipos del módulo Gestión de Empleados. EmployeeDoc es el documento de Firestore (employees/{id}) según los scripts,
 * EmployeeDto es el contrato con el front (fechas como string ISO), EmployeeRequest el body de alta, EmployeeFilters los filtros.
 */
import type { Timestamp } from 'firebase-admin/firestore';

export const EMPLOYEE_STATUSES = [
  'ACTIVE',
  'INACTIVE',
] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

/** Documento employees/{id} en Firestore (capa database). */
export interface EmployeeDoc {
  employeeNumber: string; // mismo que id
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: Timestamp;
  email: string;
  phone: string;
  hireDate: Timestamp;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  terminationDate: Timestamp | null;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Lo que devuelve la API (fechas como ISO string). */
export interface EmployeeDto {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phone: string;
  hireDate: string;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  terminationDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Body para alta/edición (POST/PUT en alta). */
export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string; // ISO date
  email: string;
  phone: string;
  hireDate: string; // ISO date
  departmentId: string;
  positionId: string;
  managerId: string | null;
}

/** Filtros de búsquedas (query params). */
export interface EmployeeFilters {
  search: string | null;
  status: EmployeeStatus | null;
  departmentId: string | null;
  positionId: string | null;
}
