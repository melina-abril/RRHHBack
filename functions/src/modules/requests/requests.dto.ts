import type { Timestamp } from 'firebase-admin/firestore';

// ----------- STATUS ENUMS (según datos de ejemplo y negocio) -----------
export const REQUEST_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const LEAVE_TYPES = ['STUDY', 'MEDICAL', 'MOVING'] as const;
export type LeaveType = (typeof LEAVE_TYPES)[number];

export const ABSENCE_TYPES = ['UNPLANNED', 'PERMISSION', 'JUSTIFIED_ABSENCE'] as const;
export type AbsenceType = (typeof ABSENCE_TYPES)[number];

// ----------- FIRESTORE DOCS -----------

/** Documento vacationRequests/{id} */
export interface VacationRequestDoc {
  employeeId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  days: number;
  status: RequestStatus;
  reason: string;
  submittedAt: Timestamp;
  decidedAt: Timestamp | null;
  approverId: string | null;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
}

/** Documento leaveRequests/{id} */
export interface LeaveRequestDoc {
  employeeId: string;
  leaveType: LeaveType;
  startDate: Timestamp;
  endDate: Timestamp;
  days: number;
  status: RequestStatus;
  reason: string | null;
  submittedAt: Timestamp;
  decidedAt: Timestamp | null;
  approverId: string | null;
  documentation: string | null;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
}

/** Documento absenceRequests/{id} */
export interface AbsenceRequestDoc {
  employeeId: string;
  type: AbsenceType;
  date: Timestamp;
  hours: number | null;
  status: RequestStatus;
  reason: string;
  submittedAt: Timestamp;
  decidedAt: Timestamp | null;
  approverId: string | null;
  deletedAt: Timestamp | null;
  createdAt: Timestamp;
}

// ----------- DTO -----------

export interface BaseRequestDto {
  id: string;
  type: 'VACATION' | 'LEAVE' | 'ABSENCE';
  employeeId: string;
  status: RequestStatus;
  reason: string | null;
  submittedAt: string; // ISO date
  decidedAt: string | null;
  approverId: string | null;
}

export interface VacationRequestDto extends BaseRequestDto {
  type: 'VACATION';
  startDate: string;
  endDate: string;
  days: number;
}

export interface LeaveRequestDto extends BaseRequestDto {
  type: 'LEAVE';
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  documentation: string | null;
}

export interface AbsenceRequestDto extends BaseRequestDto {
  type: 'ABSENCE';
  absenceType: AbsenceType;
  date: string;
  hours: number | null;
}

export type RequestDto = VacationRequestDto | LeaveRequestDto | AbsenceRequestDto;

// ----------- CREATION FILTERS AND REQUESTS -----------

// No hay una operación de alta desde la API interna, pero si lo hubiera:
// export interface VacationRequestCreate { ... }
// export interface LeaveRequestCreate { ... }
// export interface AbsenceRequestCreate { ... }

// Filtros de búsqueda/listado
export interface RequestFilters {
  search: string | null;
  employeeId: string | null;
  status: RequestStatus | null;
  type: 'VACATION' | 'LEAVE' | 'ABSENCE' | null;
}
