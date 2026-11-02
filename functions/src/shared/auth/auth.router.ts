import { Router } from 'express';
import { SessionUser, currentUser } from './session-user';

/**
 * /api/auth: el login y el logout los hace el front con Firebase Auth; acá solo está GET /api/auth/me, que el
 * front llama al entrar para saber nombre y rol (users/{uid}).
 */
export const authRouter = Router();

authRouter.get('/me', (req, res) => {
  const user: SessionUser = currentUser(req);
  res.json(user);
});
