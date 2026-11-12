/**
 * Módulo: employee-management. Colección employees.
 * El id fijo del documento es el legajo del colaborador.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const employees = [
  {
    id: "E-0001",
    firstName: "Lucía",
    lastName: "Paredes",
    birthDate: "1994-05-17",
    residenceCountry: "Argentina",
    personalEmail: "lucia.paredes@example.com",
    hireDate: "2023-03-06",
    category: "PERMANENT",
    commitment: "FULL_TIME",
    workMode: "REMOTE",
    jobRole: "Desarrolladora de software",
    clientName: "Cliente Norte",
    projectName: "Portal interno",
    contactName: "Referente de proyecto"
  },
  {
    id: "E-0002",
    firstName: "Mateo",
    lastName: "Suárez",
    birthDate: "2001-08-22",
    residenceCountry: "México",
    personalEmail: "mateo.suarez@example.com",
    hireDate: "2025-02-10",
    category: "INTERN",
    commitment: "PART_TIME",
    workMode: "HYBRID",
    jobRole: "Analista de calidad",
    clientName: null,
    projectName: null,
    contactName: null
  },
  {
    id: "E-0003",
    firstName: "Camila",
    lastName: "Ríos",
    birthDate: "1998-11-04",
    residenceCountry: "Argentina",
    personalEmail: "camila.rios@example.com",
    hireDate: "2024-07-15",
    category: "PERMANENT",
    commitment: "FULL_TIME",
    workMode: "ON_SITE",
    jobRole: "Diseñadora de producto",
    clientName: "Cliente Sur",
    projectName: "Experiencia digital",
    contactName: "Referente de diseño"
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, birthDate, hireDate, ...data } of employees) {
    batch.set(db.collection("employees").doc(id), {
      ...data,
      employeeNumber: id,
      normalizedName: `${data.firstName} ${data.lastName}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(),
      birthDate: date(birthDate),
      hireDate: date(hireDate),
      status: "ACTIVE",
      deletedAt: null,
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
