import { Router } from 'express';
import { employees2Router } from './modules/employees-2/employees-2.router.js';
import { employmentMovementsRouter } from './modules/employment-movements/employment-movements.router.js';
import { professionalProfileRouter } from './modules/professional-profile/professional-profile.router.js';
import { benefitsRouter } from './modules/benefits/benefits.router.js';
import { remunerationRouter } from './modules/remuneration/remuneration.router.js';
import { employeesRouter } from './modules/employees/employees.router.js';
import { dashboardRouter } from './modules/dashboard/dashboard.router.js';

export const apiRouter = Router();

// El router de edición se monta primero para atender PUT /employees/:id.
apiRouter.use('/employees', employees2Router);
apiRouter.use('/employees', employeesRouter);
apiRouter.use('/employment-movements', employmentMovementsRouter);
apiRouter.use('/professional-profiles', professionalProfileRouter);
apiRouter.use('/benefits', benefitsRouter);
apiRouter.use('/remunerations', remunerationRouter);
apiRouter.use('/dashboard', dashboardRouter);
