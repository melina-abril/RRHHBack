import { db } from '../../config/database.js';
import { countOf } from '../../shared/db/db-utils.js';

/** Consulta de solo lectura sobre la colección existente; el panel no crea colecciones propias. */
export const dashboardRepository = {
  async countActiveEmployees(): Promise<number> {
    return countOf(db.collection('employees').where('status', '==', 'ACTIVE'));
  },
};
