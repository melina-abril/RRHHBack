/**
 * Módulo employees: legajos ficticios activos e inactivos.
 * Depende de V1 (users): createdById identifica al administrador existente.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const employees = [
  {
    id: "E-0001",
    firstName: "Lucía",
    lastName: "Ejemplo",
    email: "lucia.ejemplo@example.com",
    category: "PERMANENT",
    country: "Argentina",
    position: "Desarrolladora",
    clientNames: ["Cliente Norte", "Cliente Sur"],
    projectNames: ["Portal Interno", "Aplicación Móvil"],
    status: "ACTIVE",
    hireDate: "2024-03-11",
    terminationDate: null,
  },
  {
    id: "E-0002",
    firstName: "Mateo",
    lastName: "Prueba",
    email: "mateo.prueba@example.com",
    category: "INTERN",
    country: "México",
    position: "Pasante de desarrollo",
    clientNames: ["Cliente Norte"],
    projectNames: ["Portal Interno"],
    status: "ACTIVE",
    hireDate: "2026-04-06",
    terminationDate: null,
  },
  {
    id: "E-0003",
    firstName: "Sofía",
    lastName: "Muestra",
    email: "sofia.muestra@example.com",
    category: "PERMANENT",
    country: "Argentina",
    position: "Analista funcional",
    clientNames: [],
    projectNames: [],
    status: "ACTIVE",
    hireDate: "2023-08-21",
    terminationDate: null,
  },
  {
    id: "E-0004",
    firstName: "Nicolás",
    lastName: "Demo",
    email: "nicolas.demo@example.com",
    category: "PERMANENT",
    country: "México",
    position: "Diseñador UX",
    clientNames: ["Cliente Sur"],
    projectNames: ["Aplicación Móvil"],
    status: "INACTIVE",
    hireDate: "2022-02-14",
    terminationDate: "2026-09-30",
  },
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, firstName, lastName, hireDate, terminationDate, ...data } of employees) {
    batch.set(db.collection("employees").doc(id), {
      ...data,
      employeeNumber: id,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      normalizedName: `${firstName} ${lastName}`.toLocaleLowerCase("es"),
      hireDate: date(hireDate),
      terminationDate: terminationDate === null ? null : date(terminationDate),
      createdById: "U-0001",
      createdAt: FieldValue.serverTimestamp(),
      deletedAt: null,
    });
  }
  await batch.commit();
};
