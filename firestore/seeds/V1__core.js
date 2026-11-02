/**
 * Core: colecciones compartidas por todos los módulos (departments, positions, employees) y los usuarios de
 * ejemplo para entrar (Firebase Auth + users/{uid} con su rol). Los roles son los MISMOS códigos que usan el
 * backend (requireRole) y el front (APP_ROLES).
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { createDemoUsers } = require("../../scripts/demo-users");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

// Áreas
const departments = [
  { id: "HR", name: "Recursos Humanos" },
  { id: "IT", name: "Tecnología" },
  { id: "ADMIN", name: "Administración" },
  { id: "COM", name: "Comercial" }
];

// Puestos, normales de RRHH y técnicos que permiten proyectos/tecnología
const positions = [
  { id: "HR_MANAGER", name: "Gerente de RR.HH.", departmentId: "HR" },
  { id: "HR_ANALYST", name: "Analista RR.HH.", departmentId: "HR" },
  { id: "IT_DEV", name: "Desarrollador/a", departmentId: "IT" },
  { id: "IT_LEAD", name: "Líder Técnico", departmentId: "IT" },
  { id: "ADMIN_ACCOUNTANT", name: "Contador/a", departmentId: "ADMIN" },
  { id: "SALES", name: "Ejecutivo/a Comercial", departmentId: "COM" }
];

// Tres personas: admin y dos empleados con diferentes áreas y roles de ejemplo
const employees = [
  {
    id: "E-0001",
    firstName: "Laura",
    lastName: "Gómez",
    documentType: "DNI",
    documentNumber: "12345678",
    birthDate: "1985-03-20",
    email: "laura.gomez@example.com",
    phone: "+54 11 4342-1122",
    hireDate: "2018-05-12",
    terminationDate: null,
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
    documentNumber: "34444333",
    birthDate: "1993-12-11",
    email: "martin.perez@example.com",
    phone: "+54 11 4444-7788",
    hireDate: "2022-07-04",
    terminationDate: null,
    departmentId: "IT",
    positionId: "IT_DEV",
    managerId: "E-0001",
    status: "ACTIVE"
  },
  {
    id: "E-0003",
    firstName: "Ana",
    lastName: "Rodríguez",
    documentType: "CUIT",
    documentNumber: "20333221190",
    birthDate: "1990-10-05",
    email: "ana.rodriguez@example.com",
    phone: "+54 11 1111-2222",
    hireDate: "2020-01-15",
    terminationDate: "2023-11-30",
    departmentId: "ADMIN",
    positionId: "ADMIN_ACCOUNTANT",
    managerId: null,
    status: "TERMINATED"
  }
];

exports.seed = async (db, { auth }) => {
  const batch = db.batch();
  for (const { id, ...data } of departments) {
    batch.set(db.collection("departments").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  for (const { id, ...data } of positions) {
    batch.set(db.collection("positions").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  for (const { id, birthDate, hireDate, terminationDate, ...data } of employees) {
    batch.set(db.collection("employees").doc(id), {
      ...data,
      employeeNumber: id,
      birthDate: date(birthDate),
      hireDate: date(hireDate),
      terminationDate: terminationDate ? date(terminationDate) : null,
      deletedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();

  // Usuarios de ejemplo para el login técnico (admin RRHH y un empleado sólo para pruebas futuras)
  await createDemoUsers(db, auth, [
    { uid: "admin-rrhh", email: "laura.gomez@example.com", name: "Laura Gómez", role: "ADMIN", employeeId: "E-0001" },
    { uid: "empleado", email: "martin.perez@example.com", name: "Martín Pérez", role: "EMPLOYEE", employeeId: "E-0002" }
  ]);
};
