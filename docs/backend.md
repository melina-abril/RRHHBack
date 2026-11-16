# Gestión de RR.HH. · Backend

API REST con Node.js 24, Express 5 y TypeScript. Este archivo documenta el backend sin sobrescribir el `README.md` existente de la capa database.

## Desarrollo

Inicia primero el emulador de Firestore siguiendo el `README.md` de la base de datos. Después ejecuta `npm install` y `npm run dev`. La API escucha en `http://localhost:8080`. Para compilar y arrancar el código generado, ejecuta `npm run build && npm start`.

La configuración se lee de las variables de entorno; consulta el archivo fijo `.env.example`. `PORT` usa el puerto 8080. Para el emulador, configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Configura `FRONT_URL=http://localhost:4200` para permitir las solicitudes del frontend con credenciales. En producción, establece `NODE_ENV=production` y un `JWT_SECRET` aleatorio de al menos 32 caracteres; no uses las credenciales ni los datos de demostración del emulador.

El seed de desarrollo de la base incluye `rrhh@example.com` con la contraseña `Demo1234!` y el rol `ADMIN`. Consulta el `README.md` de la base para crear la primera cuenta en otros entornos.

## Rutas

- `GET /api/health`: estado de la API.
- `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`: sesión implementada por los archivos fijos de autenticación.
- `GET /api/employees`: listado paginado de colaboradores.
- `GET /api/employees/:id`: ficha de un colaborador.
- `POST /api/employees`: alta con legajo único.
- `PUT /api/employees/:id`: actualización sin cambiar el legajo.
- `GET /api/dashboard/summary`: indicadores y próximos eventos.

Las rutas de empleados y del panel requieren sesión. La autenticación consulta la colección `users`; empleados y panel utilizan la colección compartida `employees`.

## Conexión con las otras capas

El frontend escucha en `http://localhost:4200` y dirige `/api` a esta API en `http://localhost:8080`. Este backend accede a Firestore mediante Firebase Admin SDK; en desarrollo, el emulador de la capa database escucha en `127.0.0.1:8085`. El frontend no accede directamente a Firestore.
