# Módulo: gestión de empleados

## movements (subcolección de employees)

Historial laboral, acontecimientos y bitácora del colaborador. Id del documento: código `M-0001`, `M-0002`, ...

| Campo       | Tipo                                                        | Obligatorio | Descripción                                                                                         |
|-------------|-------------------------------------------------------------|-------------|-----------------------------------------------------------------------------------------------------|
| type        | string                                                      | sí          | Tipo de movimiento: `ONBOARDING`, `PROMOTION`, `ASSIGNMENT`, `TERMINATION`, `REMARK`               |
| date        | timestamp                                                   | sí          | Fecha del evento                                                                                     |
| description | string                                                      | sí          | Descripción del evento o comentario                                                                  |
| changedBy   | string → employees                                          | sí          | Legajo de quien realizó el cambio o comentario                                                       |
| details     | object \\| null                                             | no          | Datos adicionales según el tipo (ver abajo): categoría, cargo, razón, proyecto, rol, etc.           |
| createdAt   | timestamp                                                   | sí          | Fecha de registro                                                                                   |

### Ejemplo de detalles según tipo
- ONBOARDING: { category: string, positionId: string, departmentId: string }
- PROMOTION: { previousPositionId: string, newPositionId: string }
- ASSIGNMENT: { project: string, role: string }
- TERMINATION: { reason: string, previousStatus: string, newStatus: string }
- REMARK: null


Índices: `employeeId` + `date` desc (historial por colaborador).
