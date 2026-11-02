/**
 * Clientes, países vinculados, proyectos, referentes y asignaciones.
 * Depende de V1: employees y users ya existen.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));
const instant = (value) => Timestamp.fromDate(new Date(value));

const clients = [
  { id: "CL-0001", name: "Nexo Digital", active: true },
  { id: "CL-0002", name: "Andes Comercio", active: true },
  { id: "CL-0003", name: "Horizonte Salud", active: false },
];

const clientCountries = [
  { id: "CC-0001", clientId: "CL-0001", countryCode: "AR", countryName: "Argentina" },
  { id: "CC-0002", clientId: "CL-0001", countryCode: "MX", countryName: "México" },
  { id: "CC-0003", clientId: "CL-0002", countryCode: "AR", countryName: "Argentina" },
  { id: "CC-0004", clientId: "CL-0003", countryCode: "MX", countryName: "México" },
];

const projects = [
  { id: "PR-0001", clientId: "CL-0001", name: "Portal de servicios", clientCountryIds: ["CC-0001", "CC-0002"], active: true },
  { id: "PR-0002", clientId: "CL-0002", name: "Plataforma comercial", clientCountryIds: ["CC-0003"], active: true },
  { id: "PR-0003", clientId: "CL-0003", name: "Integración clínica", clientCountryIds: ["CC-0004"], active: false },
];

const projectContacts = [
  { id: "PC-0001", projectId: "PR-0001", name: "Lucía Torres", email: "lucia.torres@example.com", active: true },
  { id: "PC-0002", projectId: "PR-0002", name: "Mateo Silva", email: "mateo.silva@example.com", active: true },
  { id: "PC-0003", projectId: "PR-0003", name: "Ana Duarte", email: "ana.duarte@example.com", active: false },
];

const projectAssignments = [
  { id: "PA-0001", employeeId: "E-0003", clientId: "CL-0001", clientName: "Nexo Digital", projectId: "PR-0001", projectName: "Portal de servicios", clientCountryId: "CC-0001", countryName: "Argentina", contactId: "PC-0001", contactName: "Lucía Torres", role: "Referente técnica", startDate: "2024-03-01", endDate: null, status: "ACTIVE" },
  { id: "PA-0002", employeeId: "E-0003", clientId: "CL-0002", clientName: "Andes Comercio", projectId: "PR-0002", projectName: "Plataforma comercial", clientCountryId: "CC-0003", countryName: "Argentina", contactId: "PC-0002", contactName: "Mateo Silva", role: "Desarrolladora", startDate: "2025-02-03", endDate: null, status: "ACTIVE" },
  { id: "PA-0003", employeeId: "E-0002", clientId: "CL-0003", clientName: "Horizonte Salud", projectId: "PR-0003", projectName: "Integración clínica", clientCountryId: "CC-0004", countryName: "México", contactId: "PC-0003", contactName: "Ana Duarte", role: "Líder de proyecto", startDate: "2023-05-01", endDate: "2024-12-20", status: "ENDED" },
  { id: "PA-0004", employeeId: "E-0004", clientId: "CL-0001", clientName: "Nexo Digital", projectId: "PR-0001", projectName: "Portal de servicios", clientCountryId: "CC-0002", countryName: "México", contactId: null, contactName: null, role: "Pasante de desarrollo", startDate: "2025-09-01", endDate: null, status: "ACTIVE" },
];

const snapshot = (assignment) => ({
  employeeId: assignment.employeeId,
  clientId: assignment.clientId,
  clientName: assignment.clientName,
  projectId: assignment.projectId,
  projectName: assignment.projectName,
  clientCountryId: assignment.clientCountryId,
  countryName: assignment.countryName,
  contactId: assignment.contactId,
  contactName: assignment.contactName,
  role: assignment.role,
  startDate: date(assignment.startDate),
  endDate: assignment.endDate === null ? null : date(assignment.endDate),
  status: assignment.status,
});

const [first, second, third, fourth] = projectAssignments;
const firstBeforeEdit = { ...first, role: "Desarrolladora" };
const thirdBeforeEnd = { ...third, endDate: null, status: "ACTIVE" };

const assignmentEvents = [
  { id: "AE-0001", assignmentId: first.id, action: "CREATED", occurredAt: "2024-03-01T14:00:00Z", beforeValues: null, afterValues: snapshot(firstBeforeEdit) },
  { id: "AE-0002", assignmentId: second.id, action: "CREATED", occurredAt: "2025-02-03T14:00:00Z", beforeValues: null, afterValues: snapshot(second) },
  { id: "AE-0003", assignmentId: third.id, action: "CREATED", occurredAt: "2023-05-01T14:00:00Z", beforeValues: null, afterValues: snapshot(thirdBeforeEnd) },
  { id: "AE-0004", assignmentId: third.id, action: "ENDED", occurredAt: "2024-12-20T14:00:00Z", beforeValues: snapshot(thirdBeforeEnd), afterValues: snapshot(third) },
  { id: "AE-0005", assignmentId: fourth.id, action: "CREATED", occurredAt: "2025-09-01T14:00:00Z", beforeValues: null, afterValues: snapshot(fourth) },
  { id: "AE-0006", assignmentId: first.id, action: "UPDATED", occurredAt: "2025-11-03T14:00:00Z", beforeValues: snapshot(firstBeforeEdit), afterValues: snapshot(first) },
];

exports.seed = async (db, { auth }) => {
  // El usuario responsable admin-rrhh fue creado por V1; este módulo no crea usuarios.
  void auth;
  const batch = db.batch();

  for (const { id, ...data } of clients) {
    batch.set(db.collection("clients").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  for (const { id, ...data } of clientCountries) {
    batch.set(db.collection("clientCountries").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  for (const { id, ...data } of projects) {
    batch.set(db.collection("projects").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  for (const { id, ...data } of projectContacts) {
    batch.set(db.collection("projectContacts").doc(id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  for (const { id, startDate, endDate, ...data } of projectAssignments) {
    batch.set(db.collection("projectAssignments").doc(id), {
      ...data,
      startDate: date(startDate),
      endDate: endDate === null ? null : date(endDate),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
  for (const { id, occurredAt, ...data } of assignmentEvents) {
    batch.set(db.collection("assignmentEvents").doc(id), {
      ...data,
      actorUserId: "admin-rrhh",
      occurredAt: instant(occurredAt),
      createdAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
};
