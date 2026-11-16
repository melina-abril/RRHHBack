import { Router } from 'express';
import { currentUser } from '../../shared/auth/current-user.js';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { employeeCreateSchema, employeeListQuerySchema, employeeUpdateSchema } from './employees.schemas.js';
import { employeesService } from './employees.service.js';

/** Montado bajo /api/employees por el router principal; la sesión ya se exige en app.ts. */
export const employeesRouter = Router();

employeesRouter.get('/', requireRole('ADMIN'), async (req, res) => {
  res.json(await employeesService.list(parse(employeeListQuerySchema, req.query)));
});

employeesRouter.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await employeesService.get(id));
});

employeesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  const employee = await employeesService.create(parse(employeeCreateSchema, req.body), currentUser(res).id);
  res.status(201).json(employee);
});

employeesRouter.put('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await employeesService.update(id, parse(employeeUpdateSchema, req.body)));
});
