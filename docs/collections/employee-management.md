# Módulo: employee-management

## employees

Colaboradores y sus datos de alta. Id del documento: legajo fijo (`E-0001`, `E-0002`…). El legajo se conserva ante un eventual reingreso.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| employeeNumber | string | sí | Legajo único, igual al id del documento |
| firstName | string | sí | Nombre |
| lastName | string | sí | Apellido |
| normalizedName | string | sí | Copia del nombre completo en minúsculas y sin acentos para búsquedas por prefijo |
| birthDate | timestamp | sí | Fecha de nacimiento |
| residenceCountry | string | sí | País de residencia |
| personalEmail | string | sí | Correo personal; no crea una cuenta de acceso |
| hireDate | timestamp | sí | Fecha de ingreso |
| category | string | sí | `PERMANENT` o `INTERN` |
| commitment | string | sí | `FULL_TIME` o `PART_TIME` |
| workMode | string | sí | `REMOTE`, `HYBRID` u `ON_SITE` |
| jobRole | string | sí | Rol laboral |
| clientName | string \| null | no | Cliente de la asignación inicial, si se conoce |
| projectName | string \| null | no | Proyecto de la asignación inicial, si se conoce |
| contactName | string \| null | no | Referente inicial, si se conoce |
| status | string | sí | `ACTIVE` o `INACTIVE`; el alta comienza en `ACTIVE` |
| deletedAt | timestamp \| null | no | Fecha de borrado lógico; inicialmente `null` |
| createdAt | timestamp | sí | Alta del documento |

Índices compuestos: `status` asc + `normalizedName` asc para listar por estado y buscar nombres por prefijo sin distinguir mayúsculas ni acentos. La búsqueda de fragmentos que no sean prefijos requiere filtrado adicional en la aplicación.
