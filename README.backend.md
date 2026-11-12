# Gestión de RR.HH. · Backend

Estructura inicial de la API REST. Todavía no hay módulos funcionales; el punto de entrada fijo expone `GET /api/health` y las rutas de sesión bajo `/api/auth`.

## Requisitos

- Node.js 24 o superior.
- Cloud Firestore, o su emulador local.

## Desarrollo

Levanta el emulador siguiendo el `README.md` de la capa database. Después ejecuta:

```sh
npm install
npm run dev
```

La API escucha en el puerto 8080 de forma predeterminada. Para compilar y arrancar la versión compilada:

```sh
npm run build
npm start
```

## Configuración

Consulta el archivo fijo `.env.example` para las opciones de configuración. En desarrollo, la conexión con la base usa `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. La capa database configura el emulador en el puerto 8085; no se inicia desde este backend.

Configura `FRONT_URL` con el origen del frontend para permitir solicitudes con credenciales. En producción, usa `NODE_ENV=production` y define un `JWT_SECRET` aleatorio de al menos 32 caracteres. La configuración de la API y de las cookies está en los archivos fijos de `src/config`.

## Acceso y módulos

La sesión existente ofrece `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. Todavía no hay colecciones ni usuarios de ejemplo cargados: no se puede iniciar sesión hasta que se incorpore el modelo de usuarios y se cree una cuenta mediante el procedimiento documentado en el `README.md` de la base. La contraseña de demostración prevista para los datos de ejemplo es `Demo1234!`, pero aún no existe ninguna cuenta con ella.

No hay módulos funcionales ni endpoints de módulos registrados por ahora. `src/routes.ts` queda preparado para montarlos cuando se generen.
