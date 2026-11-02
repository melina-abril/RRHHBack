import { Request, Router } from 'express';
import { requireRole } from '../../shared/auth/auth.middleware';
import { BodyReader } from '../../shared/http/body-reader';
import { parsePageQuery, queryText } from '../../shared/http/page';
import { EMPLOYEE_STATUSES, EmployeeRequest, EmployeeStatus } from './employees.dto';
import { employeesService } from './employees.service';

/**
 * Router del módulo gestión de empleados. Todos los handlers HTTP, valida con BodyReader y requireRole('ADMIN').
 */
export const employeesRouter = Router();

/** Lectura y validación del body en alta/edición de empleados */
function readEmployeeRequest(req: Request): EmployeeRequest {
  const body = new BodyReader(req.body);
  const request: EmployeeRequest = {
    firstName: body.text('firstName', { max: 50, message: 'El nombre es obligatorio.' }),
    lastName: body.text('lastName', { max: 50, message: 'El apellido es obligatorio.' }),
    documentType: body.text('documentType', { max: 10, message: 'El tipo de documento es obligatorio.' }),
    documentNumber: body.text('documentNumber', { max: 20, message: 'El número de documento es obligatorio.' }),
    birthDate: body.date('birthDate', 'La fecha de nacimiento es obligatoria y debe ser válida.'),
    email: body.email('email'),
    phone: body.optionalText('phone', { max: 20 }) ?? '',
    hireDate: body.date('hireDate', 'La fecha de ingreso es obligatoria y debe ser válida.'),
    departmentId: body.text('departmentId', { max: 20, message: 'El área es obligatoria.' }),
    positionId: body.text('positionId', { max: 30, message: 'El puesto es obligatorio.' }),
    managerId: body.optionalText('managerId', { max: 20 })
  };
  body.done();
  return request;
}

/** Listado paginado GET /api/employees?search=&status=&departmentId=&positionId=&page=&size= */
employeesRouter.get('/', async (req, res) => {
  const status = queryText(req.query, 'status');
  const filters = {
    search: queryText(req.query, 'search'),
    status: status && (EMPLOYEE_STATUSES as readonly string[]).includes(status) ? (status as EmployeeStatus) : null,
    departmentId: queryText(req.query, 'departmentId'),
    positionId: queryText(req.query, 'positionId')
  };
  res.json(await employeesService.list(filters, parsePageQuery(req.query)));
});

/** Ficha individual GET /api/employees/:id */
employeesRouter.get('/:id', async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.get(req.params.id));
});

/** Alta de colaborador POST /api/employees — ADMIN */
employeesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  res.status(201).json(await employeesService.create(readEmployeeRequest(req)));
});

/** Edición de colaborador PUT /api/employees/:id — ADMIN */
employeesRouter.put('/:id', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  res.json(await employeesService.update(req.params.id, readEmployeeRequest(req)));
});

/** Egreso (baja) de colaborador POST /api/employees/:id/terminate — ADMIN */
employeesRouter.post('/:id/terminate', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  await employeesService.terminate(req.params.id);
  res.status(204).end();
});

/** Reingreso de colaborador POST /api/employees/:id/rejoin — ADMIN (body: { hireDate }) */
employeesRouter.post('/:id/rejoin', requireRole('ADMIN'), async (req: Request<{ id: string }>, res) => {
  const body = new BodyReader(req.body);
  const hireDate = body.date('hireDate', 'La fecha de reingreso es obligatoria.');
  body.done();
  res.json(await employeesService.rejoin(req.params.id, hireDate));
});
