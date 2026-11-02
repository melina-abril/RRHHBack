import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDate, toIsoDateTime, fromIsoDate } from '../../shared/firestore';
import { NotFoundError, ConflictError, BusinessRuleError } from '../../shared/http/errors';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import {
  EmployeeDto,
  EmployeeFilters,
  EmployeeRequest,
  EmployeeStatus,
  EMPLOYEE_STATUSES,
  EmployeeReinstateRequest,
} from './employees.dto';
import { employeesRepository, EmployeeRecord } from './employees.repository';

/**
 * Casos de uso del módulo empleados: reglas de negocio y DTOs.
 */
function toDto(emp: EmployeeRecord): EmployeeDto {
  return {
    id: emp.id,
    employeeNumber: emp.employeeNumber,
    firstName: emp.firstName,
    lastName: emp.lastName,
    documentType: emp.documentType,
    documentNumber: emp.documentNumber,
    birthDate: toIsoDate(emp.birthDate) ?? '',
    email: emp.email,
    phone: emp.phone,
    hireDate: toIsoDate(emp.hireDate) ?? '',
    terminationDate: emp.terminationDate ? toIsoDate(emp.terminationDate) : null,
    departmentId: emp.departmentId,
    positionId: emp.positionId,
    managerId: emp.managerId,
    status: emp.status,
    createdAt: toIsoDateTime(emp.createdAt) ?? '',
    updatedAt: toIsoDateTime(emp.updatedAt) ?? '',
  };
}

async function find(id: string): Promise<EmployeeRecord> {
  const emp = await employeesRepository.findById(id);
  if (!emp) throw new NotFoundError('No existe el colaborador con ese legajo.');
  return emp;
}

function filterEmployee(emp: EmployeeRecord, filters: EmployeeFilters): boolean {
  // Filtros: nombre/legajo (search), estado, depto, posición, cliente, proyecto (los dos últimos son opcionales)
  const term = (filters.search ?? '').toLowerCase();
  const matchesSearch =
    !term ||
    emp.firstName.toLowerCase().includes(term) ||
    emp.lastName.toLowerCase().includes(term) ||
    emp.employeeNumber.toLowerCase().includes(term);
  const matchesStatus = !filters.status || emp.status === filters.status;
  const matchesDept = !filters.departmentId || emp.departmentId === filters.departmentId;
  const matchesPosition = !filters.positionId || emp.positionId === filters.positionId;
  // Nota: Filtros de cliente/proyecto requieren joins, por ahora se ignoran en el backend.
  return matchesSearch && matchesStatus && matchesDept && matchesPosition;
}

export const employeesService = {
  /** Listado paginado de colaboradores con filtros */
  async list(filters: EmployeeFilters, pageQuery: PageQuery): Promise<Page<EmployeeDto>> {
    const all = await employeesRepository.findAll();
    const filtered = all.filter((emp) => filterEmployee(emp, filters));
    return toPage(filtered, pageQuery, toDto);
  },

  /** Consulta la ficha individual por id */
  async get(id: string): Promise<EmployeeDto> {
    return toDto(await find(id));
  },

  /** Alta de colaborador (legajo nuevo y status ACTIVE) */
  async create(request: EmployeeRequest): Promise<EmployeeDto> {
    // Detectar duplicados: documento + tipo únicos
    const all = await employeesRepository.findAll();
    const found = all.find(
      (e) =>
        e.documentType.trim().toUpperCase() === request.documentType.trim().toUpperCase() &&
        e.documentNumber.trim() === request.documentNumber.trim(),
    );
    if (found) {
      throw new ConflictError('Ya existe un colaborador con este tipo y número de documento.', 'documentNumber');
    }
    const now = Timestamp.now();
    const { id, ...docBase } = request;
    const record = await employeesRepository.create({
      ...request,
      hireDate: fromIsoDate(request.hireDate),
      birthDate: fromIsoDate(request.birthDate),
      status: 'ACTIVE',
      terminationDate: null,
      createdAt: now,
      updatedAt: now,
    });
    return toDto(record);
  },

  /** Edición de datos personales/laborales (no cambia legajo, ni borra historial) */
  async update(id: string, request: EmployeeRequest): Promise<EmployeeDto> {
    const emp = await find(id);
    // No se puede cambiar el legajo ni el documento de identidad
    const isDocChange =
      emp.documentType.trim().toUpperCase() !== request.documentType.trim().toUpperCase() ||
      emp.documentNumber.trim() !== request.documentNumber.trim();
    if (isDocChange) {
      // Chequear que no duplique a otro existente
      const all = await employeesRepository.findAll();
      if (
        all.some(
          (e) =>
            e.id !== id &&
            e.documentType.trim().toUpperCase() === request.documentType.trim().toUpperCase() &&
            e.documentNumber.trim() === request.documentNumber.trim(),
        )
      ) {
        throw new ConflictError('Ya existe un colaborador con este tipo y número de documento.', 'documentNumber');
      }
    }
    const updated = await employeesRepository.update(id, {
      ...emp,
      ...request,
      hireDate: fromIsoDate(request.hireDate),
      birthDate: fromIsoDate(request.birthDate),
      updatedAt: Timestamp.now(),
    });
    if (!updated) throw new NotFoundError('No existe el colaborador que intentas editar.');
    return toDto(updated);
  },

  /** Egreso: marca como terminado, conserva historial */
  async terminate(id: string, terminationDate: string): Promise<EmployeeDto> {
    const emp = await find(id);
    if (emp.status === 'TERMINATED') {
      throw new BusinessRuleError('ALREADY_TERMINATED', 'El colaborador ya se encuentra inactivo.');
    }
    const updated = await employeesRepository.terminate(id, fromIsoDate(terminationDate), Timestamp.now());
    if (!updated) throw new NotFoundError('No se ha encontrado el colaborador para egreso.');
    return toDto(updated);
  },

  /** Reingreso: pone hireDate nueva, borra terminationDate, status ACTIVE */
  async reinstate(id: string, request: EmployeeReinstateRequest): Promise<EmployeeDto> {
    const emp = await find(id);
    if (emp.status === 'ACTIVE') {
      throw new BusinessRuleError('ALREADY_ACTIVE', 'El colaborador ya está activo.');
    }
    const updated = await employeesRepository.reinstate(id, {
      hireDate: fromIsoDate(request.hireDate),
      departmentId: request.departmentId,
      positionId: request.positionId,
      managerId: request.managerId,
      updatedAt: Timestamp.now(),
    });
    if (!updated) throw new NotFoundError('No se ha encontrado el colaborador para reingreso.');
    return toDto(updated);
  },
};
