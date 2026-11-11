# Backend · Gestión de RR.HH

API REST con Node.js 24, Express 5 y TypeScript. Esta primera estructura no incluye módulos de funcionalidades. `GET /api/health` está disponible para comprobar que el servidor responde; las rutas `/api/auth` pertenecen a los archivos fijos de la arquitectura. Las rutas que se incorporen bajo `/api` requerirán sesión.

## Arranque

Requiere Node.js 24 o superior y la base Cloud Firestore disponible. El README raíz pertenece a la capa de base de datos y contiene sus instrucciones de arranque.

```sh
npm install
npm run dev
```

Para compilar y ejecutar el backend:

```sh
npm run build
npm start
```

## Configuración y conexión con la base

La configuración del backend se lee desde `src/config/env.ts` y `src/config/database.ts`. Define `PORT` para el puerto HTTP y `FRONT_URL` para el origen permitido del frontend, según la configuración de esos archivos. En producción, usa `NODE_ENV=production` y configura `JWT_SECRET` con un valor aleatorio de al menos 32 caracteres; no incorpores secretos al repositorio.

La capa de base de datos usa Firestore. Para desarrollo con su emulador, configura `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Arranca primero el emulador siguiendo el README raíz. Para un proyecto real, configura `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS` con una cuenta de servicio autorizada. El backend utiliza Firebase Admin SDK; los clientes no acceden directamente a Firestore.

## Usuarios y módulos

Todavía no hay colecciones ni usuarios de ejemplo cargados. Cuando la capa de base de datos incorpore el usuario de demostración, su contraseña documentada será `Demo1234!`. El inicio de sesión necesitará que exista ese usuario en Firestore.

No hay módulos de funcionalidades ni endpoints de módulos en esta estructura inicial. Se registrarán en `src/routes.ts` conforme se generen.
