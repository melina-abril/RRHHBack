/**
 * Usuarios de ejemplo para entrar al sistema: cada uno en Firebase Auth (correo + contraseña) y en
 * users/{uid} { email, name, role, active }, que es de donde la API toma el nombre y el rol. Lo usa el
 * script de carga del core (V1__core.js): await createDemoUsers(db, auth, [{ uid, email, name, role }]).
 */
const { FieldValue } = require("firebase-admin/firestore");

/** Contraseña de todos los usuarios de ejemplo (la misma que muestra el login del front en modo demo). */
const DEMO_PASSWORD = "Demo1234!";

exports.DEMO_PASSWORD = DEMO_PASSWORD;

/**
 * @param {import("firebase-admin/firestore").Firestore} db
 * @param {import("firebase-admin/auth").Auth} auth
 * @param {{ uid: string, email: string, name: string, role: string | null, employeeId?: string | null }[]} users
 */
exports.createDemoUsers = async (db, auth, users) => {
  for (const { uid, email, name, role, employeeId = null } of users) {
    try {
      await auth.createUser({ uid, email, password: DEMO_PASSWORD, displayName: name, emailVerified: true });
    } catch (error) {
      if (error.code !== "auth/uid-already-exists" && error.code !== "auth/email-already-exists") throw error;
      await auth.updateUser(uid, { email, password: DEMO_PASSWORD, displayName: name });
    }
    await db.collection("users").doc(uid).set({
      email,
      name,
      role,
      employeeId,
      active: true,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
};
