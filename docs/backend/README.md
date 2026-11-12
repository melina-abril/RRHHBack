# Gestión de RR.HH · Backend

API REST con Node.js 24, Express 5 y TypeScript. El `README.md` de la raíz corresponde a la base de datos y no se modifica desde esta capa.

## Desarrollo

Levanta primero el emulador de Firestore según el `README.md` de la raíz. Después, desde la raíz del repositorio:

```sh
npm install
FIREBASE_PROJECT_ID=demo-app GCLOUD_PROJECT=demo-app FIRESTORE_EMULATOR_HOST=127.0.0.1:8085 FRONT_URL=http://localhost:4200 npm run dev
```

La API escucha en el puerto `8080` por defecto; puedes cambiarlo con `PORT`. El frontend Angular escucha en `http://localhost:4200` y su proxy dirige `/api` a `http://localhost:8080`. Configura `FRONT_URL` para permitir ese origen con credenciales. El backend se conecta a Firestore mediante `FIREBASE_PROJECT_ID`, `GCLOUD_PROJECT` y `FIRESTORE_EMULATOR_HOST`; el frontend no accede directamente a la base.

Para compilar y arrancar el código compilado:

```sh
npm run build
npm start
```

En producción configura `NODE_ENV=production`, un `JWT_SECRET` aleatorio de al menos 32 caracteres, el origen autorizado mediante `FRONT_URL` y las credenciales y el identificador de tu proyecto Firebase. No uses el emulador en producción. La configuración de sesión y conexión está en los archivos fijos `src/config/env.ts` y `src/config/database.ts`.

## Sesión y usuarios

La sesión usa una cookie HttpOnly. Los endpoints compartidos son `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; `GET /api/health` comprueba la disponibilidad de la API. La autenticación consulta la colección `users`. La base de datos existente solo prepara `employees`: no incluye un usuario administrador. Aprovisiona por un procedimiento seguro un usuario con correo corporativo, rol `ADMIN`, estado activo y un hash bcrypt de su contraseña antes de probar el acceso. Si se aprovisiona la cuenta de demostración con el hash bcrypt previsto para `Demo1234!`, esa es su contraseña de ejemplo; no se crea ninguna cuenta desde el backend.

## Módulos

Las rutas de los módulos requieren sesión y se montan bajo `/api`:

| Módulo | Endpoints |
|---|---|
| Pantalla principal | `GET /api/dashboard/summary` |
| Alta de colaborador | `GET /api/employees`, `GET /api/employees/:id`, `POST /api/employees` |

El módulo de colaboradores utiliza la colección `employees` preparada por la capa database. El backend no crea el esquema ni carga datos de ejemplo.
