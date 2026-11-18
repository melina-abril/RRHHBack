import { Router } from 'express';
import { requireRole } from '../../shared/auth/require-session.js';
import { parse } from '../../shared/http/validation.js';
import { employeeListQuerySchema } from './employees.schemas.js';
import { employeesService } from './employees.service.js';

export const employeesRouter = Router();

/** GET /api/employees?search=&category=&status=&country=&client=&project=&page=0&size=10 */
employeesRouter.get('/', requireRole('ADMIN'), async (req, res) => {
  res.json(await employeesService.list(parse(employeeListQuerySchema, req.query)));
});
