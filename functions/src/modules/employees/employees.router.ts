import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import { EMPLOYEE_STATUSES, EmployeeRequest, EmployeeStatus } from './employees.models';
import { employeesService } from './employees.service';

/**
 * Router del módulo de Gestión de Empleados. Expone:
 * - GET /api/employees?search=&status=&departmentId=&positionId=&page=&size=
 * - GET /api/employees/:id
 * - POST /api/employees — solo ADMIN
 * - PUT /api/employees/:id — solo ADMIN
 * - DELETE /api/employees/:id — solo ADMIN (baja lógica)
 */
export const employeesRouter = Router();

function readEmployeeRequest(req: Request): EmployeeRequest {
  const body = new BodyReader(req.body);
  const request: EmployeeRequest = {
    firstName: body.text('firstName', { max: 80, message: 'El nombre es obligatorio.' }),
    lastName: body.text('lastName', { max: 80, message: 'El apellido es obligatorio.' }),
    documentType: body.text('documentType', { max: 10, message: 'El tipo de documento es obligatorio.' }),
    documentNumber: body.text('documentNumber', { max: 20, message: 'El número de documento es obligatorio.' }),
    birthDate: body.date('birthDate', 'Ingresa la fecha de nacimiento.'),
    email: body.email('email'),
    phone: body.text('phone', { max: 30, message: 'El teléfono es obligatorio.' }),
    hireDate: body.date('hireDate', 'Ingresa la fecha de ingreso.'),
    departmentId: body.text('departmentId', { max: 20, message: 'El área es obligatoria.' }),
    positionId: body.text('positionId', { max: 20, message: 'El puesto es obligatorio.' }),
    managerId: body.optionalText('managerId', { max: 20 }) || null,
  };
  body.done();
  return request;
}

/** GET /api/employees?search=&status=&departmentId=&positionId=&page=&size= */
employeesRouter.get('/', async (req, res) => {
  const status = queryText(req.query, 'status');
  const filters = {
    search: queryText(req.query, 'search'),
    status: status && (EMPLOYEE_STATUSES as readonly string[]).includes(status) ? (status as EmployeeStatus) : null,
    departmentId: queryText(req.query, 'departmentId'),
    positionId: queryText(req.query, 'positionId'),
  };
  res.json(await employeesService.list(filters, parsePageQuery(req.query)));
});

/** GET /api/employees/:id */
employeesRouter.get('/:id', async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.get(req.params.id));
});

/** POST /api/employees — solo ADMIN */
employeesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  res.status(201).json(await employeesService.create(readEmployeeRequest(req)));
});

/** PUT /api/employees/:id — solo ADMIN */
employeesRouter.put('/:id', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.update(req.params.id, req.body));
});

/** DELETE /api/employees/:id — solo ADMIN */
employeesRouter.delete('/:id', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  await employeesService.delete(req.params.id);
  res.status(204).end();
});
