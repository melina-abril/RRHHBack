/**
 * Tipos del módulo Gestión de Empleados
 * - EmployeeDoc: forma EXACTA del documento Firestore employees/{id}
 * - EmployeeDto: respuesta de la API (fechas en string ISO)
 * - EmployeeRequest: alta/edición
 * - EmployeeFilters: filtros de búsqueda del listado
 * - Enums: listas y tipos
 */
import type { Timestamp } from 'firebase-admin/firestore';

export const EMPLOYEE_STATUSES = ['ACTIVE', 'ON_LEAVE', 'TERMINATED'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

/** Documento employees/{id} (colección compartida) */
export interface EmployeeDoc {
  employeeNumber: string; // id de negocio correlativo, ej. "E-0001"
  firstName: string;
  lastName: string;
  documentType: string; // ej. "DNI", "CUIT"
  documentNumber: string;
  birthDate: Timestamp;
  email: string;
  phone: string;
  hireDate: Timestamp;
  terminationDate: Timestamp | null;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus; // 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Respuesta de la API (EmployeeDto): campos relevantes para la vista (fechas string ISO) */
export interface EmployeeDto {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;         // YYYY-MM-DD
  email: string;
  phone: string;
  hireDate: string;          // YYYY-MM-DD
  terminationDate: string | null; // YYYY-MM-DD o null
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  createdAt: string;         // ISO 8601
  updatedAt: string;         // ISO 8601
}

/** Body de alta y edición */
export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;        // YYYY-MM-DD
  email: string;
  phone: string;
  hireDate: string;         // YYYY-MM-DD
  departmentId: string;
  positionId: string;
  managerId: string | null;
}

/** Body de reingreso: solo la fecha y datos laborales que pueden haber cambiado (no se repite todo) */
export interface EmployeeReinstateRequest {
  hireDate: string;         // YYYY-MM-DD
  departmentId: string;
  positionId: string;
  managerId: string | null;
}

/** Filtros del listado (por query): búsqueda, estado, cliente, proyecto, categoría */
export interface EmployeeFilters {
  search: string | null;
  status: EmployeeStatus | null;
  departmentId: string | null;
  positionId: string | null;
  clientId: string | null;
  projectId: string | null;
}
