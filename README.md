# Gestión de RR.HH. · Firestore

Base Cloud Firestore en modo nativo. Esta estructura inicial todavía no contiene colecciones, documentos de ejemplo ni scripts de carga de funcionalidades. Las reglas deniegan el acceso desde clientes; el backend deberá usar el SDK de administración.

## Requisitos

- Node.js 24 o posterior.
- `npm install` para instalar las dependencias.

## Desarrollo local

En una terminal, inicia el emulador de Firestore en `127.0.0.1:8085` y su panel en el puerto `4005`:

```sh
npm run emulator
```

En otra terminal, aplica los scripts de carga versionados disponibles:

```sh
npm run seed:emulator
```

Por ahora no hay scripts que aplicar. Cuando se agreguen, el runner los ejecutará por versión y registrará los aplicados en `_seedHistory`. También puedes ejecutar `npm run test:seeds` para iniciar el emulador, aplicar los scripts y cerrarlo al terminar.

## Colecciones y scripts

Aún no se han generado colecciones ni scripts de carga. Las colecciones compartidas y las de cada módulo se documentarán en `docs/collections/` cuando se implementen. Los índices compuestos se agregarán a `firestore.indexes.json` conforme aparezcan consultas que los necesiten.

## Administrador inicial

Cuando exista la colección `users` y se haya definido el código del rol administrador, crea la cuenta con `npm run create-admin -- --email=admin@example.com --name="Administrador" --role=CODIGO_DEL_ROL_ADMINISTRADOR`. Sustituye el correo y el código de rol por los valores autorizados para tu entorno. El comando obtiene la contraseña de `ADMIN_PASSWORD` o genera una y la muestra una sola vez. Para restablecerla, vuelve a ejecutarlo con `--reset`. En el emulador, usa `npm run create-admin:emulator --` con los mismos argumentos. No incluyas contraseñas en scripts de carga.

## Proyecto real

Configura `GOOGLE_APPLICATION_CREDENTIALS` y `FIREBASE_PROJECT_ID` para el proyecto autorizado. Ejecuta `npm run seed` para aplicar los scripts disponibles y `npm run deploy:firestore` para publicar las reglas y los índices. Revisa el proyecto de destino antes de ejecutar estos comandos.
