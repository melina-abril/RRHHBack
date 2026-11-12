# Core: colecciones compartidas

## users

Cuenta administrativa utilizada por la autenticación y la auditoría. Id del documento: `U-0001`. La carga inicial contiene una sola cuenta con rol `ADMIN`. Su contraseña de demostración es `Demo1234!`, almacenada únicamente como hash bcrypt; debe cambiarse antes de usar el sistema fuera del emulador. Para crear o restablecer una cuenta en otro entorno se utiliza `npm run create-admin`.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible |
| email | string | sí | Correo en minúsculas; debe ser único |
| passwordHash | string | sí | Hash bcrypt de la contraseña |
| role | string | sí | Código de rol: `ADMIN` |
| active | boolean | sí | Indica si la cuenta puede iniciar sesión |
| createdAt | timestamp | sí | Alta del documento |

## employees

Colaboradores consultados desde el inicio y la gestión de empleados. Id del documento: legajo único (`E-0001`, `E-0002`…). Un colaborador inactivo conserva su ficha: `status` y `deletedAt` representan situaciones distintas. Los datos de cliente, proyecto y referente inicial son textos opcionales, no referencias a otras colecciones.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| employeeNumber | string | sí | Legajo único; coincide con el id del documento |
| firstName | string | sí | Nombre |
| lastName | string | sí | Apellido |
| birthDate | timestamp | sí | Fecha de nacimiento |
| residenceCountry | string | sí | País de residencia |
| personalEmail | string | sí | Correo personal ficticio en los datos de ejemplo |
| startDate | timestamp | sí | Fecha de ingreso |
| category | string | sí | `PERMANENT` o `INTERN` |
| dedication | string | sí | `FULL_TIME` o `PART_TIME` |
| workMode | string | sí | `REMOTE`, `HYBRID` u `ONSITE` |
| jobRole | string | sí | Puesto laboral |
| status | string | sí | `ACTIVE` o `INACTIVE` |
| initialClient | string \| null | no | Cliente inicial, si se conoce |
| initialProject | string \| null | no | Proyecto inicial, si se conoce |
| initialManager | string \| null | no | Referente inicial, si se conoce |
| createdById | string → users | sí | Id de la cuenta que registró el alta |
| createdAt | timestamp | sí | Alta del documento |
| deletedAt | timestamp \| null | no | Fecha de borrado lógico; un egreso no borra la ficha |

Índices compuestos: ninguno requerido por esta carga inicial.
