/**
 * Tipos del módulo de gestión de empleados. EmployeeDoc corresponde a la colección employees en Firestore,
 * con sus campos EXACTOS. EmployeeDto es la respuesta al front con las fechas como string.
 */
import type { Timestamp } from 'firebase-admin/firestore';

/** Estados posibles del colaborador. */
export const EMPLOYEE_STATUSES = ['ACTIVE', 'TERMINATED'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

/** Documento employees/{id} en Firestore */
export interface EmployeeDoc {
  employeeNumber: string; // id correlativo (ej. 'E-0001')
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: Timestamp;
  email: string;
  phone: string;
  hireDate: Timestamp;
  terminationDate: Timestamp | null;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  deletedAt: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

/** Lo que devuelve la API al front (fechas como string ISO, campos legibles) */
export interface EmployeeDto {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string | null;
  email: string;
  phone: string;
  hireDate: string | null;
  terminationDate: string | null;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Body para crear o editar empleado (excluye campos internos, estado y fechas automáticas) */
export interface EmployeeRequest {
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
}

/** Filtros del listado empleados (legajo o nombre, estado) */
export interface EmployeeFilters {
  search: string | null;
  status: EmployeeStatus | null;
  departmentId: string | null;
  positionId: string | null;
}
