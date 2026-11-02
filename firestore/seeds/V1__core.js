/**
 * Colecciones compartidas: departments, positions y employees.
 * La cuenta administradora se crea en Firebase Auth y users mediante createDemoUsers.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { createDemoUsers } = require("../../scripts/demo-users");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const departments = [
  { id: "HR", name: "Recursos Humanos" },
  { id: "ENGINEERING", name: "Ingeniería" },
  { id: "DELIVERY", name: "Proyectos" },
];

const positions = [
  { id: "HR_MANAGER", name: "Responsable de Recursos Humanos", departmentId: "HR" },
  { id: "SOFTWARE_ENGINEER", name: "Ingeniero/a de software", departmentId: "ENGINEERING" },
  { id: "ENGINEERING_INTERN", name: "Pasante de ingeniería", departmentId: "ENGINEERING" },
  { id: "PROJECT_LEAD", name: "Líder de proyecto", departmentId: "DELIVERY" },
];

const employees = [
  { id: "E-0001", firstName: "Clara", lastName: "Vega", documentType: "DNI", documentNumber: "DEMO-0001", birthDate: "1988-04-12", email: "clara.vega@example.com", phone: "+54 11 0000-0001", hireDate: "2021-03-15", terminationDate: null, departmentId: "HR", positionId: "HR_MANAGER", managerId: null, status: "ACTIVE" },
  { id: "E-0002", firstName: "Nicolás", lastName: "Ríos", documentType: "DNI", documentNumber: "DEMO-0002", birthDate: "1993-09-08", email: "nicolas.rios@example.com", phone: "+54 11 0000-0002", hireDate: "2022-06-01", terminationDate: null, departmentId: "DELIVERY", positionId: "PROJECT_LEAD", managerId: "E-0001", status: "ACTIVE" },
  { id: "E-0003", firstName: "Elena", lastName: "Molina", documentType: "DNI", documentNumber: "DEMO-0003", birthDate: "1996-01-20", email: "elena.molina@example.com", phone: "+54 11 0000-0003", hireDate: "2023-02-06", terminationDate: null, departmentId: "ENGINEERING", positionId: "SOFTWARE_ENGINEER", managerId: "E-0002", status: "ACTIVE" },
  { id: "E-0004", firstName: "Tomás", lastName: "Ibarra", documentType: "DNI", documentNumber: "DEMO-0004", birthDate: "2002-11-14", email: "tomas.ibarra@example.com", phone: "+54 11 0000-0004", hireDate: "2025-08-04", terminationDate: null, departmentId: "ENGINEERING", positionId: "ENGINEERING_INTERN", managerId: "E-0002", status: "ON_LEAVE" },
  { id: "E-0005", firstName: "Sofía", lastName: "Campos", documentType: "DNI", documentNumber: "DEMO-0005", birthDate: "2000-06-23", email: "sofia.campos@example.com", phone: "+54 11 0000-0005", hireDate: "2024-01-10", terminationDate: "2025-10-31", departmentId: "ENGINEERING", positionId: "ENGINEERING_INTERN", managerId: "E-0002", status: "TERMINATED" },
];

exports.seed = async (db, { auth }) => {
  const batch = db.batch();

  for (const { id, ...data } of departments) {
    batch.set(db.collection("departments").doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  for (const { id, ...data } of positions) {
    batch.set(db.collection("positions").doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  for (const { id, birthDate, hireDate, terminationDate, ...data } of employees) {
    batch.set(db.collection("employees").doc(id), {
      ...data,
      employeeNumber: id,
      birthDate: date(birthDate),
      hireDate: date(hireDate),
      terminationDate: terminationDate === null ? null : date(terminationDate),
      deletedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();

  // Contraseña de ejemplo: Demo1234! (definida por scripts/demo-users.js).
  await createDemoUsers(db, auth, [
    { uid: "admin-rrhh", email: "clara.vega@example.com", name: "Clara Vega", role: "ADMIN", employeeId: "E-0001" },
  ]);
};
