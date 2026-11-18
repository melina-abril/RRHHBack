import { db } from '../../config/database.js';
import { countOf } from '../../shared/db/db-utils.js';

/** Consulta agregada de solo lectura sobre la colección existente de colaboradores. */
export const EMPLOYEES_COLLECTION = { collectionName: 'employees' } as const;

export const dashboardRepository = {
  async countActiveEmployees(): Promise<number> {
    return countOf(db.collection(EMPLOYEES_COLLECTION.collectionName).where('status', '==', 'ACTIVE'));
  },
};
