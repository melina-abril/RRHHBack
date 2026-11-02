// App principal de Express para la Cloud Function HTTP: monta un router por cada módulo
import { createApp } from './shared/http/create-app';
import { dashboardRouter } from './modules/dashboard/dashboard.router';
import { employeesRouter } from './modules/employees/employees.router';
// Nota: el módulo de login y la sesión están cubiertos por los archivos FIJOS de shared/auth

// Prefijos de cada módulo (los paths base de cada router, sin /api que ya agrega createApp)
export const app = createApp({
  '/dashboard': dashboardRouter,
  '/employees': employeesRouter
});
