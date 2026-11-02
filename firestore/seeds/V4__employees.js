/**
 * Módulo: empleados. Subcolección movements bajo employees/{id}.
 * Organiza el historial laboral y la bitácora, con eventos de alta, egreso, reingreso, asignación, documentación y seguimiento.
 * Depende de V1 (core): los legajos y ids de employees existen y se referencian aquí.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

/**
 * Movimientos históricos y bitácora, uno por evento: alta, egreso, reingreso, cambio de categoría o asignación,
 * hecho relevante o comentario, identidad, documentos adjuntos, evaluaciones, beneficios y remuneraciones.
 *
 * Se cargan como subcolección de employees: employees/{employeeId}/movements/{id}.
 * El campo type indica el tipo de movimiento; los campos adicionales dependen del tipo.
 */
const movements = [
  {
    id: "M-0001",
    employeeId: "E-0001",
    type: "ONBOARDING",
    date: "2020-05-01",
    description: "Alta de colaborador. Ingreso como Gerente de RR.HH.",
    changedBy: "E-0001",
    details: {
      category: "PERMANENT",
      positionId: "HR_MANAGER",
      departmentId: "HR"
    }
  },
  {
    id: "M-0002",
    employeeId: "E-0002",
    type: "ONBOARDING",
    date: "2021-01-10",
    description: "Ingreso a IT como Desarrollador/a.",
    changedBy: "E-0001",
    details: {
      category: "PERMANENT",
      positionId: "DEVELOPER",
      departmentId: "IT"
    }
  },
  {
    id: "M-0003",
    employeeId: "E-0003",
    type: "ONBOARDING",
    date: "2022-03-15",
    description: "Ingreso como Analista de RR.HH.",
    changedBy: "E-0001",
    details: {
      category: "PERMANENT",
      positionId: "HR_ANALYST",
      departmentId: "HR"
    }
  },
  {
    id: "M-0004",
    employeeId: "E-0004",
    type: "TERMINATION",
    date: "2024-02-29",
    description: "Egreso por finalización de contrato.",
    changedBy: "E-0003",
    details: {
      reason: "Fin de proyecto",
      previousStatus: "ACTIVE",
      newStatus: "TERMINATED"
    }
  },
  {
    id: "M-0005",
    employeeId: "E-0001",
    type: "PROMOTION",
    date: "2023-07-01",
    description: "Promoción interna a Gerente de RR.HH.",
    changedBy: "E-0005",
    details: {
      previousPositionId: "HR_ANALYST",
      newPositionId: "HR_MANAGER"
    }
  },
  {
    id: "M-0006",
    employeeId: "E-0002",
    type: "ASSIGNMENT",
    date: "2023-04-10",
    description: "Nueva asignación a proyecto externo.",
    changedBy: "E-0001",
    details: {
      project: "Proyecto Phoenix",
      role: "Desarrollador principal"
    }
  },
  {
    id: "M-0007",
    employeeId: "E-0003",
    type: "REMARK",
    date: "2022-11-11",
    description: "Reconocimiento de desempeño destacado en onboarding de nuevos empleados.",
    changedBy: "E-0001",
    details: null
  }
];

exports.seed = async (db) => {
  for (const { id, employeeId, date: dateString, type, description, changedBy, details } of movements) {
    await db
      .collection("employees")
      .doc(employeeId)
      .collection("movements")
      .doc(id)
      .set({
        type,
        date: date(dateString),
        description,
        changedBy,
        details: details || null,
        createdAt: FieldValue.serverTimestamp(),
      });
  }
};
