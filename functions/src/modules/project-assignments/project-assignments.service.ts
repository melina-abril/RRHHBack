import { Timestamp } from 'firebase-admin/firestore';
import { fromIsoDate, toIsoDate, toIsoDateTime } from '../../shared/firestore';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../shared/http/errors';
import { Page, PageQuery, toPage } from '../../shared/http/page';
import type { AssignmentDoc, AssignmentDto, AssignmentEventDto, AssignmentRequest, AssignmentValues, AssignmentValuesDto, ClientCountryDto, ClientCountryRequest, ClientDto, ClientRequest, EmployeeAssignmentsDto, FinalizeAssignmentRequest, ProjectContactDto, ProjectContactRequest, ProjectDto, ProjectRequest } from './project-assignments.dto';
import { projectAssignmentsRepository as repository } from './project-assignments.repository';
import type { AssignmentRecord, ClientRecord, ContactRecord, CountryRecord, EmployeeRecord, EventRecord, ProjectRecord } from './project-assignments.repository';

const clientDto = (item: ClientRecord): ClientDto => ({ id: item.id, name: item.name, active: item.active, createdAt: toIsoDateTime(item.createdAt) ?? '' });
const countryDto = (item: CountryRecord): ClientCountryDto => ({ id: item.id, clientId: item.clientId, countryCode: item.countryCode, countryName: item.countryName, createdAt: toIsoDateTime(item.createdAt) ?? '' });
const projectDto = (item: ProjectRecord): ProjectDto => ({ id: item.id, clientId: item.clientId, name: item.name, clientCountryIds: item.clientCountryIds, active: item.active, createdAt: toIsoDateTime(item.createdAt) ?? '' });
const contactDto = (item: ContactRecord): ProjectContactDto => ({ id: item.id, projectId: item.projectId, name: item.name, email: item.email, active: item.active, createdAt: toIsoDateTime(item.createdAt) ?? '' });
const valuesDto = (item: AssignmentValues): AssignmentValuesDto => ({ employeeId: item.employeeId, clientId: item.clientId, clientName: item.clientName, projectId: item.projectId, projectName: item.projectName, clientCountryId: item.clientCountryId, countryName: item.countryName, contactId: item.contactId, contactName: item.contactName, role: item.role, startDate: toIsoDate(item.startDate) ?? '', endDate: toIsoDate(item.endDate), status: item.status });
const eventDto = (event: EventRecord): AssignmentEventDto => ({ id: event.id, assignmentId: event.assignmentId, action: event.action, actorUserId: event.actorUserId, occurredAt: toIsoDateTime(event.occurredAt) ?? '', beforeValues: event.beforeValues ? valuesDto(event.beforeValues) : null, afterValues: valuesDto(event.afterValues), createdAt: toIsoDateTime(event.createdAt) ?? '' });
const assignmentDto = (item: AssignmentRecord, history: EventRecord[]): AssignmentDto => ({ id: item.id, ...valuesDto(item), createdAt: toIsoDateTime(item.createdAt) ?? '', updatedAt: toIsoDateTime(item.updatedAt) ?? '', history: history.filter((event) => event.assignmentId === item.id).sort((a, b) => a.occurredAt.toMillis() - b.occurredAt.toMillis()).map(eventDto) });
const values = (item: AssignmentRecord): AssignmentValues => ({ employeeId: item.employeeId, clientId: item.clientId, clientName: item.clientName, projectId: item.projectId, projectName: item.projectName, clientCountryId: item.clientCountryId, countryName: item.countryName, contactId: item.contactId, contactName: item.contactName, role: item.role, startDate: item.startDate, endDate: item.endDate, status: item.status });

async function employee(id: string): Promise<EmployeeRecord> {
  const result = await repository.employee(id);
  if (!result) throw new NotFoundError('No se encontró el colaborador solicitado.');
  return result;
}
async function assignment(employeeId: string, id: string): Promise<AssignmentRecord> {
  const result = await repository.assignment(id);
  if (!result || result.employeeId !== employeeId) throw new NotFoundError('No se encontró la asignación solicitada.');
  return result;
}
async function validateSelection(request: AssignmentRequest, existing: AssignmentRecord | null): Promise<AssignmentValues> {
  const client = await repository.client(request.clientId);
  const country = await repository.country(request.clientCountryId);
  const project = await repository.project(request.projectId);
  const contact = request.contactId ? await repository.contact(request.contactId) : null;
  if (!client || !country || !project || (request.contactId && !contact)) throw new NotFoundError('No se encontró una de las opciones seleccionadas.');
  if (country.clientId !== client.id || project.clientId !== client.id || !project.clientCountryIds.includes(country.id) || (contact && contact.projectId !== project.id)) {
    throw new BusinessRuleError('INCOMPATIBLE_SELECTION', 'El cliente, país, proyecto o referente no corresponden entre sí.');
  }
  if (!existing && (!client.active || !project.active || (contact && !contact.active))) throw new BusinessRuleError('INACTIVE_SELECTION', 'Selecciona un cliente, proyecto y referente activos.');
  if (existing && (existing.clientId !== client.id || existing.projectId !== project.id)) throw new BusinessRuleError('ASSIGNMENT_PROJECT_IMMUTABLE', 'No puedes trasladar una asignación a otro cliente o proyecto.');
  if (request.endDate && request.endDate < request.startDate) throw new BusinessRuleError('INVALID_ASSIGNMENT_DATES', 'La fecha de finalización no puede ser anterior al inicio.');
  return { employeeId: existing?.employeeId ?? '', clientId: client.id, clientName: existing?.clientName ?? client.name, projectId: project.id, projectName: existing?.projectName ?? project.name, clientCountryId: country.id, countryName: existing?.clientCountryId === country.id ? existing.countryName : country.countryName, contactId: contact?.id ?? null, contactName: contact ? (existing?.contactId === contact.id ? existing.contactName : contact.name) : null, role: request.role, startDate: fromIsoDate(request.startDate), endDate: request.endDate ? fromIsoDate(request.endDate) : null, status: request.endDate ? 'ENDED' : 'ACTIVE' };
}
async function assertNoDuplicate(employeeId: string, projectId: string, countryId: string, exceptId: string | null): Promise<void> {
  const records = await repository.listAssignments(employeeId);
  if (records.some((item) => item.id !== exceptId && item.status === 'ACTIVE' && item.projectId === projectId && item.clientCountryId === countryId)) {
    throw new ConflictError('Ya existe una asignación vigente para este proyecto y país.', 'projectId');
  }
}

export const projectAssignmentsService = {
  async listClients(page: PageQuery): Promise<Page<ClientDto>> { return toPage(await repository.listClients(), page, clientDto); },
  async createClient(request: ClientRequest): Promise<ClientDto> { return clientDto(await repository.createClient({ ...request, createdAt: Timestamp.now() })); },
  async listClientCountries(clientId: string, page: PageQuery): Promise<Page<ClientCountryDto>> {
    if (!await repository.client(clientId)) throw new NotFoundError('No se encontró el cliente solicitado.');
    return toPage((await repository.listCountries(clientId)).sort((a, b) => a.countryName.localeCompare(b.countryName)), page, countryDto);
  },
  async addClientCountry(clientId: string, request: ClientCountryRequest): Promise<ClientCountryDto> {
    if (!await repository.client(clientId)) throw new NotFoundError('No se encontró el cliente solicitado.');
    if ((await repository.listCountries(clientId)).some((item) => item.countryCode === request.countryCode)) throw new ConflictError('Este país ya está vinculado al cliente.', 'countryCode');
    return countryDto(await repository.createCountry({ clientId, ...request, createdAt: Timestamp.now() }));
  },
  async listProjects(clientId: string | null, countryId: string | null, page: PageQuery): Promise<Page<ProjectDto>> {
    const projects = (await repository.listProjects()).filter((item) => (!clientId || item.clientId === clientId) && (!countryId || item.clientCountryIds.includes(countryId)));
    return toPage(projects, page, projectDto);
  },
  async createProject(request: ProjectRequest): Promise<ProjectDto> {
    const client = await repository.client(request.clientId);
    if (!client) throw new NotFoundError('No se encontró el cliente solicitado.');
    if (!client.active) throw new BusinessRuleError('INACTIVE_CLIENT', 'El cliente no está activo.');
    const available = await repository.listCountries(client.id);
    if (request.clientCountryIds.some((id) => !available.some((country) => country.id === id))) throw new BusinessRuleError('INCOMPATIBLE_SELECTION', 'Todos los países deben pertenecer al cliente.');
    return projectDto(await repository.createProject({ ...request, createdAt: Timestamp.now() }));
  },
  async listProjectContacts(projectId: string, page: PageQuery): Promise<Page<ProjectContactDto>> {
    if (!await repository.project(projectId)) throw new NotFoundError('No se encontró el proyecto solicitado.');
    return toPage((await repository.listContacts(projectId)).sort((a, b) => a.name.localeCompare(b.name)), page, contactDto);
  },
  async createProjectContact(projectId: string, request: ProjectContactRequest): Promise<ProjectContactDto> {
    if (!await repository.project(projectId)) throw new NotFoundError('No se encontró el proyecto solicitado.');
    return contactDto(await repository.createContact({ projectId, ...request, createdAt: Timestamp.now() }));
  },
  async listEmployeeAssignments(employeeId: string): Promise<EmployeeAssignmentsDto> {
    await employee(employeeId);
    const records = await repository.listAssignments(employeeId);
    const history = await repository.listEvents(records.map((item) => item.id));
    const mapped = records.map((item) => assignmentDto(item, history)).sort((a, b) => b.startDate.localeCompare(a.startDate));
    return { active: mapped.filter((item) => item.status === 'ACTIVE'), ended: mapped.filter((item) => item.status === 'ENDED') };
  },
  async createEmployeeAssignment(employeeId: string, request: AssignmentRequest, actorUserId: string): Promise<AssignmentDto> {
    const person = await employee(employeeId);
    if (person.status === 'TERMINATED') throw new BusinessRuleError('EMPLOYEE_TERMINATED', 'No puedes asignar un proyecto a un colaborador inactivo.');
    if (request.startDate < (toIsoDate(person.hireDate) ?? '')) throw new BusinessRuleError('ASSIGNMENT_BEFORE_HIRE', 'La asignación no puede comenzar antes del ingreso.');
    const selected = await validateSelection(request, null);
    if (selected.status !== 'ACTIVE') throw new BusinessRuleError('NEW_ASSIGNMENT_ENDED', 'Una nueva asignación debe comenzar vigente.');
    await assertNoDuplicate(employeeId, selected.projectId, selected.clientCountryId, null);
    const now = Timestamp.now();
    const saved = await repository.saveAssignment(null, { ...selected, employeeId, createdAt: now, updatedAt: now }, null, 'CREATED', actorUserId);
    return assignmentDto(saved, await repository.listEvents([saved.id]));
  },
  async updateEmployeeAssignment(employeeId: string, id: string, request: AssignmentRequest, actorUserId: string): Promise<AssignmentDto> {
    const person = await employee(employeeId);
    const current = await assignment(employeeId, id);
    if (request.startDate < (toIsoDate(person.hireDate) ?? '')) throw new BusinessRuleError('ASSIGNMENT_BEFORE_HIRE', 'La asignación no puede comenzar antes del ingreso.');
    if (current.status === 'ENDED' && !request.endDate) throw new BusinessRuleError('ASSIGNMENT_ALREADY_ENDED', 'Una asignación terminada no puede volver a estar vigente.');
    const selected = await validateSelection(request, current);
    if (selected.status === 'ACTIVE') await assertNoDuplicate(employeeId, selected.projectId, selected.clientCountryId, id);
    const saved = await repository.saveAssignment(id, { ...selected, employeeId, createdAt: current.createdAt, updatedAt: Timestamp.now() }, values(current), 'UPDATED', actorUserId);
    return assignmentDto(saved, await repository.listEvents([id]));
  },
  async finalizeEmployeeAssignment(employeeId: string, id: string, request: FinalizeAssignmentRequest, actorUserId: string): Promise<AssignmentDto> {
    await employee(employeeId);
    const current = await assignment(employeeId, id);
    if (current.status !== 'ACTIVE') throw new BusinessRuleError('ASSIGNMENT_ALREADY_ENDED', 'Esta asignación ya fue finalizada.');
    if (request.endDate < (toIsoDate(current.startDate) ?? '')) throw new BusinessRuleError('INVALID_ASSIGNMENT_DATES', 'La fecha de finalización no puede ser anterior al inicio.');
    const saved: AssignmentDoc = { ...values(current), endDate: fromIsoDate(request.endDate), status: 'ENDED', createdAt: current.createdAt, updatedAt: Timestamp.now() };
    const result = await repository.saveAssignment(id, saved, values(current), 'ENDED', actorUserId);
    return assignmentDto(result, await repository.listEvents([id]));
  },
};
