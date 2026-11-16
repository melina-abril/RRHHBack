import { Router } from 'express';
import { employeesRouter } from './modules/employees/employees.router.js';
import { dashboardRouter } from './modules/dashboard/dashboard.router.js';

export const apiRouter = Router();

apiRouter.use('/employees', employeesRouter);
apiRouter.use('/dashboard', dashboardRouter);
