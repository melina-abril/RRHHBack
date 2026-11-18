/**
 * Colección compartida users: cuenta administradora de demostración.
 * Para entornos reales, crear o restablecer la cuenta con scripts/create-admin.js.
 */
const { FieldValue } = require("firebase-admin/firestore");

// Contraseña de demostración: Demo1234!
const DEMO_PASSWORD_HASH = "$2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO";

const users = [
  {
    id: "U-0001",
    name: "Administración de Recursos Humanos",
    email: "rrhh@example.com",
    role: "ADMIN",
    active: true,
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, ...data } of users) {
    batch.set(db.collection("users").doc(id), {
      ...data,
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
