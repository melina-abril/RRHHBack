const { FieldValue, Timestamp } = require("firebase-admin/firestore");

// Contraseña de demostración: Demo1234! Cambiarla antes de usar el sistema fuera del emulador.
const DEMO_PASSWORD_HASH = "$2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO";
const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const users = [
  {
    id: "U-0001",
    name: "Administración de Recursos Humanos",
    email: "rrhh@example.com",
    passwordHash: DEMO_PASSWORD_HASH,
    role: "ADMIN",
    active: true,
  },
];

const employees = [
  {
    id: "E-0001",
    employeeNumber: "E-0001",
    firstName: "Lucía",
    lastName: "Morales",
    birthDate: "1992-04-18",
    residenceCountry: "Argentina",
    personalEmail: "lucia.morales@example.com",
    startDate: "2024-03-04",
    category: "PERMANENT",
    dedication: "FULL_TIME",
    workMode: "REMOTE",
    jobRole: "Software Developer",
    status: "ACTIVE",
    initialClient: "Cliente de ejemplo",
    initialProject: "Portal interno",
    initialManager: null,
    createdById: "U-0001",
    deletedAt: null,
  },
  {
    id: "E-0002",
    employeeNumber: "E-0002",
    firstName: "Mateo",
    lastName: "Ríos",
    birthDate: "1999-08-09",
    residenceCountry: "México",
    personalEmail: "mateo.rios@example.com",
    startDate: "2025-02-10",
    category: "INTERN",
    dedication: "PART_TIME",
    workMode: "HYBRID",
    jobRole: "QA Analyst",
    status: "ACTIVE",
    initialClient: null,
    initialProject: null,
    initialManager: null,
    createdById: "U-0001",
    deletedAt: null,
  },
  {
    id: "E-0003",
    employeeNumber: "E-0003",
    firstName: "Sofía",
    lastName: "Paredes",
    birthDate: "1988-11-23",
    residenceCountry: "Argentina",
    personalEmail: "sofia.paredes@example.com",
    startDate: "2022-06-01",
    category: "PERMANENT",
    dedication: "FULL_TIME",
    workMode: "ONSITE",
    jobRole: "Project Coordinator",
    status: "INACTIVE",
    initialClient: null,
    initialProject: null,
    initialManager: null,
    createdById: "U-0001",
    deletedAt: null,
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, ...data } of users) {
    batch.set(db.collection("users").doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  for (const { id, birthDate, startDate, ...data } of employees) {
    batch.set(db.collection("employees").doc(id), {
      ...data,
      birthDate: date(birthDate),
      startDate: date(startDate),
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
