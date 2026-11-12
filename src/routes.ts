import { Router } from 'express';
import { dashboardRouter } from './modules/dashboard/dashboard.router.js';
import { employeeManagementRouter } from './modules/employee-management/employee-management.router.js';

export const apiRouter = Router();

apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/employees', employeeManagementRouter);
