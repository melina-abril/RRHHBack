import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDate, toIsoDateTime } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { employeesRepository, type Employee } from './employees.repository.js';
import type { EmployeeCreateRequest, EmployeeListQuery, EmployeeResponse, EmployeeUpdateRequest } from './employees.schemas.js';

const dateTimestamp = (date: string): Timestamp => Timestamp.fromDate(new Date(`${date}T00:00:00.000Z`));

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

  async create(request: EmployeeCreateRequest, userId: string): Promise<EmployeeResponse> {
    const employee = await employeesRepository.insert({
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
      status: 'ACTIVE',
      initialClient: request.initialClient || null,
      initialProject: request.initialProject || null,
      initialManager: request.initialManager || null,
      createdById: userId,
      deletedAt: null,
    });
    return toResponse(employee);
  },

  async update(id: string, request: EmployeeUpdateRequest): Promise<EmployeeResponse> {
    const employee = await employeesRepository.update(id, {
      ...request,
      birthDate: dateTimestamp(request.birthDate),
    });
    if (!employee) throw notFound(id);
    return toResponse(employee);
  },
};
