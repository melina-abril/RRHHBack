/**
 * DTOs y tipos del módulo Gestión de empleados.
 * - {Entidad}Doc: documento real en Firestore (nombres y tipos EXACTOS de la capa database)
 * - {Entidad}Dto: respuesta de la API (fechas como string ISO, id)
 * - {Entidad}Request: alta o edición (solo campos editables, nunca id, createdAt, etc)
 * - Filtros y enums como const array y type
 */
import type { Timestamp } from 'firebase-admin/firestore';

export const EMPLOYEE_STATUSES = ['ACTIVE', 'ON_LEAVE', 'TERMINATED'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export interface EmployeeDoc {
  employeeNumber: string; // ej: 'E-0001'
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EmployeeDto {
  id: string; // igual a employeeNumber
  employeeNumber: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string | null; // YYYY-MM-DD
  email: string;
  phone: string;
  hireDate: string | null; // YYYY-MM-DD
  terminationDate: string | null; // YYYY-MM-DD
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  createdAt: string | null; // ISO
  updatedAt: string | null;
}

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

export interface EmployeesFilters {
  search: string | null;
  status: EmployeeStatus | null;
  departmentId: string | null;
  positionId: string | null;
}

export const LEAVE_TYPES = ['TERMINATION', 'RESIGNATION', 'RETIREMENT'] as const;
export type LeaveType = (typeof LEAVE_TYPES)[number];

// Movement subdocument
export const MOVEMENT_TYPES = [
  'ONBOARDING',
  'TERMINATION',
  'REJOIN',
  'PROMOTION',
  'ASSIGNMENT',
  'REMARK'
] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

export interface MovementDoc {
  type: MovementType;
  date: Timestamp;
  description: string;
  changedBy: string;
  details: Record<string, unknown> | null;
  createdAt: Timestamp;
}

export interface MovementDto {
  id: string;
  type: MovementType;
  date: string | null;
  description: string;
  changedBy: string;
  details: Record<string, unknown> | null;
  createdAt: string | null;
}
