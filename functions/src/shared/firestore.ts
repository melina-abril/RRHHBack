import { getApps, initializeApp } from 'firebase-admin/app';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';

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
