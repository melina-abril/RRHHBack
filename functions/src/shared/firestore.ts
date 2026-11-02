import { getApps, initializeApp } from 'firebase-admin/app';
import { DocumentData, FieldPath, Timestamp, getFirestore } from 'firebase-admin/firestore';

// En Cloud Functions y en el emulador las credenciales y el proyecto llegan solos.
if (getApps().length === 0) initializeApp();

/** Base del sistema. Los repositorios de cada módulo la usan; nadie más crea otra instancia. */
export const db = getFirestore();

/** Timestamp de Firestore → "YYYY-MM-DD" (fechas sin hora, como birthDate). null si no hay valor. */
export function toIsoDate(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString().slice(0, 10) : null;
}

/** Timestamp de Firestore → ISO 8601 completo (momentos, como updatedAt). null si no hay valor. */
export function toIsoDateTime(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

/** "YYYY-MM-DD" → Timestamp a las 00:00 UTC (lo que guardan los scripts de carga). */
export function fromIsoDate(value: string): Timestamp {
  return Timestamp.fromDate(new Date(`${value}T00:00:00Z`));
}

/** Contadores de los ids correlativos: _counters/{colección}__{prefijo} { last }. */
const COUNTERS = '_counters';

/**
 * Alta con un id de negocio correlativo (legajo "E-0003", solicitud "LR-0012"…): en una transacción toma el
 * último número de _counters (la primera vez lo calcula a partir de los ids que ya existen, ej. los del seed),
 * crea el documento con el siguiente y actualiza el contador. Nunca un contador en memoria: la función se
 * reinicia y corre en varias instancias. build recibe el id para guardarlo también en un campo (employeeNumber).
 *
 *   const { id, data } = await createWithNextCode('employees', 'E-', (id) => ({ ...doc, employeeNumber: id }));
 */
export async function createWithNextCode<T extends DocumentData>(
  collectionName: string,
  prefix: string,
  build: (id: string) => T,
  digits = 4,
): Promise<{ id: string; data: T }> {
  const collection = db.collection(collectionName);
  const counterRef = db.collection(COUNTERS).doc(`${collectionName}__${prefix}`);
  return db.runTransaction(async (tx) => {
    const counter = await tx.get(counterRef);
    let last = Number(counter.data()?.['last']);
    if (!Number.isFinite(last)) {
      const existing = await tx.get(
        collection.where(FieldPath.documentId(), '>=', prefix).where(FieldPath.documentId(), '<', `${prefix}`).select(),
      );
      last = existing.docs.reduce((max, doc) => Math.max(max, Number(doc.id.slice(prefix.length)) || 0), 0);
    }
    const next = last + 1;
    const id = `${prefix}${String(next).padStart(digits, '0')}`;
    const data = build(id);
    tx.create(collection.doc(id), data);
    tx.set(counterRef, { last: next });
    return { id, data };
  });
}
