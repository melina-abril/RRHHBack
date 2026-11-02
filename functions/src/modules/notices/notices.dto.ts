/**
 * Tipos del módulo Notices.
 * NoticeDoc: el documento tal cual está en Firestore.
 * NoticeDto: la respuesta hacia el front, fechas como string ISO.
 * NoticeRequest: body para la creación del comunicado.
 * Enums exportados como const arrays.
 */
import type { Timestamp } from 'firebase-admin/firestore';

export const NOTICE_DELIVERY_STATES = ['SENT', 'ERROR', 'DRAFT'] as const;
export type NoticeDeliveryState = (typeof NOTICE_DELIVERY_STATES)[number];

export interface NoticeError {
  employeeId: string;
  email: string;
  message: string;
}

/** Documento Firestore: notices/{id} */
export interface NoticeDoc {
  subject: string;
  body: string;
  sentById: string;
  sentByName: string;
  targetEmployeeIds: string[];
  targetDepartments: string[] | null;
  sentAt: Timestamp | null;
  deliveryState: NoticeDeliveryState;
  deliveryResult: string | null;
  errors: NoticeError[] | null;
  createdAt?: Timestamp;
}

/** DTO respuesta: fechas en string ISO. */
export interface NoticeDto {
  id: string;
  subject: string;
  body: string;
  sentById: string;
  sentByName: string;
  targetEmployeeIds: string[];
  targetDepartments: string[] | null;
  sentAt: string | null;
  deliveryState: NoticeDeliveryState;
  deliveryResult: string | null;
  errors: NoticeError[] | null;
}

/** Body de creación del comunicado. */
export interface NoticeRequest {
  subject: string;
  body: string;
  targetEmployeeIds: string[];
  targetDepartments: string[] | null;
}

/** Filtros de búsqueda: por ahora vacíos, pero pueden ampliarse en el futuro. */
export interface NoticeFilters {
  search: string | null;
  department: string | null;
  deliveryState: NoticeDeliveryState | null;
}
