import { createApp } from './shared/http/create-app';
import { employeesRouter } from './modules/employees/employees.router';

/**
 * Módulos de la API REST: cada uno con su router, montado en /api/{modulo}. Los módulos sin servicios no tienen router ni endpoints propios.
 * Si agregas un nuevo módulo, impórtalo aquí y súmalo a createApp.
 */
export const app = createApp({
  '/employees': employeesRouter
});
