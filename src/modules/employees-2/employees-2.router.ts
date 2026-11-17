import { Router } from 'express';
import { requireRole } from '../../shared/auth/require-session.js';
import { idParamSchema, parse } from '../../shared/http/validation.js';
import { updateEmployeeSchema } from './employees-2.schemas.js';
import { employees2Service } from './employees-2.service.js';

/** Se monta bajo /api/employees; los GET existentes permanecen en el módulo employees. */
export const employees2Router = Router();

employees2Router.put('/:id', requireRole('ADMIN'), async (req, res) => {
  const { id } = parse(idParamSchema, req.params);
  const request = parse(updateEmployeeSchema, req.body);
  res.json(await employees2Service.updateEmployee(id, request));
});
