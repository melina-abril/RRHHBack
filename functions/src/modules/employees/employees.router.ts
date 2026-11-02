import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import { employeesService } from './employees.service';
import { EMPLOYEE_STATUSES, EmployeeRequest, EmployeeStatus, EmployeesFilters } from './employees.dto';
import { currentUser } from '../../shared/auth/session-user';

export const employeesRouter = Router();

function readEmployeeRequest(req: Request): EmployeeRequest {
  const body = new BodyReader(req.body);
  const request: EmployeeRequest = {
    firstName: body.text('firstName', { max: 60, message: 'El nombre es obligatorio.' }),
    lastName: body.text('lastName', { max: 60, message: 'El apellido es obligatorio.' }),
    documentType: body.text('documentType', { max: 20, message: 'El tipo de documento es obligatorio.' }),
    documentNumber: body.text('documentNumber', { max: 30, message: 'El número de documento es obligatorio.' }),
    birthDate: body.date('birthDate', 'La fecha de nacimiento es obligatoria.'),
    email: body.email('email'),
    phone: body.optionalText('phone', { max: 30 }) ?? '',
    hireDate: body.date('hireDate', 'La fecha de ingreso es obligatoria.'),
    departmentId: body.text('departmentId', { max: 30, message: 'El área/departamento es obligatorio.' }),
    positionId: body.text('positionId', { max: 30, message: 'La posición es obligatoria.' }),
    managerId: body.optionalText('managerId', { max: 20 }) ?? null,
  };
  body.done();
  return request;
}

// GET /api/employees?search=&status=&departmentId=&positionId=&page=&size=
employeesRouter.get('/', async (req, res) => {
  const filters: EmployeesFilters = {
    search: queryText(req.query, 'search'),
    status: (() => {
      const s = queryText(req.query, 'status');
      return (s && (EMPLOYEE_STATUSES as readonly string[]).includes(s)) ? s as EmployeeStatus : null;
    })(),
    departmentId: queryText(req.query, 'departmentId'),
    positionId: queryText(req.query, 'positionId'),
  };
  res.json(await employeesService.list(filters, parsePageQuery(req.query)));
});

// GET /api/employees/:id
employeesRouter.get('/:id', async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.get(req.params.id));
});

// POST /api/employees
employeesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  const user = currentUser(req);
  res.status(201).json(await employeesService.create(readEmployeeRequest(req), user));
});

// PUT /api/employees/:id
employeesRouter.put('/:id', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  const user = currentUser(req);
  res.json(await employeesService.update(req.params.id, readEmployeeRequest(req), user));
});

// POST /api/employees/:id/leave
employeesRouter.post('/:id/leave', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  const user = currentUser(req);
  res.json(await employeesService.leave(req.params.id, user));
});

// POST /api/employees/:id/rejoin
employeesRouter.post('/:id/rejoin', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  const user = currentUser(req);
  const body = new BodyReader(req.body);
  const hireDate = body.date('hireDate', 'La fecha de reingreso es obligatoria.');
  body.done();
  res.json(await employeesService.rejoin(req.params.id, hireDate, user));
});
