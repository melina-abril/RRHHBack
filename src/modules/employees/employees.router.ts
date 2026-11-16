import { Router } from 'express';
import { currentUser } from '../../shared/auth/current-user.js';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { employeeListQuerySchema, employeeRequestSchema } from './employees.schemas.js';
import { employeesService } from './employees.service.js';

export const employeesRouter = Router();

employeesRouter.get('/', requireRole('ADMIN'), async (req, res) => {
  res.json(await employeesService.list(parse(employeeListQuerySchema, req.query)));
});

employeesRouter.get('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await employeesService.get(id));
});

employeesRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  const employee = await employeesService.create(parse(employeeRequestSchema, req.body), currentUser(res).id);
  res.status(201).json(employee);
});
