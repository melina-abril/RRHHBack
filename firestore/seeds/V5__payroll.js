/**
 * Módulo: sueldos y bonos. Colecciones payrollPeriods, payslips y bonuses.
 * Depende de V1 (employees): todas las referencias son el legajo (employeeId) de un empleado que existe.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

const payrollPeriods = [
  // Periodos mensuales de nómina. Id: "2024-03" para Marzo 2024, etc.
  { id: "2024-03", name: "Marzo 2024", startDate: "2024-03-01", endDate: "2024-03-31", status: "CLOSED" },
  { id: "2024-04", name: "Abril 2024", startDate: "2024-04-01", endDate: "2024-04-30", status: "OPEN" }
];

const payslips = [
  // Recibos de sueldo emitidos y registrados.
  // id: PSL-0001, ...
  {
    id: "PSL-0001",
    employeeId: "E-0001",
    periodId: "2024-03",
    baseAmount: 430000,
    currency: "ARS",
    additional: 0,
    total: 430000,
    issueDate: "2024-03-31",
    status: "PAID"
  },
  {
    id: "PSL-0002",
    employeeId: "E-0002",
    periodId: "2024-03",
    baseAmount: 350000,
    currency: "ARS",
    additional: 25000,
    total: 375000,
    issueDate: "2024-03-31",
    status: "PAID"
  },
  {
    id: "PSL-0003",
    employeeId: "E-0003",
    periodId: "2024-03",
    baseAmount: 280000,
    currency: "ARS",
    additional: 0,
    total: 280000,
    issueDate: "2024-03-31",
    status: "ISSUED"
  },
  {
    id: "PSL-0004",
    employeeId: "E-0001",
    periodId: "2024-04",
    baseAmount: 430000,
    currency: "ARS",
    additional: 0,
    total: 430000,
    issueDate: "2024-04-30",
    status: "ISSUED"
  }
];

const bonuses = [
  // Bonos pagados o en proceso por desempeño, cumpleaños, capacitación o equipamiento
  // id: BON-2024-01, ...
  {
    id: "BON-2024-01",
    employeeId: "E-0001",
    periodId: "2024-06",
    concept: "PERFORMANCE_SEMESTER",
    amount: 90000,
    currency: "ARS",
    approvedBy: "E-0003",
    status: "APPROVED",
    grantDate: "2024-06-20"
  },
  {
    id: "BON-2024-02",
    employeeId: "E-0002",
    periodId: "2024-04",
    concept: "BIRTHDAY_BENEFIT",
    amount: 50000,
    currency: "ARS",
    approvedBy: "E-0001",
    status: "APPROVED",
    grantDate: "2024-04-10"
  },
  {
    id: "BON-2024-03",
    employeeId: "E-0003",
    periodId: "2024-03",
    concept: "TRAINING_BENEFIT",
    amount: 100000,
    currency: "ARS",
    approvedBy: "E-0001",
    status: "PENDING",
    grantDate: null
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, name, startDate, endDate, status } of payrollPeriods) {
    batch.set(db.collection("payrollPeriods").doc(id), {
      name,
      startDate: date(startDate),
      endDate: date(endDate),
      status, // "OPEN" | "CLOSED"
      createdAt: FieldValue.serverTimestamp()
    });
  }

  for (const {
    id,
    employeeId,
    periodId,
    baseAmount,
    currency,
    additional,
    total,
    issueDate,
    status
  } of payslips) {
    batch.set(db.collection("payslips").doc(id), {
      employeeId,
      periodId,
      baseAmount,
      currency,
      additional,
      total,
      issueDate: date(issueDate),
      status, // "ISSUED" | "PAID"
      createdAt: FieldValue.serverTimestamp()
    });
  }

  for (const {
    id,
    employeeId,
    periodId,
    concept,
    amount,
    currency,
    approvedBy,
    status,
    grantDate
  } of bonuses) {
    batch.set(db.collection("bonuses").doc(id), {
      employeeId,
      periodId,
      concept, // e.g. "PERFORMANCE_SEMESTER", "BIRTHDAY_BENEFIT", "TRAINING_BENEFIT"
      amount,
      currency,
      approvedBy,
      status, // "PENDING" | "APPROVED" | "REJECTED"
      grantDate: grantDate ? date(grantDate) : null,
      createdAt: FieldValue.serverTimestamp()
    });
  }

  await batch.commit();
};
