import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { currentUser } from '../../shared/auth/session-user';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import type { AssignmentRequest, ClientCountryRequest, ClientRequest, FinalizeAssignmentRequest, ProjectContactRequest, ProjectRequest } from './project-assignments.dto';
import { projectAssignmentsService as service } from './project-assignments.service';

export const projectAssignmentsRouter = Router();
projectAssignmentsRouter.use(requireRole('ADMIN'));

function readClient(req: Request): ClientRequest {
  const body = new BodyReader(req.body);
  const request = { name: body.text('name', { max: 120 }), active: body.boolean('active') };
  body.done();
  return request;
}
function readCountry(req: Request): ClientCountryRequest {
  const body = new BodyReader(req.body);
  const request = { countryCode: body.text('countryCode', { max: 3 }).toUpperCase(), countryName: body.text('countryName', { max: 100 }) };
  body.done();
  return request;
}
function readProject(req: Request): ProjectRequest {
  const body = new BodyReader(req.body);
  const raw: unknown = (req.body as Record<string, unknown> | null)?.['clientCountryIds'];
  const clientCountryIds = Array.isArray(raw) && raw.every((value: unknown) => typeof value === 'string' && value.trim().length > 0) ? (raw as string[]) : [];
  if (!clientCountryIds.length || new Set(clientCountryIds).size !== clientCountryIds.length) body.fail('clientCountryIds', 'Selecciona países válidos sin duplicados.');
  const request = { clientId: body.text('clientId'), name: body.text('name', { max: 120 }), clientCountryIds, active: body.boolean('active') };
  body.done();
  return request;
}
function readContact(req: Request): ProjectContactRequest {
  const body = new BodyReader(req.body);
  const request = { name: body.text('name', { max: 120 }), email: body.email('email'), active: body.boolean('active') };
  body.done();
  return request;
}
function readAssignment(req: Request): AssignmentRequest {
  const body = new BodyReader(req.body);
  const request = { clientId: body.text('clientId'), clientCountryId: body.text('clientCountryId'), projectId: body.text('projectId'), contactId: body.optionalText('contactId'), role: body.text('role', { max: 120 }), startDate: body.date('startDate'), endDate: body.optionalDate('endDate') };
  body.done();
  return request;
}
function readFinalize(req: Request): FinalizeAssignmentRequest {
  const body = new BodyReader(req.body);
  const request = { endDate: body.date('endDate') };
  body.done();
  return request;
}

projectAssignmentsRouter.get('/clients', async (req, res) => {
  res.json(await service.listClients(parsePageQuery(req.query)));
});
projectAssignmentsRouter.post('/clients', async (req, res) => {
  res.status(201).json(await service.createClient(readClient(req)));
});
projectAssignmentsRouter.get('/clients/:clientId/countries', async (req: Request<{ clientId: string }>, res) => {
  res.json(await service.listClientCountries(req.params.clientId, parsePageQuery(req.query)));
});
projectAssignmentsRouter.post('/clients/:clientId/countries', async (req: Request<{ clientId: string }>, res) => {
  res.status(201).json(await service.addClientCountry(req.params.clientId, readCountry(req)));
});
projectAssignmentsRouter.get('/projects', async (req, res) => {
  res.json(await service.listProjects(queryText(req.query, 'clientId'), queryText(req.query, 'clientCountryId'), parsePageQuery(req.query)));
});
projectAssignmentsRouter.post('/projects', async (req, res) => {
  res.status(201).json(await service.createProject(readProject(req)));
});
projectAssignmentsRouter.get('/projects/:projectId/contacts', async (req: Request<{ projectId: string }>, res) => {
  res.json(await service.listProjectContacts(req.params.projectId, parsePageQuery(req.query)));
});
projectAssignmentsRouter.post('/projects/:projectId/contacts', async (req: Request<{ projectId: string }>, res) => {
  res.status(201).json(await service.createProjectContact(req.params.projectId, readContact(req)));
});
projectAssignmentsRouter.get('/employees/:employeeId', async (req: Request<{ employeeId: string }>, res) => {
  res.json(await service.listEmployeeAssignments(req.params.employeeId));
});
projectAssignmentsRouter.post('/employees/:employeeId', async (req: Request<{ employeeId: string }>, res) => {
  res.status(201).json(await service.createEmployeeAssignment(req.params.employeeId, readAssignment(req), currentUser(req).id));
});
projectAssignmentsRouter.put('/employees/:employeeId/:id', async (req: Request<{ employeeId: string; id: string }>, res) => {
  res.json(await service.updateEmployeeAssignment(req.params.employeeId, req.params.id, readAssignment(req), currentUser(req).id));
});
projectAssignmentsRouter.post('/employees/:employeeId/:id/finalize', async (req: Request<{ employeeId: string; id: string }>, res) => {
  res.json(await service.finalizeEmployeeAssignment(req.params.employeeId, req.params.id, readFinalize(req), currentUser(req).id));
});
