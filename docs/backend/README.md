# Backend de Gestión de RR.HH

API REST de RH smart. La documentación de la base de datos se encuentra en el `README.md` de la raíz del repositorio; este archivo documenta únicamente el backend para no reemplazarla.

## Requisitos y ejecución

Se requieren Node.js 24 o posterior, npm y Cloud Firestore. Para desarrollo local, inicia el emulador de la base según el `README.md` de la raíz y carga sus datos de ejemplo. Después, configura las variables del backend y ejecuta:

```sh
npm install
npm run dev
```

Para compilar y ejecutar la aplicación compilada:

```sh
npm run build
npm start
```

La API escucha en el puerto 8080 de forma predeterminada y expone sus rutas bajo `/api`. `GET /api/health` permite comprobar que está en ejecución.

## Configuración

El backend lee su configuración de las variables de entorno; consulta el archivo `.env.example` existente para los valores de desarrollo. Las variables pertinentes son:

- `PORT`: puerto de la API; predeterminado: `8080`.
- `NODE_ENV`: usa `production` en producción.
- `JWT_SECRET`: secreto de firma de la sesión; en producción es obligatorio y debe tener al menos 32 caracteres aleatorios.
- `FRONT_URL`: origen permitido para el frontend; en desarrollo, `http://localhost:4200`.
- `FIREBASE_PROJECT_ID`: identificador del proyecto Firestore; para el emulador, `demo-app`.
- `FIRESTORE_EMULATOR_HOST`: dirección del emulador; en desarrollo, `127.0.0.1:8085`.
- `GCLOUD_PROJECT`: identificador del proyecto cuando lo requiera el entorno de Firestore; para el emulador, `demo-app`.

En producción configura el acceso a Firestore mediante las credenciales de servicio del entorno, sin incluirlas en el repositorio. El backend utiliza la conexión definida en `src/config/database.ts`; no crea colecciones ni carga datos.

## Sesión y módulos

La sesión se mantiene en una cookie HttpOnly. Las rutas públicas son `POST /api/auth/login` y `POST /api/auth/logout`; `GET /api/auth/me` requiere sesión. Los demás endpoints de los módulos también requieren sesión.

| Módulo | Endpoint | Función |
|---|---|---|
| Pantalla principal | `GET /api/dashboard/summary` | Resumen de colaboradores activos. |
| Listado de colaboradores | `GET /api/employees` | Listado paginado y filtrable. |
| Ficha individual | `GET /api/employees/:id` | Consulta de un colaborador por legajo. |
| Alta de colaborador | `POST /api/employees` | Creación de un colaborador con legajo correlativo. |

La ficha y el alta comparten el recurso `/api/employees` y se registran mediante el router de colaboradores; no tienen routers independientes.

Los scripts de carga de la base incluyen una cuenta ficticia `rrhh@example.com`, con rol `ADMIN` y contraseña `Demo1234!`, exclusivamente para demostración. Consulta el `README.md` de la raíz para crear una cuenta administradora en otro entorno y no mantengas activa la cuenta ficticia en producción.

## Integración con las otras capas

El frontend Angular se ejecuta en `http://localhost:4200` y dirige `/api` a `http://localhost:8080`. Configura `FRONT_URL` con su origen para permitir las solicitudes con credenciales. El backend se conecta a Firestore mediante `FIREBASE_PROJECT_ID`; en desarrollo utiliza `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Las colecciones `users` y `employees` y sus datos de ejemplo pertenecen a la capa de base de datos, no a este backend.
