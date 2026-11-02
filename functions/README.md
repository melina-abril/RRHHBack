# API de Gestión de RR.HH

API Express 5 en una Cloud Function HTTP (`api`). Firebase Auth verifica el ID token Bearer y Firestore almacena los datos. Todas las rutas `/api` requieren sesión; las acciones de escritura de asignaciones requieren el rol `ADMIN`. El inicio y cierre de sesión los realiza el frontend con Firebase Auth; `GET /api/auth/me` devuelve el usuario de la sesión.

## Desarrollo local

Desde la raíz del repositorio:

```sh
npm install
npm run functions:install
npm start
```

En otra terminal, para cargar los datos de ejemplo en el emulador:

```sh
npm run seed:emulator
```

Para comprobar la compilación de la API: `npm --prefix functions run build`. La URL local de la función es `http://127.0.0.1:5002/{project-id}/us-central1/api`; las rutas siguientes se agregan a esa URL, por ejemplo `/api/project-assignments/projects`. Sustituye `{project-id}` por el ID del proyecto configurado en Firebase. Consulta `scripts/demo-users.js` y la documentación de la raíz para la creación y las credenciales de los usuarios de ejemplo; la API no crea cuentas.

## Rutas

Las rutas GET requieren sesión; las rutas POST y PUT requieren además el rol `ADMIN`.

| Método | Ruta | Rol adicional |
| --- | --- | --- |
| GET | `/api/project-assignments/clients` | Ninguno |
| POST | `/api/project-assignments/clients` | ADMIN |
| GET | `/api/project-assignments/clients/{clientId}/countries` | Ninguno |
| POST | `/api/project-assignments/clients/{clientId}/countries` | ADMIN |
| GET | `/api/project-assignments/projects` | Ninguno |
| POST | `/api/project-assignments/projects` | ADMIN |
| GET | `/api/project-assignments/projects/{projectId}/contacts` | Ninguno |
| POST | `/api/project-assignments/projects/{projectId}/contacts` | ADMIN |
| GET | `/api/project-assignments/employees/{employeeId}` | Ninguno |
| POST | `/api/project-assignments/employees/{employeeId}` | ADMIN |
| PUT | `/api/project-assignments/employees/{employeeId}/{id}` | ADMIN |
| POST | `/api/project-assignments/employees/{employeeId}/{id}/finalize` | ADMIN |

Los módulos Edición de colaborador, Movimientos laborales y Perfil profesional y documentación no declaran servicios HTTP en esta generación; por eso no se montan rutas para ellos.

El esquema de colecciones y las semillas de Firestore pertenecen a la capa de base de datos del mismo repositorio. Consulta `docs/collections/core.md` y `docs/collections/project-assignments.md` para conocer sus campos.
