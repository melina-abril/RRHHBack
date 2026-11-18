import { toIsoDate, toTimestamp } from '../../shared/db/db-utils.js';
import { ConflictError, NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { employeesRepository, type Employee } from './employees.repository.js';
import type { EmployeeCreateRequest, EmployeeListQuery, EmployeeResponse } from './employees.schemas.js';

const toResponse = (employee: Employee): EmployeeResponse => ({
  id: employee.id,
  employeeNumber: employee.employeeNumber,
  firstName: employee.firstName,
  lastName: employee.lastName,
  fullName: employee.fullName,
  email: employee.email,
  category: employee.category,
  country: employee.country,
  position: employee.position,
  clientNames: employee.clientNames,
  projectNames: employee.projectNames,
  status: employee.status,
  hireDate: toIsoDate(employee.hireDate),
  terminationDate: employee.terminationDate === null ? null : toIsoDate(employee.terminationDate),
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

  async create(request: EmployeeCreateRequest, userId: string): Promise<EmployeeResponse> {
    const email = request.email.trim().toLowerCase();
    if (await employeesRepository.existsByEmail(email)) {
      throw new ConflictError('Ya existe un colaborador con ese correo.', 'email');
    }
    const fullName = `${request.firstName} ${request.lastName}`;
    const employee = await employeesRepository.insert({
      firstName: request.firstName,
      lastName: request.lastName,
      fullName,
      normalizedName: fullName.toLocaleLowerCase('es'),
      email,
      category: request.category,
      country: request.country,
      position: request.position,
      clientNames: request.clientNames,
      projectNames: request.projectNames,
      status: 'ACTIVE',
      hireDate: toTimestamp(request.hireDate),
      terminationDate: null,
      createdById: userId,
      deletedAt: null,
    });
    return toResponse(employee);
  },
};
