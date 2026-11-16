# Gestión de RR.HH. · Backend

API REST para TECHFORB, desarrollada con Node.js 24, Express 5 y TypeScript. El archivo `README.md` de este repositorio pertenece a la capa de base de datos; esta guía documenta únicamente el backend.

## Arranque

Requiere Node.js 24 y acceso a Cloud Firestore. Ejecuta `npm install` y `npm run dev` para desarrollo, o `npm run build && npm start` para compilar e iniciar la API. El puerto de desarrollo es `8080`.

La configuración se lee del entorno; consulta el archivo fijo `.env.example`. `PORT` configura el puerto; `FRONT_URL` configura el origen permitido para el frontend, que en desarrollo es `http://localhost:4200`. Para Firestore local, usa `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`, con el mismo proyecto que los scripts de la base. En un proyecto real, configura `FIREBASE_PROJECT_ID` y las credenciales de aplicación autorizadas, sin `FIRESTORE_EMULATOR_HOST`. En producción establece `NODE_ENV=production` y un `JWT_SECRET` aleatorio de al menos 32 caracteres. La sesión usa una cookie HttpOnly; para producción publica frontend y backend mediante HTTPS.

La capa de base de datos proporciona el emulador, las reglas y los scripts de carga: sigue su `README.md` para iniciarlo y cargar los datos. Su script de ejemplo crea `rrhh@example.com` con la contraseña `Demo1234!` exclusivamente para el emulador. No uses esa cuenta en producción.

## Endpoints

La API se publica bajo `/api`. `GET /api/health` comprueba la disponibilidad. La sesión existente proporciona `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. Los endpoints de los módulos requieren sesión.

| Módulo | Endpoints |
|---|---|
| Pantalla principal (`dashboard`) | `GET /api/dashboard/summary` |
| Colaboradores (`employees`) | `GET /api/employees`, `GET /api/employees/:id`, `POST /api/employees` |

## Conexión entre capas

El frontend corre en `http://localhost:4200` y dirige `/api` a `http://localhost:8080`; configura `FRONT_URL=http://localhost:4200` para permitir ese origen. El backend se conecta al emulador de Firestore en `127.0.0.1:8085` mediante `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST`. El frontend no accede directamente a Firestore.
