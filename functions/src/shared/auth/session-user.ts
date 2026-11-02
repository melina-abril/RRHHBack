import type { Request } from 'express';
import { UnauthorizedError } from '../http/errors';

/**
 * Usuario de la sesión: el uid de Firebase Auth + su documento users/{uid} (name, email, role, active).
 * Misma forma que SessionUser del front (GET /api/auth/me).
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  /** Código del rol (el mismo que APP_ROLES del front); null si el sistema no define roles. */
  role: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Lo completa requireAuth en toda ruta de /api (salvo las públicas). */
      user?: SessionUser;
    }
  }
}

/** Usuario actual en un handler. Si un módulo guarda quién hizo algo, guarda currentUser(req).id, nunca el nombre. */
export function currentUser(req: Request): SessionUser {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}
