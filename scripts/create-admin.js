/**
 * FIJO. Crea el usuario administrador inicial en la colección users (o le restablece la contraseña). Es la forma de
 * entrar a un entorno real: ahí no se cargan usuarios de ejemplo con contraseñas conocidas. Lo corre el cliente con
 * SUS credenciales de Google Cloud, igual que npm run seed: la contraseña nunca pasa por nadie más.
 *
 *   npm run create-admin -- --email=ana@empresa.com --name="Ana Pérez"
 *   npm run create-admin -- --email=ana@empresa.com --reset        restablece la contraseña (y lo reactiva)
 *   npm run create-admin:emulator -- --email=ana@empresa.com       prueba contra el emulador (proyecto demo-app)
 *
 * Opciones: --email (obligatoria), --name (por defecto, la parte del email antes de @), --role (código del rol, por
 * defecto ADMIN: el mismo de users.role), --reset.
 * Credenciales: FIREBASE_PROJECT_ID + GOOGLE_APPLICATION_CREDENTIALS (archivo de cuenta de servicio) o las de
 * `gcloud auth application-default login`. Con FIRESTORE_EMULATOR_HOST o --emulator, el emulador.
 * Contraseña: la de ADMIN_PASSWORD (mínimo 12 caracteres) o, si no está, una al azar que se muestra UNA sola vez.
 * Se guarda solo el hash bcrypt (passwordHash), como el resto de users.
 */
const crypto = require("node:crypto");

const USERS = "users";
const ID_PATTERN = /^U-(\d+)$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_PATTERN = /^[A-Z][A-Z0-9_]*$/;
const MIN_PASSWORD_LENGTH = 12;

/** --clave=valor y --bandera → { clave: valor, bandera: true }. */
const parseArgs = (argv) =>
  Object.fromEntries(
    argv
      .filter((arg) => arg.startsWith("--"))
      .map((arg) => {
        const [key, ...rest] = arg.slice(2).split("=");
        return [key, rest.length ? rest.join("=") : true];
      })
  );

const fail = (message) => {
  throw new Error(message);
};

/** Contraseña al azar de 20 caracteres (letras, números y algunos símbolos), sin caracteres ambiguos. */
const randomPassword = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!#%+=?";
  return Array.from(crypto.randomBytes(20), (byte) => alphabet[byte % alphabet.length]).join("");
};

const run = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.emulator && !process.env.FIRESTORE_EMULATOR_HOST) process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";

  const email = typeof args.email === "string" ? args.email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(email)) fail('Indica el correo del administrador: --email=nombre@empresa.com');
  const role = typeof args.role === "string" ? args.role.trim() : "ADMIN";
  if (!ROLE_PATTERN.test(role)) fail(`Rol inválido "${role}": usa el código del rol en MAYÚSCULAS (ej. ADMIN).`);
  const name = typeof args.name === "string" && args.name.trim() ? args.name.trim() : email.split("@")[0];

  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv !== undefined && fromEnv.length < MIN_PASSWORD_LENGTH) {
    fail(`ADMIN_PASSWORD tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  const password = fromEnv ?? randomPassword();

  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || (emulator ? "demo-app" : "");
  if (!projectId) fail("Define FIREBASE_PROJECT_ID (o usa npm run create-admin:emulator para el emulador).");
  if (emulator) process.env.METADATA_SERVER_DETECTION ??= "none";

  const bcrypt = require("bcryptjs");
  const { initializeApp, applicationDefault } = require("firebase-admin/app");
  const { getFirestore, FieldValue } = require("firebase-admin/firestore");
  const app = initializeApp(emulator ? { projectId } : { projectId, credential: applicationDefault() });
  const db = getFirestore(app);
  console.log(`Firestore: ${emulator ? `emulador ${emulator}` : "proyecto"} ${projectId}`);

  const passwordHash = await bcrypt.hash(password, 10);
  const users = db.collection(USERS);

  // Nunca se lanza un error dentro de la transacción: se devuelve y se informa afuera, así no queda un bloqueo
  // tomado si el proceso termina enseguida.
  const result = await db.runTransaction(async (trx) => {
    const existing = await trx.get(users.where("email", "==", email).limit(1));
    if (!existing.empty) {
      const doc = existing.docs[0];
      if (!args.reset) return { id: doc.id, conflict: true };
      const changes = { passwordHash, active: true, updatedAt: FieldValue.serverTimestamp() };
      if (typeof args.role === "string") changes.role = role;
      trx.update(doc.ref, changes);
      return { id: doc.id, created: false };
    }

    // Id legible y correlativo, como los de los scripts de carga (U-0001…).
    const ids = await trx.get(users.select());
    const last = ids.docs.reduce((max, doc) => {
      const match = ID_PATTERN.exec(doc.id);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    const id = `U-${String(last + 1).padStart(4, "0")}`;
    trx.create(users.doc(id), { name, email, role, active: true, passwordHash, createdAt: FieldValue.serverTimestamp() });
    return { id, created: true };
  });

  if (result.conflict) fail(`Ya existe el usuario ${email} (${result.id}). Para cambiarle la contraseña agrega --reset.`);
  console.log(`${result.created ? "Usuario creado" : "Contraseña restablecida"}: ${email} (${result.id}, rol ${role}).`);
  if (fromEnv === undefined) {
    console.log("");
    console.log(`  Contraseña: ${password}`);
    console.log("");
    console.log("Guárdala ahora: no se vuelve a mostrar ni queda guardada en ningún lado (solo su hash).");
  }
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  });
