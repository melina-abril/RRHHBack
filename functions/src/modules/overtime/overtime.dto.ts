/**
 * Tipos del módulo Horas Extras. OvertimeRequestDto y OvertimeRequestRequest son el contrato con el front; OvertimeRequestDoc es el documento tal como está en Firestore.
 */
import type { Timestamp } from 'firebase-admin/firestore';

/**
 * Estado de la solicitud de horas extras.
 * Valores EXACTOS según la base de datos (firestore/seeds/V8__overtime.js).
 */
export const OVERTIME_STATUSES = [
  'PENDING_APPROVAL',
  'AUTHORIZED',
  'REJECTED',
  'COMPENSATION_PENDING',
  'COMPENSATED'
] as const;
export type OvertimeRequestStatus = (typeof OVERTIME_STATUSES)[number];

/**
 * Estado de la compensación de horas extras.
 */
export const COMPENSATION_STATUSES = [
  'PENDING',
  'COMPENSATED'
] as const;
export type CompensationStatus = (typeof COMPENSATION_STATUSES)[number];

/**
 * Documento: overtimeRequests/{id} en Firestore.
 */
export interface OvertimeRequestDoc {
  employeeId: string;
  month: string; // YYYY-MM
  requestedById: string;
  leaderId: string;
  directorId: string;
  status: OvertimeRequestStatus;
  requestedHours: number;
  authorizedHours: number | null;
  workedHours: number | null;
  compensationHours: number | null;
  compensationStatus: CompensationStatus | null;
  comments: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Lo que devuelve la API en los listados y detalles. Fechas string ISO.
 */
export interface OvertimeRequestDto {
  id: string;
  employeeId: string;
  month: string;
  requestedById: string;
  leaderId: string;
  directorId: string;
  status: OvertimeRequestStatus;
  requestedHours: number;
  authorizedHours: number | null;
  workedHours: number | null;
  compensationHours: number | null;
  compensationStatus: CompensationStatus | null;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Body de POST /api/overtime-requests (registro de solicitud de horas extras).
 */
export interface OvertimeRequestRequest {
  employeeId: string;
  month: string; // YYYY-MM
  requestedById: string;
  leaderId: string;
  directorId: string;
  requestedHours: number;
  comments: string | null;
}

/**
 * Body de POST /api/overtime-requests/:id/authorize (autorización de la solicitud y registro de horas y compensación).
 */
export interface AuthorizeOvertimeRequestRequest {
  authorizedHours: number;
  workedHours: number;
  compensationHours: number;
  compensationStatus: CompensationStatus;
  comments: string | null;
}
