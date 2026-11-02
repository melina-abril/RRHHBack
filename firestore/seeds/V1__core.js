/**
 * Core: colecciones compartidas por todos los módulos (departments, positions, employees) y los usuarios de
 * ejemplo para entrar (Firebase Auth + users/{uid} con su rol). Los roles son los MISMOS códigos que usan el
 * backend (requireRole) y el front (APP_ROLES).
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { createDemoUsers } = require("../../scripts/demo-users");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const departments = [
  { id: "HR", name: "Recursos Humanos" },
  { id: "IT", name: "Tecnología" },
  { id: "ADMIN", name: "Administración" },
  { id: "SALES", name: "Ventas" }
];

const positions = [
  { id: "HR_MANAGER", name: "Gerente de RR.HH.", departmentId: "HR" },
  { id: "HR_ANALYST", name: "Analista de RR.HH.", departmentId: "HR" },
  { id: "IT_MANAGER", name: "Líder de Tecnología", departmentId: "IT" },
  { id: "DEVELOPER", name: "Desarrollador/a", departmentId: "IT" },
  { id: "ADMIN_ASSISTANT", name: "Asistente de Administración", departmentId: "ADMIN" },
  { id: "SALES_EXECUTIVE", name: "Ejecutivo/a de Ventas", departmentId: "SALES" }
];

const employees = [
  {
    id: "E-0001",
    firstName: "Laura",
    lastName: "Gómez",
    documentType: "DNI",
    documentNumber: "30123456",
    birthDate: "1990-02-03",
    email: "laura.gomez@example.com",
    phone: "+54 11 5555-1001",
    hireDate: "2020-05-01",
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
    documentNumber: "33111222",
    birthDate: "1988-07-15",
    email: "martin.perez@example.com",
    phone: "+54 11 5555-2002",
    hireDate: "2021-01-10",
    terminationDate: null,
    departmentId: "IT",
    positionId: "DEVELOPER",
    managerId: "E-0001",
    status: "ACTIVE"
  },
  {
    id: "E-0003",
    firstName: "Analía",
    lastName: "Torres",
    documentType: "DNI",
    documentNumber: "34123456",
    birthDate: "1992-03-21",
    email: "analia.torres@example.com",
    phone: "+54 11 5555-3003",
    hireDate: "2022-03-15",
    terminationDate: null,
    departmentId: "HR",
    positionId: "HR_ANALYST",
    managerId: "E-0001",
    status: "ACTIVE"
  },
  {
    id: "E-0004",
    firstName: "Sofía",
    lastName: "Morel",
    documentType: "DNI",
    documentNumber: "35123456",
    birthDate: "1994-12-09",
    email: "sofia.morel@example.com",
    phone: "+54 11 5555-4004",
    hireDate: "2022-08-01",
    terminationDate: "2024-02-29",
    departmentId: "IT",
    positionId: "DEVELOPER",
    managerId: "E-0003",
    status: "TERMINATED"
  },
  {
    id: "E-0005",
    firstName: "Diego",
    lastName: "Alvarez",
    documentType: "CUIT",
    documentNumber: "20333123458",
    birthDate: "1985-10-11",
    email: "diego.alvarez@example.com",
    phone: "+54 11 5555-5005",
    hireDate: "2019-06-01",
    terminationDate: null,
    departmentId: "ADMIN",
    positionId: "ADMIN_ASSISTANT",
    managerId: null,
    status: "ACTIVE"
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
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();

  await createDemoUsers(db, auth, [
    { uid: "admin-rrhh", email: "laura.gomez@example.com", name: "Laura Gómez", role: "ADMIN", employeeId: "E-0001" },
    { uid: "empleado", email: "martin.perez@example.com", name: "Martín Pérez", role: "EMPLOYEE", employeeId: "E-0002" },
    { uid: "analista-rrhh", email: "analia.torres@example.com", name: "Analía Torres", role: "HR_ANALYST", employeeId: "E-0003" }
  ]);
};
