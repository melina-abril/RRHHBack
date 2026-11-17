# Gestión de RR.HH. · Backend

API REST en Node.js 24, Express 5 y TypeScript. El archivo `README.md` de la raíz pertenece a la capa de base de datos; esta documentación corresponde únicamente al backend.

## Arranque

Requiere Node.js 24 y la base Firestore disponible. Ejecuta `npm install` y `npm run dev` para desarrollo, o `npm run build && npm start` para compilar y arrancar. La API escucha en el puerto `8080` por defecto; `PORT` permite cambiarlo.

La configuración lee `JWT_SECRET`, `FRONT_URL`, `FIREBASE_PROJECT_ID`, `FIRESTORE_EMULATOR_HOST` y `GCLOUD_PROJECT`. En desarrollo local, usa `FRONT_URL=http://localhost:4200`, `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Consulta `.env.example` para la configuración disponible. En producción establece `NODE_ENV=production`, un `JWT_SECRET` aleatorio de al menos 32 caracteres y las credenciales de acceso a Firestore; no configures el host del emulador.

## Endpoints

Todos los paths siguientes comienzan por `/api`. Salvo el inicio de sesión y la comprobación de salud, las rutas requieren sesión.

- Autenticación: `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
- Salud: `GET /health`.
- Colaboradores: `GET /employees`, `GET /employees/:id`, `POST /employees`, `PUT /employees/:id`. La edición de esta generación se monta antes del router de colaboradores existente.
- Movimientos laborales: `GET /employment-movements/:id`, `POST /employment-movements/:id/category-change`, `POST /employment-movements/:id/departure`, `POST /employment-movements/:id/rehire`.
- Perfil profesional: `GET /professional-profiles/:id`, `PUT /professional-profiles/:id`, `POST /professional-profiles/:id/documents`.
- Beneficios: `GET /benefits/:id`, `GET /benefits/:id/movements`, `POST /benefits/:id/adjustments`.
- Remuneraciones: `GET /remunerations/:id`, `POST /remunerations/:id`.
- Panel: `GET /dashboard/summary`.

## Conexión con las otras capas

El frontend Angular escucha en `http://localhost:4200`; su proxy envía `/api` a este backend en `http://localhost:8080`. Configura `FRONT_URL=http://localhost:4200` para permitir ese origen. El backend accede a Firestore con `FIREBASE_PROJECT_ID=demo-app` y, en desarrollo, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Inicia el emulador y carga los datos según el README de la base. Su carga de demostración incluye `rrhh@example.com` con contraseña `Demo1234!`; no uses esa cuenta en producción.
