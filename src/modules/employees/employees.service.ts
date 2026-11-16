import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDate, toIsoDateTime } from '../../shared/db/db-utils.js';
import { ConflictError, NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { employeesRepository, type Employee, type EmployeeChanges } from './employees.repository.js';
import type { EmployeeListQuery, EmployeeRequest, EmployeeResponse } from './employees.schemas.js';

const dateTimestamp = (date: string): Timestamp => Timestamp.fromDate(new Date(`${date}T00:00:00.000Z`));

const editableFields = (request: EmployeeRequest): EmployeeChanges => ({
  firstName: request.firstName,
  lastName: request.lastName,
  birthDate: dateTimestamp(request.birthDate),
  residenceCountry: request.residenceCountry,
  personalEmail: request.personalEmail,
  startDate: dateTimestamp(request.startDate),
  category: request.category,
  dedication: request.dedication,
  workMode: request.workMode,
  jobRole: request.jobRole,
  initialClient: request.initialClient || null,
  initialProject: request.initialProject || null,
  initialManager: request.initialManager || null,
});

const toResponse = (employee: Employee): EmployeeResponse => ({
  id: employee.id,
  employeeNumber: employee.employeeNumber,
  firstName: employee.firstName,
  lastName: employee.lastName,
  birthDate: toIsoDate(employee.birthDate),
  residenceCountry: employee.residenceCountry,
  personalEmail: employee.personalEmail,
  startDate: toIsoDate(employee.startDate),
  category: employee.category,
  dedication: employee.dedication,
  workMode: employee.workMode,
  jobRole: employee.jobRole,
  status: employee.status,
  initialClient: employee.initialClient,
  initialProject: employee.initialProject,
  initialManager: employee.initialManager,
  createdById: employee.createdById,
  createdAt: toIsoDateTime(employee.createdAt),
  deletedAt: employee.deletedAt === null ? null : toIsoDateTime(employee.deletedAt),
});

const notFound = (id: string): NotFoundError => new NotFoundError(`No existe el colaborador ${id}.`);

export const employeesService = {
  async list(query: EmployeeListQuery): Promise<PageResponse<EmployeeResponse>> {
    const { items, total } = await employeesRepository.findPage(query);
    return toPageResponse(items.map(toResponse), total, query);
  },

  async get(id: string): Promise<EmployeeResponse> {
    const employee = await employeesRepository.findById(id);
    if (!employee) throw notFound(id);
    return toResponse(employee);
  },

  async create(request: EmployeeRequest, userId: string): Promise<EmployeeResponse> {
    if (await employeesRepository.existsByPersonalEmail(request.personalEmail)) {
      throw new ConflictError('Ya existe un colaborador con ese correo personal. Revisa si corresponde un reingreso.', 'personalEmail');
    }
    const employee = await employeesRepository.insert({
      ...editableFields(request),
      status: 'ACTIVE',
      createdById: userId,
      deletedAt: null,
    });
    return toResponse(employee);
  },

  async update(id: string, request: EmployeeRequest): Promise<EmployeeResponse> {
    if (!(await employeesRepository.findById(id))) throw notFound(id);
    if (await employeesRepository.existsByPersonalEmail(request.personalEmail, id)) {
      throw new ConflictError('Ya existe un colaborador con ese correo personal.', 'personalEmail');
    }
    const employee = await employeesRepository.update(id, editableFields(request));
    if (!employee) throw notFound(id);
    return toResponse(employee);
  },
};
