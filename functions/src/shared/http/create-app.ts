import express, { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { authRouter } from '../auth/auth.router';
import { errorHandler, notFoundHandler } from './errors';

/**
 * Arma la app de Express con todo lo común: JSON, sesión en todo /api, /api/auth/me, 404 y errores como
 * ProblemDetail. app.ts solo le pasa los routers de los módulos con su prefijo:
 *
 *   export const app = createApp({ '/products': productsRouter });   // → /api/products
 */
export function createApp(routers: Record<string, Router>): express.Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  const api = Router();
  api.use(requireAuth);
  api.use('/auth', authRouter);
  for (const [prefix, router] of Object.entries(routers)) api.use(prefix, router);
  api.use(notFoundHandler);

  app.use('/api', api);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
