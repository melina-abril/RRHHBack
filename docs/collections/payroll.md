# Módulo: sueldos y bonos

## payrollPeriods

Períodos mensuales de liquidación de sueldos. Id del documento: período, por ejemplo `2024-03` para marzo 2024.

| Campo      | Tipo      | Obligatorio | Descripción                                              |
|------------|-----------|-------------|----------------------------------------------------------|
| name       | string    | sí          | Nombre visible del período ("Marzo 2024")               |
| startDate  | timestamp | sí          | Fecha de inicio del período                              |
| endDate    | timestamp | sí          | Fecha de fin del período                                 |
| status     | string    | sí          | `OPEN` o `CLOSED` (abierto/cerrado para edición y pagos) |
| createdAt  | timestamp | sí          | Alta del documento                                       |

## payslips

Recibos de sueldo emitidos para colaboradores (incluye ordinarios y excepciones). Id del documento: `PSL-0001`, `PSL-0002`...

| Campo       | Tipo      | Obligatorio | Descripción                                                    |
|-------------|-----------|-------------|----------------------------------------------------------------|
| employeeId  | string → employees | sí    | Legajo de quien recibe                                         |
| periodId    | string → payrollPeriods | sí | Período al que corresponde                                    |
| baseAmount  | number    | sí          | Sueldo base del período (importe habitual)                     |
| currency    | string    | sí          | Moneda (`ARS`, `USD`, etc.)                                    |
| additional  | number    | sí          | Importe adicional para excepciones o conceptos extraordinarios  |
| total       | number    | sí          | Total a abonar (base + adicionales, o reemplazo total)         |
| issueDate   | timestamp | sí          | Fecha de emisión                                               |
| status      | string    | sí          | `ISSUED` o `PAID`                                              |
| createdAt   | timestamp | sí          | Alta del documento                                             |

## bonuses

Bonos registrados (desempeño, cumpleaños, capacitación, equipamiento, etc.). Id del documento: `BON-2024-01`, `BON-2024-02`...

| Campo       | Tipo      | Obligatorio | Descripción                                                              |
|-------------|-----------|-------------|--------------------------------------------------------------------------|
| employeeId  | string → employees | sí    | Legajo de quien recibe                                                   |
| periodId    | string → payrollPeriods | sí | Período de liquidación o consideración del bono                          |
| concept     | string    | sí          | Concepto (`PERFORMANCE_SEMESTER`, `BIRTHDAY_BENEFIT`, `TRAINING_BENEFIT`, `EQUIPMENT_BENEFIT`) |
| amount      | number    | sí          | Importe bruto del bono                                                   |
| currency    | string    | sí          | Moneda                                                                   |
| approvedBy  | string → employees | sí    | Legajo de quien aprobó (null si pendiente)                               |
| status      | string    | sí          | `PENDING`, `APPROVED` o `REJECTED`                                       |
| grantDate   | timestamp | no          | Fecha de otorgamiento                                                    |
| createdAt   | timestamp | sí          | Alta del documento                                                       |

Índices: employeeId + periodId (pagos e historial de un empleado por período).
