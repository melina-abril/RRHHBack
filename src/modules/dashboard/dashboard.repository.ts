import { db } from '../../config/database.js';
import { countOf } from '../../shared/db/db-utils.js';

/** El panel solo lee employees; no crea ni modifica documentos de esa colección. */
export const dashboardRepository = {
  async countActiveEmployees(): Promise<number> {
    return countOf(db.collection('employees').where('status', '==', 'ACTIVE'));
  },
};
