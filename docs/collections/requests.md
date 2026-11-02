# Módulo: Solicitudes

## vacationRequests

Solicitudes de vacaciones realizadas por colaboradores a través de formularios externos. Id del documento: VR-0001, VR-0002…

| Campo         | Tipo       | Obligatorio | Descripción                                                     |
|---------------|------------|-------------|-----------------------------------------------------------------|
| employeeId    | string → employees | sí    | Legajo del colaborador que realiza la solicitud                 |
| startDate     | timestamp  | sí          | Fecha de inicio de las vacaciones                               |
| endDate       | timestamp  | sí          | Fecha de finalización de las vacaciones (>= startDate)          |
| days          | number     | sí          | Días hábiles solicitados (> 0)                                  |
| status        | string     | sí          | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`                 |
| reason        | string | null | no   | Motivo de la solicitud o de la decisión de RH                  |
| submittedAt   | timestamp  | sí          | Fecha de envío de la solicitud                                  |
| decidedAt     | timestamp | null | no | Fecha de decisión (aprobación/rechazo/ cancelación)           |
| approverId    | string → employees | null | no | Legajo de quien aprobó/rechazó la solicitud         |
| deletedAt     | timestamp  | no          | Borrado lógico (null si vigente)                                |

Índices: `employeeId` + `startDate` desc (historial del colaborador).

## leaveRequests

Solicitudes de licencias no vacaciones (estudio, mudanza, médica u otra). Id del documento: LR-0001, LR-0002…

| Campo         | Tipo       | Obligatorio | Descripción                                                     |
|---------------|------------|-------------|-----------------------------------------------------------------|
| employeeId    | string → employees | sí    | Legajo del colaborador que realiza la solicitud                 |
| leaveType     | string     | sí          | `STUDY`, `MOVING`, `MEDICAL`, `OTHER`                          |
| startDate     | timestamp  | sí          | Fecha de inicio de la licencia                                  |
| endDate       | timestamp  | sí          | Fecha de fin de la licencia                                     |
| days          | number     | sí          | Días solicitados (> 0)                                          |
| status        | string     | sí          | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`                 |
| reason        | string | null | no   | Motivo de la licencia o comentario del área RH                 |
| submittedAt   | timestamp  | sí          | Fecha de envío de la solicitud                                  |
| decidedAt     | timestamp | null | no | Fecha de decisión (aprobación/rechazo/cancelación)            |
| approverId    | string → employees | null | no | Legajo de quien aprobó/rechazó la solicitud         |
| documentation | string | null | no   | URL o referencia al documento adjunto presentado               |
| deletedAt     | timestamp  | no          | Borrado lógico                                                  |

Índices: `employeeId` + `startDate` desc (historial del colaborador).

## absenceRequests

Solicitudes de ausencias justificadas (imprevistas, permisos, inasistencias justificadas). Id del documento: AR-0001, AR-0002…

| Campo         | Tipo       | Obligatorio | Descripción                                                     |
|---------------|------------|-------------|-----------------------------------------------------------------|
| employeeId    | string → employees | sí    | Legajo del colaborador que realiza la solicitud                 |
| type          | string     | sí          | `UNPLANNED`, `PERMISSION`, `JUSTIFIED_ABSENCE`                 |
| date          | timestamp  | sí          | Fecha de la ausencia                                            |
| hours         | number | null | no   | Cantidad de horas (si corresponde, para permisos parciales)     |
| status        | string     | sí          | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`                 |
| reason        | string | null | no   | Motivo                                                        |
| submittedAt   | timestamp  | sí          | Fecha de envío de la solicitud                                  |
| decidedAt     | timestamp | null | no | Fecha de decisión                                              |
| approverId    | string → employees | null | no | Quién decide la solicitud                            |
| deletedAt     | timestamp  | no          | Borrado lógico                                                  |

Índices: `employeeId` + `date` desc
