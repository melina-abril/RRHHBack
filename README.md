# Gestión de RR.HH. — Firestore

Base de datos Cloud Firestore para RH smart. Esta estructura inicial no contiene colecciones, documentos de ejemplo ni scripts de carga de funcionalidades. Las reglas deniegan el acceso directo; el backend debe acceder mediante el SDK de administración.

## Requisitos

- Node.js 24 o posterior
- npm

Instala las dependencias con `npm install`.

## Emulador y carga de datos

Inicia el emulador con `npm run emulator`. Firestore estará disponible en `127.0.0.1:8085` y el panel del emulador en el puerto `4005`.

Cuando se hayan generado scripts en `firestore/seeds`, ejecuta `npm run seed:emulator` en otra terminal para cargarlos en orden de versión. El runner registra los scripts aplicados en `_seedHistory`. Puedes verificar los scripts con `npm run check` y probar la carga con `npm run test:seeds`.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el identificador de tu proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a un archivo de credenciales proporcionado por tu organización. No incluyas ese archivo en el repositorio. Después, ejecuta `npm run seed` para cargar los scripts disponibles y `npm run deploy:firestore` para desplegar reglas e índices.

Cuando exista la colección `users` y el backend haya definido su código de rol administrador, crea la cuenta inicial con `npm run create-admin -- --email=admin@example.com --name="Administrador de RR. HH." --role=ADMIN_RRHH`. Sustituye el correo de ejemplo y confirma que `ADMIN_RRHH` coincida con el rol exigido por el backend. El script toma la contraseña de `ADMIN_PASSWORD` o genera una y la muestra una sola vez; para restablecerla, añade `--reset`. Para usar el emulador, emplea `npm run create-admin:emulator` con los mismos argumentos. No uses una cuenta de ejemplo como administrador de un entorno real.

## Colecciones y scripts

Aún no hay colecciones ni scripts de carga de funcionalidades. Los próximos pasos documentarán cada colección en `docs/collections` y agregarán sus scripts versionados a `firestore/seeds`. Por ahora, `firestore.indexes.json` no necesita índices compuestos.
