import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { app } from './app';

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

/**
 * Toda la API REST en una sola función HTTP. Las rutas de Express empiezan con /api: en producción Hosting
 * reescribe /api/** a esta función; en local el proxy del front manda /api a
 * http://127.0.0.1:5001/{proyecto}/us-central1/api/api (emulador de Functions).
 */
export const api = onRequest(app);
