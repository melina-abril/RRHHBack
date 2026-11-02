/**
 * Módulo: Solicitudes. Colecciones vacationRequests, leaveRequests y absenceRequests.
 * Depende de V1 (employees): las referencias se basan en legajos ya existentes. Usa solo ids y legajos reales del core.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const vacationRequests = [
  {
    id: "VR-0001",
    employeeId: "E-0002",
    startDate: "2024-07-01",
    endDate: "2024-07-10",
    days: 8,
    status: "APPROVED",
    reason: "Vacaciones de invierno",
    submittedAt: "2024-05-15",
    decidedAt: "2024-05-16",
    approverId: "E-0003",
    deletedAt: null
  },
  {
    id: "VR-0002",
    employeeId: "E-0003",
    startDate: "2024-09-02",
    endDate: "2024-09-06",
    days: 5,
    status: "PENDING",
    reason: "",
    submittedAt: "2024-08-20",
    decidedAt: null,
    approverId: null,
    deletedAt: null
  },
  {
    id: "VR-0003",
    employeeId: "E-0001",
    startDate: "2024-12-23",
    endDate: "2025-01-02",
    days: 8,
    status: "REJECTED",
    reason: "Vacaciones ya solicitadas para ese rango",
    submittedAt: "2024-11-10",
    decidedAt: "2024-11-18",
    approverId: "E-0003",
    deletedAt: null
  }
];

const leaveRequests = [
  {
    id: "LR-0001",
    employeeId: "E-0002",
    leaveType: "STUDY",
    startDate: "2024-07-16",
    endDate: "2024-07-18",
    days: 3,
    status: "APPROVED",
    reason: "Exámenes finales",
    submittedAt: "2024-07-01",
    decidedAt: "2024-07-02",
    approverId: "E-0003",
    documentation: "https://example.com/docs/certificado-examen.pdf",
    deletedAt: null
  },
  {
    id: "LR-0002",
    employeeId: "E-0004",
    leaveType: "MEDICAL",
    startDate: "2024-08-05",
    endDate: "2024-08-08",
    days: 4,
    status: "PENDING",
    reason: null,
    submittedAt: "2024-07-29",
    decidedAt: null,
    approverId: null,
    documentation: null,
    deletedAt: null
  },
  {
    id: "LR-0003",
    employeeId: "E-0001",
    leaveType: "MOVING",
    startDate: "2024-06-12",
    endDate: "2024-06-12",
    days: 1,
    status: "APPROVED",
    reason: "Mudanza de domicilio",
    submittedAt: "2024-06-01",
    decidedAt: "2024-06-05",
    approverId: "E-0003",
    documentation: null,
    deletedAt: null
  }
];

const absenceRequests = [
  {
    id: "AR-0001",
    employeeId: "E-0003",
    type: "UNPLANNED",
    date: "2024-03-17",
    hours: 6,
    status: "APPROVED",
    reason: "Enfermedad leve",
    submittedAt: "2024-03-17",
    decidedAt: "2024-03-18",
    approverId: "E-0001",
    deletedAt: null
  },
  {
    id: "AR-0002",
    employeeId: "E-0005",
    type: "PERMISSION",
    date: "2024-05-10",
    hours: 3,
    status: "PENDING",
    reason: "Permiso personal",
    submittedAt: "2024-05-05",
    decidedAt: null,
    approverId: null,
    deletedAt: null
  },
  {
    id: "AR-0003",
    employeeId: "E-0002",
    type: "JUSTIFIED_ABSENCE",
    date: "2024-04-20",
    hours: null,
    status: "REJECTED",
    reason: "No corresponde justificar la ausencia",
    submittedAt: "2024-04-21",
    decidedAt: "2024-04-23",
    approverId: "E-0001",
    deletedAt: null
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, startDate, endDate, submittedAt, decidedAt, ...data } of vacationRequests) {
    batch.set(db.collection("vacationRequests").doc(id), {
      ...data,
      startDate: date(startDate),
      endDate: date(endDate),
      submittedAt: date(submittedAt),
      decidedAt: decidedAt ? date(decidedAt) : null,
      createdAt: FieldValue.serverTimestamp()
    });
  }
  for (const { id, startDate, endDate, submittedAt, decidedAt, ...data } of leaveRequests) {
    batch.set(db.collection("leaveRequests").doc(id), {
      ...data,
      startDate: date(startDate),
      endDate: date(endDate),
      submittedAt: date(submittedAt),
      decidedAt: decidedAt ? date(decidedAt) : null,
      createdAt: FieldValue.serverTimestamp()
    });
  }
  for (const { id, date: absenceDate, submittedAt, decidedAt, ...data } of absenceRequests) {
    batch.set(db.collection("absenceRequests").doc(id), {
      ...data,
      date: date(absenceDate),
      submittedAt: date(submittedAt),
      decidedAt: decidedAt ? date(decidedAt) : null,
      createdAt: FieldValue.serverTimestamp()
    });
  }
  await batch.commit();
};
