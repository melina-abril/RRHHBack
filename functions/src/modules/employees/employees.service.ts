import { toIsoDate, toIsoDateTime, fromIsoDate } from '../../shared/firestore';
import { NotFoundError, ConflictError, BusinessRuleError } from '../../shared/http/errors';
import { PageQuery, toPage, Page } from '../../shared/http/page';
import { EmployeeDoc, EmployeeDto, EmployeeRequest, EmployeesFilters, MovementDoc, MovementDto } from './employees.dto';
import { employeesRepository } from './employees.repository';
import { SessionUser } from '../../shared/auth/session-user';

const toEmployeeDto = (record: EmployeeDoc & { id: string }): EmployeeDto => ({
  id: record.id,
  employeeNumber: record.employeeNumber,
  firstName: record.firstName,
  lastName: record.lastName,
  documentType: record.documentType,
  documentNumber: record.documentNumber,
  birthDate: toIsoDate(record.birthDate),
  email: record.email,
  phone: record.phone,
  hireDate: toIsoDate(record.hireDate),
  terminationDate: record.terminationDate ? toIsoDate(record.terminationDate) : null,
  departmentId: record.departmentId,
  positionId: record.positionId,
  managerId: record.managerId ?? null,
  status: record.status,
  createdAt: toIsoDateTime(record.createdAt),
  updatedAt: toIsoDateTime(record.updatedAt),
});

const toMovementDto = (record: MovementDoc & { id: string }): MovementDto => ({
  id: record.id,
  type: record.type,
  date: toIsoDate(record.date),
  description: record.description,
  changedBy: record.changedBy,
  details: record.details ?? null,
  createdAt: toIsoDateTime(record.createdAt),
});

function filterEmployees(list: (EmployeeDoc & { id: string })[], filters: EmployeesFilters): (EmployeeDoc & { id: string })[] {
  return list.filter(emp => {
    const term = filters.search?.toLowerCase() || '';
    if (term && !(emp.firstName.toLowerCase().includes(term) || emp.lastName.toLowerCase().includes(term) || emp.employeeNumber.toLowerCase().includes(term))) {
      return false;
    }
    if (filters.status && emp.status !== filters.status) return false;
    if (filters.departmentId && emp.departmentId !== filters.departmentId) return false;
    if (filters.positionId && emp.positionId !== filters.positionId) return false;
    return true;
  });
}

export const employeesService = {
  async list(filters: EmployeesFilters, pageQuery: PageQuery): Promise<Page<EmployeeDto>> {
    const employees = await employeesRepository.findAll();
    const filtered = filterEmployees(employees, filters);
    return toPage(filtered, pageQuery, toEmployeeDto);
  },

  async get(id: string): Promise<EmployeeDto> {
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('No existe el colaborador solicitado.');
    return toEmployeeDto(emp);
  },

  async create(request: EmployeeRequest, currentUser: SessionUser): Promise<EmployeeDto> {
    // Validar documento único
    const docDup = await employeesRepository.findByDocument(request.documentType, request.documentNumber);
    if (docDup) throw new ConflictError('Ya existe un colaborador con ese documento.', 'documentNumber');
    // Alta correlativa
    const emp = await employeesRepository.create(request);
    await employeesRepository.addMovement(emp.id, {
      type: 'ONBOARDING',
      date: fromIsoDate(request.hireDate),
      description: 'Alta de colaborador',
      changedBy: currentUser.id,
      details: {
        positionId: request.positionId,
        departmentId: request.departmentId,
      }
    });
    return toEmployeeDto(emp);
  },

  async update(id: string, request: EmployeeRequest, currentUser: SessionUser): Promise<EmployeeDto> {
    // Debe existir, estar activo y no estar eliminado
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('No existe el colaborador.');
    if (emp.status !== 'ACTIVE') throw new BusinessRuleError('ONLY_ACTIVE_UPDATABLE', 'Solo se pueden editar colaboradores activos.');
    // Validar cambio de documento si corresponde
    if (
      (emp.documentType !== request.documentType || emp.documentNumber !== request.documentNumber)
    ) {
      const exists = await employeesRepository.findByDocument(request.documentType, request.documentNumber);
      if (exists && exists.id !== id) {
        throw new ConflictError('Ya existe un colaborador con ese documento.', 'documentNumber');
      }
    }
    const updated = await employeesRepository.update(id, {
      ...request,
      birthDate: fromIsoDate(request.birthDate),
      hireDate: fromIsoDate(request.hireDate),
    });
    if (!updated) throw new NotFoundError('No se pudo actualizar el colaborador.');
    await employeesRepository.addMovement(updated.id, {
      type: 'PROMOTION',
      date: fromIsoDate(request.hireDate),
      description: 'Actualización de datos personales y laborales.',
      changedBy: currentUser.id,
      details: {
        positionId: request.positionId,
        departmentId: request.departmentId,
      }
    });
    return toEmployeeDto(updated);
  },

  async leave(id: string, currentUser: SessionUser): Promise<EmployeeDto> {
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('No existe el colaborador.');
    if (emp.status !== 'ACTIVE') throw new BusinessRuleError('ALREADY_LEFT', 'El colaborador ya está inactivo.');
    const today = new Date();
    const isoToday = today.toISOString().slice(0, 10);
    const updated = await employeesRepository.setStatus(id, 'TERMINATED', isoToday);
    if (!updated) throw new NotFoundError('No se pudo registrar el egreso.');
    await employeesRepository.addMovement(updated.id, {
      type: 'TERMINATION',
      date: fromIsoDate(isoToday),
      description: 'Egreso/terminación de relación laboral.',
      changedBy: currentUser.id,
      details: null,
    });
    return toEmployeeDto(updated);
  },

  async rejoin(id: string, hireDate: string, currentUser: SessionUser): Promise<EmployeeDto> {
    const emp = await employeesRepository.findById(id);
    if (!emp) throw new NotFoundError('No existe el colaborador.');
    if (emp.status === 'ACTIVE') throw new BusinessRuleError('ALREADY_ACTIVE', 'El colaborador ya está activo.');
    // Vuelve a activo, borra fecha de egreso y actualiza la contratación
    const updated = await employeesRepository.setStatus(id, 'ACTIVE', null);
    if (!updated) throw new NotFoundError('No se pudo registrar el reingreso.');
    await employeesRepository.addMovement(updated.id, {
      type: 'REJOIN',
      date: fromIsoDate(hireDate),
      description: 'Reingreso de colaborador.',
      changedBy: currentUser.id,
      details: null
    });
    return toEmployeeDto(updated);
  },

  async getMovements(employeeId: string): Promise<MovementDto[]> {
    const list = await employeesRepository.getMovements(employeeId);
    return list.map(toMovementDto);
  },
};
