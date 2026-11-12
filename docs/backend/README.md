# Gestión de RR.HH. · Backend

API REST con Node.js 24, Express 5 y TypeScript. Esta estructura inicial no incluye módulos de funcionalidades. El endpoint de salud es `GET /api/health`; las rutas de sesión existentes son `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. Las demás rutas bajo `/api` requieren sesión.

## Arranque

Requiere Node.js 24 o posterior. Instala las dependencias con `npm install` y ejecuta `npm run dev` para desarrollo. Para compilar y arrancar el código compilado, ejecuta `npm run build && npm start`. La API utiliza el puerto 8080 por defecto; puedes configurarlo con `PORT`.

## Configuración

La configuración del backend se lee desde las variables de entorno mediante los archivos existentes de `src/config/`. Consulta `.env.example` para las variables de sesión, CORS y conexión. En producción, configura `NODE_ENV=production` y un `JWT_SECRET` aleatorio de al menos 32 caracteres. No guardes secretos en el repositorio.

## Conexión con Firestore

La capa de base de datos usa Cloud Firestore. Para desarrollo local, inicia su emulador según el README de la base de datos y conecta el backend con `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. El backend utiliza el SDK de administración y no crea colecciones ni carga datos de ejemplo. Consulta el README de la base para crear el primer usuario administrador; esta estructura inicial todavía no incluye usuarios de ejemplo.
