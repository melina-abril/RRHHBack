# Módulo: Horas Extras

## overtimeRequests

Solicitudes y registro de horas extras. Id del documento: código mensual (`OT-202401`, `OT-202402`...).

| Campo               | Tipo                              | Obligatorio | Descripción                                                                                   |
|---------------------|-----------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| employeeId          | string → employees                | sí          | Legajo del colaborador que solicita                                                           |
| month               | string (YYYY-MM)                  | sí          | Mes de la solicitud                                                                           |
| requestedById       | string → employees                | sí          | Quién inició la solicitud                                                                     |
| leaderId            | string → employees                | sí          | Líder que registra                                                                            |
| directorId          | string → employees                | sí          | Director autorizado                                                                           |
| status              | string                            | sí          | Estado (`PENDING_APPROVAL`, `AUTHORIZED`, `REJECTED`, `COMPENSATION_PENDING`, `COMPENSATED`)  |
| requestedHours      | number                            | sí          | Cantidad de horas solicitadas                                                                 |
| authorizedHours     | number | null                      | no          | Horas autorizadas (si aplica)                                                                 |
| workedHours         | number | null                      | no          | Horas realmente trabajadas (si aplica)                                                        |
| compensationHours   | number | null                      | no          | Horas compensadas (si aplica)                                                                 |
| compensationStatus  | string | null                      | no          | Estado compensación (`PENDING`, `COMPENSATED` o null)                                         |
| comments            | string | null                      | no          | Comentarios o motivo                                                                          |
| createdAt           | timestamp                         | sí          | Alta del documento                                                                            |
| updatedAt           | timestamp                         | sí          | Última modificación                                                                           |

Estados (`status`):
- `PENDING_APPROVAL`: solicitada, pendiente de autorización.
- `AUTHORIZED`: autorizada por líder/director, puede trabajarse.
- `REJECTED`: rechazada, no se realiza.
- `COMPENSATION_PENDING`: trabajada, pendiente de compensación.
- `COMPENSATED`: compensada y contabilizada en el saldo.

Estados de compensación (`compensationStatus`):
- `PENDING`, `COMPENSATED` o `null` (si aún no aplica).

Índices: `employeeId` + `month` desc (historial y saldo por colaborador).