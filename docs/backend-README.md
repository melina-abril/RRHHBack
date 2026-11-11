# Backend · Gestión de RR.HH

Estructura inicial de la API REST. Todavía no hay módulos ni endpoints de funcionalidades. El endpoint de salud es `GET /api/health`; las rutas de sesión están en `/api/auth`.

## Requisitos

- Node.js 24 o superior y npm.
- Emulador de Cloud Firestore de la capa database, o acceso configurado a un proyecto de Firebase.

## Desarrollo local

Desde la raíz del repositorio, inicia el emulador con `npm install && npm run emulator`. El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está en `127.0.0.1:4005`. En otra terminal, inicia el backend:

```sh
npm install
npm run dev
```

Para compilar y ejecutar:

```sh
npm run build
npm start
```

## Configuración

`src/config/env.ts` y `src/config/database.ts` leen la configuración del entorno. Para el emulador, configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Ajusta `PORT` para el servidor HTTP y `FRONT_URL` para el origen permitido del frontend según el entorno. En producción, configura `NODE_ENV=production` y un `JWT_SECRET` aleatorio de al menos 32 caracteres; no lo guardes en el repositorio. Para un proyecto Firebase real, configura `FIREBASE_PROJECT_ID` y las credenciales de aplicación fuera del repositorio. No uses `FIRESTORE_EMULATOR_HOST` en producción.

## Sesión y datos

La autenticación usa la colección `users` de Firestore. Esta estructura inicial no incluye usuarios de ejemplo ni datos cargados: el inicio de sesión estará disponible cuando la capa database agregue un usuario válido. La contraseña prevista para el usuario de demostración, cuando exista su seed, es `Demo1234!`. No hay endpoints de módulos todavía.

## Integración con la base de datos

El backend se conecta a Cloud Firestore mediante el SDK de administración y las variables `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST`. La capa database mantiene `firebase.json`, sus reglas, índices y scripts de carga; este backend no crea colecciones ni carga datos. Para levantar o cargar el emulador, consulta el `README.md` de la capa database en la raíz del repositorio.
