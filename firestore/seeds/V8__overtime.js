/**
 * Módulo: Horas Extras. Colección overtimeRequests (registro de horas extras).
 * Depende de V1__core.js: employees (legajo E-0001...E-0005).
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const overtimeRequests = [
  {
    id: "OT-202401",
    employeeId: "E-0002",
    month: "2024-01",
    requestedById: "E-0002",
    leaderId: "E-0001",
    directorId: "E-0005",
    status: "PENDING_APPROVAL",
    requestedHours: 8,
    authorizedHours: null,
    workedHours: null,
    compensationHours: null,
    compensationStatus: null,
    comments: "Trabajo extra cierre proyecto Alfa"
  },
  {
    id: "OT-202402",
    employeeId: "E-0003",
    month: "2024-02",
    requestedById: "E-0003",
    leaderId: "E-0001",
    directorId: "E-0005",
    status: "AUTHORIZED",
    requestedHours: 5,
    authorizedHours: 4,
    workedHours: 4,
    compensationHours: 4,
    compensationStatus: "COMPENSATED",
    comments: "Soporte fuera de horario para capacitación"
  },
  {
    id: "OT-202403",
    employeeId: "E-0004",
    month: "2024-03",
    requestedById: "E-0004",
    leaderId: "E-0003",
    directorId: "E-0005",
    status: "REJECTED",
    requestedHours: 6,
    authorizedHours: 0,
    workedHours: 0,
    compensationHours: 0,
    compensationStatus: null,
    comments: "No autorizado por Director por carga excesiva"
  },
  {
    id: "OT-202404",
    employeeId: "E-0002",
    month: "2024-04",
    requestedById: "E-0002",
    leaderId: "E-0001",
    directorId: "E-0005",
    status: "COMPENSATION_PENDING",
    requestedHours: 4,
    authorizedHours: 4,
    workedHours: 3,
    compensationHours: 2,
    compensationStatus: "PENDING",
    comments: null
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, ...data } of overtimeRequests) {
    batch.set(db.collection("overtimeRequests").doc(id), {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
