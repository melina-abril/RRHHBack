/**
 * Core: colecciones compartidas por todos los módulos (departments, positions, employees)
 * y los usuarios de ejemplo para entrar (Firebase Auth + users/{uid} con su rol).
 * Los roles son los MISMOS códigos que usan el backend (requireRole) y el front (APP_ROLES).
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { createDemoUsers } = require("../../scripts/demo-users");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

// Áreas/departamentos (códigos ejemplo)
const departments = [
  { id: "HR", name: "Recursos Humanos" },
  { id: "IT", name: "Tecnología" }
];

// Puestos (códigos ejemplo, referencia al área)
const positions = [
  { id: "HR_MANAGER", name: "Gerente de RR.HH.", departmentId: "HR" },
  { id: "DEVELOPER", name: "Desarrollador/a", departmentId: "IT" }
];

// Legajos: colaboradores de TECHFORB con sus datos mínimos
const employees = [
  {
    id: "E-0001",
    firstName: "Laura",
    lastName: "Gómez",
    documentType: "DNI",
    documentNumber: "12345678",
    birthDate: "1990-02-03",
    email: "laura.gomez@example.com",
    phone: "+54 11 5555-1111",
    hireDate: "2020-05-01",
    departmentId: "HR",
    positionId: "HR_MANAGER",
    managerId: null,
    status: "ACTIVE"
  },
  {
    id: "E-0002",
    firstName: "Martín",
    lastName: "Pérez",
    documentType: "DNI",
    documentNumber: "22333444",
    birthDate: "1988-07-15",
    email: "martin.perez@example.com",
    phone: "+54 11 5555-2222",
    hireDate: "2021-01-10",
    departmentId: "IT",
    positionId: "DEVELOPER",
    managerId: "E-0001",
    status: "ACTIVE"
  }
];

exports.seed = async (db, { auth }) => {
  const batch = db.batch();

  // Colección: departments
  for (const { id, ...data } of departments) {
    batch.set(db.collection("departments").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }

  // Colección: positions
  for (const { id, ...data } of positions) {
    batch.set(db.collection("positions").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }

  // Colección: employees (legajo único, campos base y referencias)
  for (const { id, birthDate, hireDate, ...data } of employees) {
    batch.set(db.collection("employees").doc(id), {
      ...data,
      employeeNumber: id,
      birthDate: date(birthDate),
      hireDate: date(hireDate),
      terminationDate: null,
      deletedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();

  // Usuarios de ejemplo (uno por rol, contraseña Demo1234!)
  await createDemoUsers(db, auth, [
    { uid: "admin-rrhh", email: "admin.rrhh@example.com", name: "Laura Gómez", role: "ADMIN", employeeId: "E-0001" },
    { uid: "empleado", email: "martin.perez@example.com", name: "Martín Pérez", role: "EMPLOYEE", employeeId: "E-0002" }
  ]);
};
