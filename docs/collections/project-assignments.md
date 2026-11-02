# Módulo: clientes, proyectos y asignaciones

Las referencias a `employees` y `users` corresponden a documentos creados por el core. Solo la cuenta administradora accede a estos datos mediante el backend.

## clients

Clientes de los proyectos, distintos de futuras empresas suscriptoras. Id del documento: `CL-0001`…

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre del cliente |
| active | boolean | sí | Si está disponible para nuevas asignaciones |
| createdAt | timestamp | sí | Alta del documento |

## clientCountries

Países vinculados a cada cliente. Id del documento: `CC-0001`…

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| clientId | string → clients | sí | Cliente al que pertenece el país |
| countryCode | string | sí | Código de país: `AR` o `MX` en los datos de ejemplo |
| countryName | string | sí | Nombre visible del país |
| createdAt | timestamp | sí | Alta del documento |

## projects

Proyectos de un cliente. Id del documento: `PR-0001`… Cada elemento de `clientCountryIds` debe pertenecer al cliente indicado en `clientId`.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| clientId | string → clients | sí | Cliente propietario |
| name | string | sí | Nombre del proyecto |
| clientCountryIds | string[] → clientCountries | sí | Países vinculados donde opera el proyecto |
| active | boolean | sí | Si acepta nuevas asignaciones |
| createdAt | timestamp | sí | Alta del documento |

## projectContacts

Referentes registrados para un proyecto. Id del documento: `PC-0001`…

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| projectId | string → projects | sí | Proyecto del referente |
| name | string | sí | Nombre visible |
| email | string | sí | Correo ficticio de contacto |
| active | boolean | sí | Si puede seleccionarse en nuevas asignaciones |
| createdAt | timestamp | sí | Alta del documento |

## projectAssignments

Participaciones vigentes e históricas. Id del documento: `PA-0001`… Se conservan los nombres registrados al asignar para que la consulta histórica no dependa de los nombres vigentes del cliente, proyecto, país o referente. La creación y edición deben validar las relaciones entre cliente, país, proyecto y referente, la fecha de ingreso del período laboral y la ausencia de otra asignación `ACTIVE` del mismo empleado, proyecto y país.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| employeeId | string → employees | sí | Legajo del colaborador |
| clientId | string → clients | sí | Cliente seleccionado |
| clientName | string | sí | Nombre histórico del cliente |
| projectId | string → projects | sí | Proyecto seleccionado |
| projectName | string | sí | Nombre histórico del proyecto |
| clientCountryId | string → clientCountries | sí | País vinculado al cliente y al proyecto |
| countryName | string | sí | Nombre histórico del país |
| contactId | string → projectContacts \| null | no | Referente del proyecto, si se seleccionó |
| contactName | string \| null | no | Nombre histórico del referente |
| role | string | sí | Rol del colaborador en el proyecto |
| startDate | timestamp | sí | Inicio de la participación |
| endDate | timestamp \| null | no | Finalización; no puede preceder a `startDate` |
| status | string | sí | `ACTIVE` o `ENDED` |
| createdAt | timestamp | sí | Alta del documento |
| updatedAt | timestamp | sí | Última modificación |

## assignmentEvents

Antecedentes de creación, edición y finalización. Id del documento: `AE-0001`… Los mapas conservan los valores históricos completos de la asignación antes y después de cada operación; en una creación, `beforeValues` es `null`. El backend debe escribir el cambio y su evento de forma atómica.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| assignmentId | string → projectAssignments | sí | Asignación modificada |
| action | string | sí | `CREATED`, `UPDATED` o `ENDED` |
| actorUserId | string → users | sí | Cuenta administradora responsable |
| occurredAt | timestamp | sí | Fecha y hora de la operación |
| beforeValues | map \| null | no | Estado previo; `null` para `CREATED` |
| afterValues | map | sí | Estado resultante |
| createdAt | timestamp | sí | Alta del documento |

Los mapas `beforeValues` y `afterValues` contienen exactamente: `employeeId`, `clientId`, `clientName`, `projectId`, `projectName`, `clientCountryId`, `countryName`, `contactId`, `contactName`, `role`, `startDate`, `endDate` y `status`, con los mismos tipos y valores posibles que en `projectAssignments`.

Índices compuestos: ninguno requerido por los scripts de carga; Firestore indexa individualmente los campos. Las consultas que combinen filtros y ordenación por campos distintos deberán tener sus índices declarados en `firestore.indexes.json`.
