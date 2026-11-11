/**
 * FIJO. Runner de los scripts de carga (como Flyway para Firestore): aplica firestore/seeds/V{n}__{modulo}.js en
 * orden de versión (V1 < V1_1 < V2 < V10) y registra cada uno en la colección _seedHistory, así volver a correrlo
 * solo aplica los nuevos. Cada script exporta seed(db) y recibe la base ya inicializada.
 *
 *   npm run seed:emulator          contra el emulador (localhost:8085, proyecto demo-app)
 *   npm run seed                   contra el proyecto de FIREBASE_PROJECT_ID (credenciales de
 *                                  GOOGLE_APPLICATION_CREDENTIALS) o el emulador si FIRESTORE_EMULATOR_HOST está definida
 *   npm run check                  solo revisa que cada script se pueda cargar y exporte seed (no escribe nada)
 */
const fs = require("node:fs");
const path = require("node:path");

const SEEDS_DIR = path.resolve(__dirname, "../firestore/seeds");
const HISTORY = "_seedHistory";
const NAME_PATTERN = /^V(\d+(?:_\d+)*)__([a-z0-9_]+)\.js$/;

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
if (args.has("--emulator") && !process.env.FIRESTORE_EMULATOR_HOST) process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";

/** "1_1" → [1, 1]: compara versión por versión (V2 < V10, V1 < V1_1 < V2). */
const versionOf = (file) => file.match(NAME_PATTERN)[1].split("_").map(Number);
const compareVersions = (a, b) => {
  const [va, vb] = [versionOf(a), versionOf(b)];
  for (let i = 0; i < Math.max(va.length, vb.length); i++) {
    const diff = (va[i] ?? -1) - (vb[i] ?? -1);
    if (diff) return diff;
  }
  return 0;
};

const listSeeds = () => {
  const files = fs.existsSync(SEEDS_DIR) ? fs.readdirSync(SEEDS_DIR).filter((file) => file.endsWith(".js")) : [];
  const invalid = files.filter((file) => !NAME_PATTERN.test(file));
  if (invalid.length) throw new Error(`Nombres inválidos (usa V{n}__{modulo}.js): ${invalid.join(", ")}`);
  const versions = files.map((file) => versionOf(file).join("."));
  const repeated = versions.filter((version, index) => versions.indexOf(version) !== index);
  if (repeated.length) throw new Error(`Versiones repetidas: ${[...new Set(repeated)].join(", ")}`);
  return files.sort(compareVersions);
};

const loadSeed = (file) => {
  const script = require(path.join(SEEDS_DIR, file));
  if (typeof script.seed !== "function") throw new Error(`${file} no exporta seed(db)`);
  return script.seed;
};

const run = async () => {
  const files = listSeeds();
  const seeds = files.map((file) => ({ file, seed: loadSeed(file) }));
  if (checkOnly) {
    console.log(`OK: ${files.length} scripts de carga válidos${files.length ? ` (${files.join(", ")})` : ""}.`);
    return;
  }

  const emulator = process.env.FIRESTORE_EMULATOR_HOST;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || (emulator ? "demo-app" : "");
  if (!projectId) throw new Error("Define FIREBASE_PROJECT_ID (o usa npm run seed:emulator para el emulador).");

  // En el emulador no hay servidor de metadata de Google Cloud: no buscarlo (evita esperas y avisos).
  if (emulator) process.env.METADATA_SERVER_DETECTION ??= "none";
  const { initializeApp, applicationDefault } = require("firebase-admin/app");
  const { getFirestore, FieldValue } = require("firebase-admin/firestore");
  const app = initializeApp(emulator ? { projectId } : { projectId, credential: applicationDefault() });
  const db = getFirestore(app);
  console.log(`Firestore: ${emulator ? `emulador ${emulator}` : "proyecto"} ${projectId}`);

  const applied = new Set((await db.collection(HISTORY).get()).docs.map((doc) => doc.id));
  let count = 0;
  for (const { file, seed } of seeds) {
    if (applied.has(file)) {
      console.log(`  = ${file} (ya aplicado)`);
      continue;
    }
    await seed(db);
    await db.collection(HISTORY).doc(file).set({ file, appliedAt: FieldValue.serverTimestamp() });
    console.log(`  + ${file}`);
    count++;
  }
  console.log(count ? `Listo: ${count} scripts aplicados.` : "Nada nuevo para aplicar.");
};

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  });
