import { Router } from 'express';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { employeeListQuerySchema, employeeRequestSchema } from './employee-management.schemas.js';
import { employeeManagementService } from './employee-management.service.js';

/** Se monta bajo /api/employees; app.ts ya exige sesión. */
export const employeeManagementRouter = Router();

employeeManagementRouter.get('/', async (req, res) => {
  res.json(await employeeManagementService.list(parse(employeeListQuerySchema, req.query)));
});

employeeManagementRouter.get('/:id', async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  res.json(await employeeManagementService.get(id));
});

employeeManagementRouter.post('/', requireRole('ADMIN'), async (req, res) => {
  const employee = await employeeManagementService.create(parse(employeeRequestSchema, req.body));
  res.status(201).json(employee);
});
