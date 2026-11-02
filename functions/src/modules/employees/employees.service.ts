import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDate, toIsoDateTime, fromIsoDate } from '../../shared/firestore';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../shared/http/errors';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import { EmployeeDto, EmployeeFilters, EmployeeRequest, EmployeeStatus, EMPLOYEE_STATUSES } from './employees.dto';
import { EmployeeRecord, employeesRepository } from './employees.repository';

/** Devuelve el nombre completo a partir del registro */
const getFullName = (record: EmployeeRecord): string => `${record.firstName} ${record.lastName}`;

const toDto = (record: EmployeeRecord): EmployeeDto => ({
  id: record.id,
  employeeNumber: record.employeeNumber,
  firstName: record.firstName,
  lastName: record.lastName,
  fullName: getFullName(record),
  documentType: record.documentType,
  documentNumber: record.documentNumber,
  birthDate: toIsoDate(record.birthDate),
  email: record.email,
  phone: record.phone,
  hireDate: toIsoDate(record.hireDate),
  terminationDate: toIsoDate(record.terminationDate),
  departmentId: record.departmentId,
  positionId: record.positionId,
  managerId: record.managerId ?? null,
  status: record.status,
  createdAt: toIsoDateTime(record.createdAt),
  updatedAt: toIsoDateTime(record.updatedAt)
});

async function find(id: string): Promise<EmployeeRecord> {
  const employee = await employeesRepository.findById(id);
  if (!employee) throw new NotFoundError('No existe el colaborador.');
  return employee;
}

export const employeesService = {
  async list(filters: EmployeeFilters, pageQuery: PageQuery): Promise<Page<EmployeeDto>> {
    let data = await employeesRepository.findAll();
    // Filtro por texto (nombre, legajo)
    const term = filters.search?.toLowerCase() ?? '';
    if (term) {
      data = data.filter(
        (e) =>
          e.employeeNumber.toLowerCase().includes(term) ||
          e.firstName.toLowerCase().includes(term) ||
          e.lastName.toLowerCase().includes(term)
      );
    }
    if (filters.status && EMPLOYEE_STATUSES.includes(filters.status)) {
      data = data.filter((e) => e.status === filters.status);
    }
    if (filters.departmentId) {
      data = data.filter((e) => e.departmentId === filters.departmentId);
    }
    if (filters.positionId) {
      data = data.filter((e) => e.positionId === filters.positionId);
    }
    return toPage(data, pageQuery, toDto);
  },

  async get(id: string): Promise<EmployeeDto> {
    return toDto(await find(id));
  },

  /**
   * Alta de colaborador (excluye duplicados por legajo y documento)
   */
  async create(request: EmployeeRequest): Promise<EmployeeDto> {
    // Validar documento duplicado
    const all = await employeesRepository.findAll();
    if (all.some(e => e.documentType === request.documentType && e.documentNumber === request.documentNumber)) {
      throw new ConflictError('Ya existe un colaborador con ese tipo y número de documento.', 'documentNumber');
    }
    // Email duplicado
    if (all.some(e => e.email === request.email)) {
      throw new ConflictError('Ya existe un colaborador con ese correo.', 'email');
    }
    // Alta (Firestore asigna legajo correlativo automáticamente)
    const employee = await employeesRepository.create({
      ...request,
      birthDate: fromIsoDate(request.birthDate),
      hireDate: fromIsoDate(request.hireDate),
      terminationDate: null,
      status: 'ACTIVE',
      managerId: request.managerId ?? null,
      departmentId: request.departmentId,
      positionId: request.positionId
    });
    return toDto(employee);
  },

  async update(id: string, request: EmployeeRequest): Promise<EmployeeDto> {
    const employee = await find(id);
    // No permite cambiar legajo ni email a uno usado
    const all = await employeesRepository.findAll();
    if (all.some(e => e.id !== id && e.documentType === request.documentType && e.documentNumber === request.documentNumber)) {
      throw new ConflictError('Ya existe un colaborador con ese tipo y número de documento.', 'documentNumber');
    }
    if (all.some(e => e.id !== id && e.email === request.email)) {
      throw new ConflictError('Ya existe un colaborador con ese correo.', 'email');
    }
    const updated = await employeesRepository.update(id, {
      ...employee,
      ...request,
      birthDate: fromIsoDate(request.birthDate),
      hireDate: fromIsoDate(request.hireDate),
      updatedAt: Timestamp.now(),
      managerId: request.managerId ?? null,
      departmentId: request.departmentId,
      positionId: request.positionId
    });
    return toDto(updated);
  },

  async terminate(id: string): Promise<void> {
    const employee = await find(id);
    if (!employee.terminationDate) {
      await employeesRepository.softDelete(id, new Date());
    } // Si ya estaba egresado o no, deja como está
  },

  async rejoin(id: string, newHireDate: string): Promise<EmployeeDto> {
    const employee = await find(id);
    if (employee.status !== 'TERMINATED') {
      throw new BusinessRuleError('EMPLOYEE_ACTIVE', 'El colaborador ya está activo.');
    }
    const updated = await employeesRepository.rejoin(id, fromIsoDate(newHireDate));
    return toDto(updated);
  }
};
