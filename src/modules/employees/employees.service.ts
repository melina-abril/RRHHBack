import { toIsoDate } from '../../shared/db/db-utils.js';
import { NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { employeesRepository, type Employee } from './employees.repository.js';
import type { EmployeeListQuery, EmployeeResponse } from './employees.schemas.js';

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

  /** Consulta pública para los casos de uso de ficha y alta; ningún otro módulo accede al repositorio. */
  async get(id: string): Promise<EmployeeResponse> {
    const employee = await employeesRepository.findById(id);
    if (!employee) throw new NotFoundError(`No existe el colaborador ${id}.`);
    return toResponse(employee);
  },
};
