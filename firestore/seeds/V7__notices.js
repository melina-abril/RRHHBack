/**
 * Módulo: comunicados. Colección notices.
 * Depende de V1 (employees): las referencias son el id del empleado (legajo), que ya existe.
 */
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const date = (value) => Timestamp.fromDate(new Date(`${value}T00:00:00Z`));

/**
 * Demostrativos: legajos E-0001 (admin), E-0002 (empleado), E-0003 (analista RRHH), E-0005 (admin asistente).
 * Los comunicados pueden ir a todos o a un subconjunto de empleados.
 */
const notices = [
  {
    id: "N-0001",
    subject: "Nuevo beneficio de salud",
    body: "Informamos que a partir de julio los colaboradores podrán acceder a un nuevo plan de cobertura médica adicional. Para más información, consultar a Recursos Humanos.",
    sentById: "E-0001",
    sentByName: "Laura Gómez",
    targetEmployeeIds: ["E-0002", "E-0003", "E-0005"],
    targetDepartments: ["IT", "ADMIN"],
    sentAt: "2024-06-07",
    deliveryState: "SENT", // SENT | ERROR | DRAFT
    deliveryResult: "Enviado a 3 colaboradores sin errores.",
    errors: []
  },
  {
    id: "N-0002",
    subject: "Aviso de vacaciones colectivas",
    body: "La empresa permanecerá cerrada por receso del 23/12/2024 al 01/01/2025 incluido. Los servicios críticos se coordinarán con cada responsable. ¡Felices Fiestas!",
    sentById: "E-0003",
    sentByName: "Analía Torres",
    targetEmployeeIds: ["E-0002", "E-0003", "E-0005"],
    targetDepartments: ["HR", "IT", "ADMIN", "SALES"],
    sentAt: "2024-12-01",
    deliveryState: "SENT",
    deliveryResult: "Todos los destinatarios recibieron el aviso correctamente.",
    errors: []
  },
  {
    id: "N-0003",
    subject: "Recordatorio declaración jurada",
    body: "Les recordamos completar la declaración jurada anual antes del 15/08/2024. Contactar administracion para consultas.",
    sentById: "E-0005",
    sentByName: "Diego Alvarez",
    targetEmployeeIds: ["E-0001", "E-0002", "E-0003", "E-0005"],
    targetDepartments: null,
    sentAt: "2024-07-20",
    deliveryState: "SENT",
    deliveryResult: "Enviados 4 correos, 1 error (martin.perez@example.com rechazado)",
    errors: [
      { employeeId: "E-0002", email: "martin.perez@example.com", message: "El correo electrónico fue rechazado por el servidor." }
    ]
  },
  {
    id: "N-0004",
    subject: "Próxima capacitación de LinkedIn",
    body: "Invitamos a sumarse a la capacitación sobre uso profesional de LinkedIn el martes 18/06. Cupos limitados.",
    sentById: "E-0003",
    sentByName: "Analía Torres",
    targetEmployeeIds: ["E-0002"],
    targetDepartments: ["IT"],
    sentAt: null,
    deliveryState: "DRAFT",
    deliveryResult: null,
    errors: null
  }
];

exports.seed = async (db) => {
  const batch = db.batch();
  for (const { id, sentAt, ...data } of notices) {
    batch.set(db.collection("notices").doc(id), {
      ...data,
      sentAt: sentAt ? date(sentAt) : null,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
};
