import { toIsoDate, toIsoDateTime } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { employees2Repository, type Employee } from './employees-2.repository.js';
import type { EmployeeResponse, UpdateEmployeeRequest } from './employees-2.schemas.js';

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

export const employees2Service = {
  async updateEmployee(id: string, request: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    const employee = await employees2Repository.update(id, request);
    if (!employee) throw new NotFoundError(`No existe el colaborador ${id}.`);
    return toResponse(employee);
  },
};
