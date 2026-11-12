import { Timestamp } from 'firebase-admin/firestore';
import { newId, toIsoDateTime } from '../../shared/db/db-utils.js';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../shared/errors/http-errors.js';
import { toPageResponse, type PageResponse } from '../../shared/http/page.js';
import { employeeManagementRepository, type Employee } from './employee-management.repository.js';
import type { EmployeeListQuery, EmployeeRequest, EmployeeResponse } from './employee-management.schemas.js';

const toResponse = (employee: Employee): EmployeeResponse => ({
  id: employee.id,
  employeeNumber: employee.employeeNumber,
  firstName: employee.firstName,
  lastName: employee.lastName,
  birthDate: employee.birthDate.toDate().toISOString().slice(0, 10),
  residenceCountry: employee.residenceCountry,
  personalEmail: employee.personalEmail,
  hireDate: employee.hireDate.toDate().toISOString().slice(0, 10),
  category: employee.category,
  commitment: employee.commitment,
  workMode: employee.workMode,
  jobRole: employee.jobRole,
  clientName: employee.clientName,
  projectName: employee.projectName,
  contactName: employee.contactName,
  status: employee.status,
  createdAt: toIsoDateTime(employee.createdAt),
});

export const employeeManagementService = {
  async list(query: EmployeeListQuery): Promise<PageResponse<EmployeeResponse>> {
    const { items, total } = await employeeManagementRepository.findPage(query);
    return toPageResponse(items.map(toResponse), total, query);
  },

  async get(id: string): Promise<EmployeeResponse> {
    const employee = await employeeManagementRepository.findById(id);
    if (!employee) throw new NotFoundError(`No existe el colaborador ${id}.`);
    return toResponse(employee);
  },

  async create(request: EmployeeRequest): Promise<EmployeeResponse> {
    if (request.projectName && !request.clientName) {
      throw new BusinessRuleError('PROJECT_REQUIRES_CLIENT', 'Indica el cliente del proyecto.');
    }
    if (request.contactName && !request.projectName) {
      throw new BusinessRuleError('CONTACT_REQUIRES_PROJECT', 'Indica el proyecto del referente.');
    }

    const personalEmail = request.personalEmail.toLowerCase();
    if (await employeeManagementRepository.existsByEmail(personalEmail)) {
      throw new ConflictError('Ya existe un colaborador con ese correo electrónico.', 'personalEmail');
    }

    // Un identificador UUID evita reutilizar legajos, incluso entre altas simultáneas.
    const employeeNumber = `E-${newId()}`;
    const normalizedName = `${request.firstName} ${request.lastName}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const employee = await employeeManagementRepository.insert(employeeNumber, {
      employeeNumber,
      normalizedName,
      firstName: request.firstName,
      lastName: request.lastName,
      birthDate: Timestamp.fromDate(new Date(`${request.birthDate}T00:00:00.000Z`)),
      residenceCountry: request.residenceCountry,
      personalEmail,
      hireDate: Timestamp.fromDate(new Date(`${request.hireDate}T00:00:00.000Z`)),
      category: request.category,
      commitment: request.commitment,
      workMode: request.workMode,
      jobRole: request.jobRole,
      clientName: request.clientName,
      projectName: request.projectName,
      contactName: request.contactName,
      status: 'ACTIVE',
      deletedAt: null,
    });
    return toResponse(employee);
  },
};
