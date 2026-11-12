# Gestión de RR.HH. · Backend

API REST de TECHFORB con Node.js 24, Express 5 y Cloud Firestore. El archivo `README.md` de la raíz pertenece a la capa de base de datos; esta guía documenta el backend sin reemplazarlo.

## Arranque

Requiere Node.js 24 o posterior y acceso a Cloud Firestore. Para desarrollo local, inicia el emulador y carga los datos siguiendo el `README.md` de la base de datos. Después ejecuta:

```sh
npm install
npm run dev
```

Para compilar y ejecutar la API:

```sh
npm run build
npm start
```

La API escucha en el puerto `8080` por defecto. Consulta el archivo fijo `.env.example` para las variables admitidas por la configuración. En desarrollo con el emulador, configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; usa el mismo ID de proyecto al cargar los datos. Configura `FRONT_URL=http://localhost:4200` para permitir el origen del frontend. En producción establece `NODE_ENV=production`, proporciona un `JWT_SECRET` aleatorio de al menos 32 caracteres y conecta el backend a un proyecto Firestore autorizado, sin configurar el host del emulador. No publiques secretos en el repositorio.

## Endpoints

La sesión y los errores HTTP están implementados en los archivos fijos compartidos. `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me` gestionan la sesión; `GET /api/health` comprueba la disponibilidad de la API. Las rutas de los módulos requieren sesión.

| Módulo | Endpoint | Descripción |
|---|---|---|
| Pantalla principal | `GET /api/dashboard/summary` | Resumen de colaboradores activos y próximos cumpleaños. |
| Colaboradores | `GET /api/employees` | Listado paginado con búsqueda y filtro de estado. |
| Colaboradores | `GET /api/employees/:id` | Ficha identificada por legajo. |
| Colaboradores | `POST /api/employees` | Alta de colaborador con legajo correlativo. |

La base de datos aporta las colecciones compartidas `users` y `employees`; el backend no crea el esquema ni carga datos. El seed del emulador incluye la cuenta de demostración `rrhh@example.com` con contraseña `Demo1234!`. No uses esa cuenta en producción; consulta el `README.md` de la base para crear una cuenta administradora propia.

## Conexión con el frontend

El frontend se ejecuta en `http://localhost:4200` y su proxy envía `/api` a `http://localhost:8080`. Configura el origen permitido como `FRONT_URL=http://localhost:4200`. El navegador se comunica con la API; no se conecta directamente a Firestore. El backend usa el emulador local en `127.0.0.1:8085` durante el desarrollo.
