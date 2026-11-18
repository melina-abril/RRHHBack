# Módulo: employees

## employees

Legajos de colaboradores activos e inactivos. Id fijo del documento: el legajo (`E-0001`…). Una persona asignada a varios proyectos conserva un único documento. Los nombres de clientes y proyectos son copias para mostrar y filtrar el listado; este módulo no crea colecciones de clientes ni proyectos.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| employeeNumber | string | sí | Legajo único, igual al id del documento |
| firstName | string | sí | Nombre |
| lastName | string | sí | Apellido |
| fullName | string | sí | Nombre completo para el listado |
| normalizedName | string | sí | Nombre completo en minúsculas para búsqueda sin distinguir mayúsculas |
| email | string | sí | Correo de contacto; no crea una cuenta administrativa |
| category | string | sí | `PERMANENT` o `INTERN` |
| country | string | sí | País de trabajo |
| position | string | sí | Puesto laboral |
| clientNames | array | sí | Copia de nombres de clientes asociados; puede estar vacía |
| projectNames | array | sí | Copia de nombres de proyectos asociados; puede estar vacía |
| status | string | sí | `ACTIVE` o `INACTIVE` |
| hireDate | timestamp | sí | Fecha de ingreso registrada |
| terminationDate | timestamp \| null | no | Fecha de egreso, si corresponde |
| createdById | string → users | sí | Administrador que registró el legajo |
| createdAt | timestamp | sí | Alta del documento |
| deletedAt | timestamp \| null | no | Borrado lógico; el egreso mantiene el documento y usa `INACTIVE` |

Índices compuestos para listados ordenados por nombre: `status` + `normalizedName` asc; `category` + `normalizedName` asc; `clientNames` (array-contains) + `normalizedName` asc; `projectNames` (array-contains) + `normalizedName` asc. La búsqueda por prefijo sobre `normalizedName` sin otros filtros utiliza su índice de campo único.
