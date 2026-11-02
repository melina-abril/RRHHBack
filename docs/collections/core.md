# Colecciones compartidas

## users

Sesión de la cuenta administradora de Recursos Humanos. Id del documento: uid de Firebase Auth (`admin-rrhh`). Se crea exclusivamente mediante `createDemoUsers`; los colaboradores no tienen cuentas administrativas. Usuario de ejemplo: `clara.vega@example.com`, contraseña `Demo1234!`.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| email | string | sí | Correo de inicio de sesión |
| name | string | sí | Nombre visible |
| role | string | sí | Rol: `ADMIN` |
| employeeId | string → employees \| null | no | Legajo asociado |
| active | boolean | sí | Cuenta habilitada |
| createdAt | timestamp | sí | Alta del documento |

## departments

Áreas compartidas. Id del documento: código del área (`HR`, `ENGINEERING`, `DELIVERY`).

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible del área |
| createdAt | timestamp | sí | Alta del documento |

## positions

Puestos compartidos. Id del documento: código del puesto (`HR_MANAGER`, `SOFTWARE_ENGINEER`, `ENGINEERING_INTERN`, `PROJECT_LEAD`).

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible del puesto |
| departmentId | string → departments | sí | Área a la que pertenece |
| createdAt | timestamp | sí | Alta del documento |

## employees

Legajos compartidos entre módulos. Id del documento: número de legajo (`E-0001` a `E-0005`). La baja laboral conserva el legajo; `deletedAt` se reserva para el borrado lógico.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| employeeNumber | string | sí | Número de legajo, igual al id del documento |
| firstName | string | sí | Nombre |
| lastName | string | sí | Apellido |
| documentType | string | sí | Tipo de documento |
| documentNumber | string | sí | Número de documento ficticio |
| birthDate | timestamp | sí | Fecha de nacimiento |
| email | string | sí | Correo del colaborador |
| phone | string | sí | Teléfono de ejemplo |
| hireDate | timestamp | sí | Fecha de ingreso registrada |
| terminationDate | timestamp \| null | no | Fecha del egreso, si corresponde |
| departmentId | string → departments | sí | Área vigente |
| positionId | string → positions | sí | Puesto vigente |
| managerId | string → employees \| null | no | Legajo del responsable |
| status | string | sí | Estado: `ACTIVE`, `ON_LEAVE` o `TERMINATED` |
| deletedAt | timestamp \| null | no | Fecha de borrado lógico |
| createdAt | timestamp | sí | Alta del documento |
| updatedAt | timestamp | sí | Última actualización |

Índices: no se requieren índices compuestos para estas colecciones en el core; Firestore crea automáticamente los índices de campo individual.
