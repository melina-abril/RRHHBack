import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import {
  EMPLOYEE_STATUSES,
  EmployeeRequest,
  EmployeeStatus,
  EmployeeReinstateRequest
} from './employees.dto';
import { employeesService } from './employees.service';

export const employeesRouter = Router();

/** Lee el body de alta/edición */
function readEmployeeRequest(req: Request): EmployeeRequest {
  const body = new BodyReader(req.body);
  const request: EmployeeRequest = {
    firstName: body.text('firstName', { max: 60, message: 'El nombre es obligatorio.' }),
    lastName: body.text('lastName', { max: 60, message: 'El apellido es obligatorio.' }),
    documentType: body.text('documentType', { max: 20, message: 'El tipo de documento es obligatorio.' }).toUpperCase(),
    documentNumber: body.text('documentNumber', { max: 20, message: 'El número de documento es obligatorio.' }),
    birthDate: body.date('birthDate', 'Ingresa una fecha de nacimiento válida.'),
    email: body.email('email'),
    phone: body.text('phone', { max: 30, message: 'El teléfono de contacto es obligatorio.' }),
    hireDate: body.date('hireDate', 'Ingresa la fecha de ingreso.'),
    departmentId: body.text('departmentId', { max: 24, message: 'Selecciona un área.' }),
    positionId: body.text('positionId', { max: 24, message: 'Selecciona un puesto.' }),
    managerId: body.optionalText('managerId', { max: 24 }),
  };
  body.done();
  return request;
}

/** Lee el body del reingreso */
function readEmployeeReinstateRequest(req: Request): EmployeeReinstateRequest {
  const body = new BodyReader(req.body);
  const request: EmployeeReinstateRequest = {
    hireDate: body.date('hireDate', 'Ingresa la fecha de reingreso.'),
    departmentId: body.text('departmentId', { max: 24, message: 'Selecciona un área.' }),
    positionId: body.text('positionId', { max: 24, message: 'Selecciona un puesto.' }),
    managerId: body.optionalText('managerId', { max: 24 }),
  };
  body.done();
  return request;
}

/** GET /api/employees?search=&status=&departmentId=&positionId=&clientId=&projectId=&page=&size= */
employeesRouter.get('/', async (req, res) => {
  const status = queryText(req.query, 'status');
  const filters = {
    search: queryText(req.query, 'search'),
    status: status && (EMPLOYEE_STATUSES as readonly string[]).includes(status) ? (status as EmployeeStatus) : null,
    departmentId: queryText(req.query, 'departmentId'),
    positionId: queryText(req.query, 'positionId'),
    clientId: queryText(req.query, 'clientId'),
    projectId: queryText(req.query, 'projectId'),
  };
  res.json(await employeesService.list(filters, parsePageQuery(req.query)));
});

/** POST /api/employees — solo ADMIN */
employeesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  res.status(201).json(await employeesService.create(readEmployeeRequest(req)));
});

/** GET /api/employees/:id */
employeesRouter.get('/:id', async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.get(req.params.id));
});

/** PUT /api/employees/:id — solo ADMIN*/
employeesRouter.put('/:id', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.update(req.params.id, readEmployeeRequest(req)));
});

/** POST /api/employees/:id/terminate — solo ADMIN*/
employeesRouter.post('/:id/terminate', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  const body = new BodyReader(req.body);
  const terminationDate = body.date('terminationDate', 'Ingresa la fecha de egreso.')
  body.done();
  res.json(await employeesService.terminate(req.params.id, terminationDate));
});

/** POST /api/employees/:id/reinstate — solo ADMIN*/
employeesRouter.post('/:id/reinstate', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.reinstate(req.params.id, readEmployeeReinstateRequest(req)));
});
