# Gestión de RR.HH. · Backend

API REST en Node.js 24, Express 5 y TypeScript. Este documento está separado del `README.md` existente, que pertenece a la capa de base de datos en el mismo repositorio.

## Arranque

Requiere Node.js 24 o posterior y la base Cloud Firestore disponible. Para desarrollo local, inicia el emulador y carga los datos siguiendo el `README.md` de la base de datos. Después ejecuta `npm install` y `npm run dev`. La API escucha en el puerto 8080. Para compilar y arrancar la versión compilada, ejecuta `npm run build && npm start`.

La configuración se lee del entorno; consulta `.env.example` para los valores de ejemplo. `PORT` configura el puerto de la API y `FRONT_URL` permite el origen del frontend. Para el emulador local, usa `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; configura `GCLOUD_PROJECT` con el mismo identificador de proyecto cuando corresponda. En producción, establece `NODE_ENV=production`, configura el proyecto y las credenciales de Google sin `FIRESTORE_EMULATOR_HOST`, y proporciona un `JWT_SECRET` aleatorio de al menos 32 caracteres.

## Endpoints

- Salud: `GET /api/health`.
- Sesión: `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`.
- Colaboradores: `GET /api/employees`, `GET /api/employees/:id`, `POST /api/employees` y `PUT /api/employees/:id`.
- Pantalla principal: `GET /api/dashboard/summary`.

Las rutas de colaboradores y de la pantalla principal requieren sesión. La cuenta de demostración cargada por el seed del emulador es `rrhh@example.com`, con contraseña `Demo1234!`. No uses esa cuenta en producción.

## Conexión con las otras capas

El frontend escucha en `http://localhost:4200` y dirige `/api` a este backend en `http://localhost:8080`; configura `FRONT_URL` para permitir ese origen. El backend accede a Firestore mediante el SDK de administración. En desarrollo, el emulador de la base escucha en `127.0.0.1:8085` y proporciona las colecciones compartidas `users` y `employees`. El frontend no accede directamente a Firestore.
