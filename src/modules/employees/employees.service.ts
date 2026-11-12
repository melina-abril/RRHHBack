import { toIsoDate, toIsoDateTime, toTimestamp } from '../../shared/db/db-utils.js';
import { ConflictError, NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { employeesRepository, type Employee } from './employees.repository.js';
import type { EmployeeListQuery, EmployeeRequest, EmployeeResponse } from './employees.schemas.js';

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
  createdAt: toIsoDateTime(employee.createdAt),
});

export const employeesService = {
  async list(query: EmployeeListQuery): Promise<PageResponse<EmployeeResponse>> {
    const { items, total } = await employeesRepository.findPage(query);
    return toPageResponse(items.map(toResponse), total, query);
  },

  async get(id: string): Promise<EmployeeResponse> {
    const employee = await employeesRepository.findById(id);
    if (!employee) throw new NotFoundError(`No existe el colaborador ${id}.`);
    return toResponse(employee);
  },

  async create(request: EmployeeRequest, userId: string): Promise<EmployeeResponse> {
    const email = request.personalEmail.toLowerCase();
    if (await employeesRepository.existsByPersonalEmail(email)) {
      throw new ConflictError('Ya existe un colaborador con ese correo personal.', 'personalEmail');
    }
    const employee = await employeesRepository.insert({
      firstName: request.firstName,
      lastName: request.lastName,
      birthDate: toTimestamp(request.birthDate),
      residenceCountry: request.residenceCountry,
      personalEmail: email,
      startDate: toTimestamp(request.startDate),
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
};
