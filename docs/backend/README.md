# Gestión de RR.HH. · Backend

API REST con Node.js 24, Express 5 y TypeScript. Esta guía está en `docs/backend/README.md` porque el `README.md` de la raíz pertenece a la capa de base de datos del repositorio compartido.

## Arranque

Requiere Node.js 24 y acceso a Cloud Firestore. Ejecuta `npm install` y `npm run dev` para desarrollo, o `npm run build && npm start` para compilar e iniciar la API. El puerto de desarrollo es `8080`. La aplicación expone `GET /api/health` sin sesión.

La configuración de la API se lee del entorno; consulta el `.env.example` existente para sus valores de desarrollo. `PORT` establece el puerto, `FRONT_URL` permite el origen del frontend y `JWT_SECRET` protege las sesiones. En producción, establece `NODE_ENV=production` y un `JWT_SECRET` aleatorio de al menos 32 caracteres. No uses la contraseña de demostración en producción.

Para desarrollo local con la base de datos, inicia el emulador y carga el seed siguiendo el `README.md` de la raíz. Configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; usa el mismo proyecto si configuras `GCLOUD_PROJECT`. El backend no crea colecciones ni carga datos. El seed del emulador incluye `rrhh@example.com` con contraseña `Demo1234!` y rol `ADMIN`.

## Módulos y endpoints

Todas las rutas siguientes requieren sesión. Las rutas de autenticación compartidas son `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`.

- Movimientos laborales: `GET /api/employment-movements/:id`, `POST /api/employment-movements/:id/category-change`, `POST /api/employment-movements/:id/departure`, `POST /api/employment-movements/:id/rehire`.
- Perfil profesional y documentación: `GET /api/professional-profiles/:id`, `PUT /api/professional-profiles/:id`, `POST /api/professional-profiles/:id/documents`.
- Beneficios y saldos: `GET /api/benefits/:id`, `GET /api/benefits/:id/movements`, `POST /api/benefits/:id/adjustments`.
- Remuneraciones e historial salarial: `GET /api/remunerations/:id`, `POST /api/remunerations/:id`.
- Colaboradores: `GET /api/employees`, `GET /api/employees/:id`, `POST /api/employees`, `PUT /api/employees/:id`.
- Pantalla principal: `GET /api/dashboard/summary`.

## Conexión con las otras capas

El frontend Angular escucha en `http://localhost:4200` y redirige `/api` al backend en `http://localhost:8080`. Configura `FRONT_URL=http://localhost:4200` para permitir ese origen mediante CORS con credenciales. El frontend no accede directamente a Firestore: el backend se conecta al emulador de la base de datos en `127.0.0.1:8085` con `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`.
