import type { Timestamp } from 'firebase-admin/firestore';

export const ASSIGNMENT_STATUSES = ['ACTIVE', 'ENDED'] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];
export const ASSIGNMENT_ACTIONS = ['CREATED', 'UPDATED', 'ENDED'] as const;
export type AssignmentAction = (typeof ASSIGNMENT_ACTIONS)[number];

export interface ClientDoc {
  name: string;
  active: boolean;
  createdAt: Timestamp;
}
export interface ClientDto {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}
export interface ClientRequest {
  name: string;
  active: boolean;
}

export interface ClientCountryDoc {
  clientId: string;
  countryCode: string;
  countryName: string;
  createdAt: Timestamp;
}
export interface ClientCountryDto {
  id: string;
  clientId: string;
  countryCode: string;
  countryName: string;
  createdAt: string;
}
export interface ClientCountryRequest {
  countryCode: string;
  countryName: string;
}

export interface ProjectDoc {
  clientId: string;
  name: string;
  clientCountryIds: string[];
  active: boolean;
  createdAt: Timestamp;
}
export interface ProjectDto {
  id: string;
  clientId: string;
  name: string;
  clientCountryIds: string[];
  active: boolean;
  createdAt: string;
}
export interface ProjectRequest {
  clientId: string;
  name: string;
  clientCountryIds: string[];
  active: boolean;
}

export interface ProjectContactDoc {
  projectId: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: Timestamp;
}
export interface ProjectContactDto {
  id: string;
  projectId: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}
export interface ProjectContactRequest {
  name: string;
  email: string;
  active: boolean;
}

/** Valores conservados en assignmentEvents, independientes de los catálogos vigentes. */
export interface AssignmentValues {
  employeeId: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  clientCountryId: string;
  countryName: string;
  contactId: string | null;
  contactName: string | null;
  role: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  status: AssignmentStatus;
}
export interface AssignmentDoc extends AssignmentValues {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface AssignmentEventDoc {
  assignmentId: string;
  action: AssignmentAction;
  actorUserId: string;
  occurredAt: Timestamp;
  beforeValues: AssignmentValues | null;
  afterValues: AssignmentValues;
  createdAt: Timestamp;
}
export interface AssignmentValuesDto {
  employeeId: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  clientCountryId: string;
  countryName: string;
  contactId: string | null;
  contactName: string | null;
  role: string;
  startDate: string;
  endDate: string | null;
  status: AssignmentStatus;
}
export interface AssignmentEventDto {
  id: string;
  assignmentId: string;
  action: AssignmentAction;
  actorUserId: string;
  occurredAt: string;
  beforeValues: AssignmentValuesDto | null;
  afterValues: AssignmentValuesDto;
  createdAt: string;
}
export interface AssignmentDto extends AssignmentValuesDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  history: AssignmentEventDto[];
}
export interface EmployeeAssignmentsDto {
  active: AssignmentDto[];
  ended: AssignmentDto[];
}
export interface AssignmentRequest {
  clientId: string;
  clientCountryId: string;
  projectId: string;
  contactId: string | null;
  role: string;
  startDate: string;
  endDate: string | null;
}
export interface FinalizeAssignmentRequest {
  endDate: string;
}
