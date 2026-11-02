import type { RequestHandler } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { db } from '../firestore';
import { ForbiddenError, UnauthorizedError } from '../http/errors';
import { SessionUser } from './session-user';

/** Colección de usuarios habilitados: users/{uid de Firebase Auth} { email, name, role, active }. La cargan los scripts de la base. */
export const USERS_COLLECTION = 'users';

const CACHE_MS = 60_000;
const cache = new Map<string, { user: SessionUser | null; expiresAt: number }>();

async function findUser(uid: string, email: string): Promise<SessionUser | null> {
  const cached = cache.get(uid);
  if (cached && cached.expiresAt > Date.now()) return cached.user;
  const snapshot = await db.collection(USERS_COLLECTION).doc(uid).get();
  const data = snapshot.data();
  const user =
    data && data['active'] !== false
      ? {
          id: uid,
          name: typeof data['name'] === 'string' ? data['name'] : email,
          email: typeof data['email'] === 'string' ? data['email'] : email,
          role: typeof data['role'] === 'string' ? data['role'] : null,
        }
      : null;
  cache.set(uid, { user, expiresAt: Date.now() + CACHE_MS });
  return user;
}

/**
 * Toda ruta de /api pasa por acá (lo monta createApp): verifica el ID token de Firebase Auth
 * (Authorization: Bearer …) y carga el usuario de users/{uid}. Sin token o vencido → 401; sin documento en
 * users o con active: false → 403 USER_NOT_ENABLED.
 */
export const requireAuth: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : '';
  if (!token) throw new UnauthorizedError('UNAUTHORIZED', 'Inicia sesión para continuar.');
  let decoded;
  try {
    decoded = await getAuth().verifyIdToken(token);
  } catch {
    throw new UnauthorizedError();
  }
  const user = await findUser(decoded.uid, decoded.email ?? '');
  if (!user) throw new ForbiddenError('USER_NOT_ENABLED', 'Tu usuario no está habilitado en el sistema.');
  req.user = user;
  next();
};

/**
 * Acción de uno o más roles: router.post('/', requireRole('ADMIN'), handler). Códigos EXACTOS de users.role
 * (los mismos que APP_ROLES del front). Sin requireRole alcanza con tener sesión.
 */
export function requireRole(...roles: string[]): RequestHandler {
  return (req, _res, next) => {
    const role = req.user?.role ?? null;
    if (role === null || !roles.includes(role)) throw new ForbiddenError();
    next();
  };
}
