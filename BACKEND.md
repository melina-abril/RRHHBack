# Gestión de RR.HH. — Backend

Esta estructura inicial expone `GET /api/health`. Todavía no hay módulos, endpoints de funcionalidades ni usuarios de ejemplo. La sesión y los endpoints `/api/auth/login`, `/api/auth/logout` y `/api/auth/me` forman parte de los archivos fijos del proyecto; el inicio de sesión necesitará la colección `users` cuando se incorpore a la base.

## Requisitos y arranque

- Node.js 24 o posterior y npm.
- Cloud Firestore: para desarrollo, inicia el emulador siguiendo el `README.md` de la capa database, que ya existe en este repositorio.

Copia `.env.example` a `.env` y ajusta sus valores. Ejecuta `npm install` y `npm run dev`. Para compilar y arrancar la versión compilada, ejecuta `npm run build` y después `npm start`.

## Configuración y conexión con la base

`PORT` configura el puerto HTTP. `FRONT_URL` indica el origen permitido para el frontend. `NODE_ENV` selecciona el entorno; en producción usa `NODE_ENV=production` y proporciona un `JWT_SECRET` aleatorio de al menos 32 caracteres. Las demás opciones de sesión y sus valores predeterminados se definen en el archivo fijo `src/config/env.ts`.

La capa database usa Cloud Firestore y, en desarrollo, su emulador escucha en `127.0.0.1:8085` con el proyecto `demo-app`. El backend se conecta mediante `FIREBASE_PROJECT_ID`, `GCLOUD_PROJECT` y `FIRESTORE_EMULATOR_HOST`, con los mismos valores que usa la capa database. Para un proyecto real, configura las credenciales autorizadas fuera del repositorio según el `README.md` de la base. El backend no crea colecciones ni carga datos: esa tarea corresponde a los scripts de la capa database.

## Módulos

No hay módulos de funcionalidades en esta estructura inicial. Sus routers se montarán en `src/routes.ts` cuando se generen. No hay credenciales de demostración disponibles todavía.
