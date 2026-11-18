import { Router } from 'express';
import { dashboardRouter } from './modules/dashboard/dashboard.router.js';
import { employeesRouter } from './modules/employees/employees.router.js';

export const apiRouter = Router();

apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/employees', employeesRouter);
