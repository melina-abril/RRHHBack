import { createApp } from './shared/http/create-app';
import { employeesRouter } from './modules/employees/employees.router';

// Acá se montan todos los routers de los módulos funcionales del sistema.

export const app = createApp({
  '/employees': employeesRouter
});
