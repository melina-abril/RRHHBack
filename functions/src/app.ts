import { createApp } from './shared/http/create-app';
import { employeesRouter } from './modules/employees/employees.router';
import { payrollRouter } from './modules/payroll/payroll.router';
import { requestsRouter } from './modules/requests/requests.router';
import { noticesRouter } from './modules/notices/notices.router';
import { overtimeRouter } from './modules/overtime/overtime.router';

export const app = createApp({
  '/employees': employeesRouter,
  '/payroll': payrollRouter,
  '/requests': requestsRouter,
  '/notices': noticesRouter,
  '/overtime': overtimeRouter
});
