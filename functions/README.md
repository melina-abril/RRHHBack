# API REST – Gestión de RR.HH (functions/)

Esta carpeta contiene el backend de la API REST del sistema Gestión de Recursos Humanos, implementado como una Cloud Function HTTP de Firebase (Express 5 + TypeScript), con autenticación por Firebase Auth y persistencia en Firestore. 

## ¿Qué hace esta API?
- **Gestión de Empleados:** administra colaboradores, fichas individuales, altasy edición de datos, egresos y reingresos, con generación automática de legajos.
- **Inicio de sesión:** la sesión se realiza con Firebase Auth; la API valida el ID token e identifica al usuario con su rol. Las rutas internas requieren sesión (rol ADMIN).

## Endpoints disponibles

- **/api/employees**
  - `GET /api/employees` — Obtiene la lista de colaboradores activos e inactivos, con filtros por nombre, legajo, categoría, cliente, proyecto y estado.
  - `POST /api/employees` — Da de alta un nuevo colaborador (requiere rol ADMIN).
  - `GET /api/employees/:id` — Consulta la ficha individual de un colaborador seleccionado.
  - `PUT /api/employees/:id` — Edita los datos personales y laborales de un colaborador (requiere rol ADMIN).
  - `POST /api/employees/:id/terminate` — Marca el egreso de un colaborador, actualiza su estado a inactivo y conserva el historial (requiere rol ADMIN).
  - `POST /api/employees/:id/reinstate` — Registra el reingreso de un ex-colaborador, conserva el legajo e inicia un nuevo período (requiere rol ADMIN).

> **Inicio de sesión y roles:**
> - El login/logout lo realiza el frontend vía Firebase Auth; la API recibe el ID token y extrae el usuario de la colección `users/{uid}` (Gestionada en la capa Firestore, mediante seed y scripts).
> - Todas las rutas de /api requieren sesión; solo la cuenta ADMIN está habilitada por defecto.

## ¿Cómo levantar este backend?

1. En la raíz del repo: `npm install`
2. En la raíz: `npm run functions:install` (instala las dependencias de functions/)
3. En la raíz: `npm run start` o usa el emulador de Firebase (ver README de la base)
4. Para datos de ejemplo: `npm run seed:emulator` (carga usuarios y colecciones demo en Firestore).

## URL de la API en desarrollo

- Si usas el emulador local de Firebase Functions:
  - [http://127.0.0.1:5002/{proyecto}/us-central1/api](http://127.0.0.1:5002/{proyecto}/us-central1/api)
  - El frontend debe tener configurado (env.local) el `apiBaseUrl` apuntando a `/api` y usar el proxy de desarrollo (ver documentación front y scripts de la base).

## Estructura principal

- `src/app.ts`: monta todos los routers de los módulos bajo /api/{modulo}
- `src/modules/employees/`: CRUD de empleados sobre Firestore, con roles y validaciones
- `src/shared/`: utilidades, controladores de error, autenticación, sesión y utilidades para Firestore.

## Usuarios de ejemplo (seed de la base)

En el entorno de desarrollo, la base ya incluye una cuenta admin para iniciar sesión:
- **Usuario:** admin@techforb.com
- **Contraseña:** Demo1234! (hash exacto: $2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO)
- **Rol:** ADMIN

Si lo necesitas en producción, crea el usuario en Auth y ejecuta el script de la capa database para habilitarlo en la colección `users`.

---

> **Nota:** Este backend vive en `functions/` y delega la autenticación y la persistencia a Firebase (no modificar package.json de la raíz, firebase.json, .firebaserc, firestore.rules, seeds ni scripts de la base aquí; solo modificar el código en `functions/src`).