# Gestión de RR.HH. — API

Estructura inicial del backend REST. Todavía no hay módulos ni endpoints de funcionalidades. La aplicación expone `GET /api/health` y las rutas de sesión bajo `/api/auth` mediante los archivos fijos del proyecto.

## Requisitos y arranque

- Node.js 24 o posterior y npm.
- Cloud Firestore disponible. Para desarrollo, puedes iniciar el emulador siguiendo el `README.md` de la capa database, que comparte este repositorio.

Ejecuta `npm install` y `npm run dev` para desarrollo. Para compilar y arrancar el código compilado, ejecuta `npm run build && npm start`. La API escucha en el puerto 8080 de forma predeterminada.

## Configuración

Consulta el `.env.example` existente para las variables admitidas por la configuración fija del backend. Configura `FIREBASE_PROJECT_ID` con el identificador del proyecto; para el emulador de desarrollo, configura `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. En producción, configura `NODE_ENV=production` y un `JWT_SECRET` aleatorio de al menos 32 caracteres. Configura el origen permitido del frontend según la configuración existente de CORS. No incluyas secretos ni credenciales de servicio en el repositorio.

El backend accede a Firestore mediante el SDK de administración y no crea colecciones ni carga datos. Para crear el primer usuario administrador, sigue las instrucciones del `README.md` de la capa database. El emulador de Firestore utiliza el puerto 8085; la API utiliza el puerto 8080.
