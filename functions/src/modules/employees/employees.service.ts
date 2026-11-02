import { Timestamp } from 'firebase-admin/firestore';
import { toIsoDate, toIsoDateTime, fromIsoDate } from '../../shared/firestore';
import { NotFoundError, ConflictError } from '../../shared/http/errors';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import {
  EmployeeRequest,
  EmployeeDto,
  EmployeeFilters,
  EmployeeStatus
} from './employees.models';
import {
  EmployeeRecord,
  employeesRepository
} from './employees.repository';

let LEGACY_LEGAJO_COUNTER = 2; // Simular generación incremental para example/demo

function generateLegajo(): string {
  LEGACY_LEGAJO_COUNTER++;
  return `E-${String(LEGACY_LEGAJO_COUNTER).padStart(4, '0')}`;
}

const toDto = (record: EmployeeRecord): EmployeeDto => ({
  id: record.id,
  employeeNumber: record.employeeNumber,
  firstName: record.firstName,
  lastName: record.lastName,
  documentType: record.documentType,
  documentNumber: record.documentNumber,
  birthDate: toIsoDate(record.birthDate) ?? '',
  email: record.email,
  phone: record.phone,
  hireDate: toIsoDate(record.hireDate) ?? '',
  departmentId: record.departmentId,
  positionId: record.positionId,
  managerId: record.managerId ?? null,
  status: record.status,
  terminationDate: record.terminationDate ? toIsoDate(record.terminationDate) : null,
  createdAt: toIsoDateTime(record.createdAt) ?? '',
  updatedAt: toIsoDateTime(record.updatedAt) ?? ''
});

async function find(id: string): Promise<EmployeeRecord> {
  const emp = await employeesRepository.findById(id);
  if (!emp) throw new NotFoundError(`No existe el colaborador de legajo ${id}.`);
  return emp;
}

async function assertDocumentAvailable(documentType: string, documentNumber: string): Promise<void> {
  const existing = await employeesRepository.findByDocument(documentType, documentNumber);
  if (existing) {
    throw new ConflictError(
      'Ya hay un colaborador registrado con el mismo tipo y número de documento.',
      'documentNumber'
    );
  }
}

export const employeesService = {
  async list(filters: EmployeeFilters, pageQuery: PageQuery): Promise<Page<EmployeeDto>> {
    const records = await employeesRepository.findFiltered(filters);
    return toPage(records, pageQuery, toDto);
  },

  async get(id: string): Promise<EmployeeDto> {
    return toDto(await find(id));
  },

  async create(request: EmployeeRequest): Promise<EmployeeDto> {
    await assertDocumentAvailable(request.documentType, request.documentNumber);
    // Generar legajo único
    const legajo = generateLegajo();
    const now = Timestamp.now();
    const doc: Omit<EmployeeRecord, 'id' | 'employeeNumber'> = {
      firstName: request.firstName,
      lastName: request.lastName,
      documentType: request.documentType,
      documentNumber: request.documentNumber,
      birthDate: fromIsoDate(request.birthDate),
      email: request.email,
      phone: request.phone,
      hireDate: fromIsoDate(request.hireDate),
      departmentId: request.departmentId,
      positionId: request.positionId,
      managerId: request.managerId,
      status: 'ACTIVE',
      terminationDate: null,
      deletedAt: null,
      createdAt: now,
      updatedAt: now
    };
    const record = await employeesRepository.create(legajo, doc);
    return toDto(record);
  },

  async update(id: string, request: Partial<EmployeeRequest>): Promise<EmployeeDto> {
    const exists = await find(id);
    // Solo puede editar los datos no únicos; si cambia documento, chequear duplicados
    if (
      request.documentType &&
      request.documentNumber &&
      (request.documentType !== exists.documentType || request.documentNumber !== exists.documentNumber)
    ) {
      await assertDocumentAvailable(request.documentType, request.documentNumber);
    }
    const now = Timestamp.now();
    const updateFields: any = { ...request, updatedAt: now };
    if (request.birthDate) updateFields.birthDate = fromIsoDate(request.birthDate);
    if (request.hireDate) updateFields.hireDate = fromIsoDate(request.hireDate);
    const updated = await employeesRepository.update(id, updateFields);
    if (!updated) throw new NotFoundError(`No existe el colaborador de legajo ${id}.`);
    return toDto(updated);
  },

  async delete(id: string): Promise<void> {
    // Lógica: baja lógica = set deletedAt (borrado lógico)
    const now = Timestamp.now();
    await find(id);
    await employeesRepository.softDelete(id, now);
  }
};
