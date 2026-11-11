# Gestión de RR.HH. · Firestore

Base Cloud Firestore en modo nativo. Esta estructura inicial todavía no contiene colecciones ni scripts de carga de funcionalidades.

## Requisitos

- Node.js 24 o posterior.
- `npm install` para instalar las dependencias.

## Emulador local

En una terminal, iniciar Firestore en `127.0.0.1:8085` y su panel en el puerto `4005`:

```sh
npm run emulator
```

En otra terminal, aplicar los scripts de carga disponibles:

```sh
npm run seed:emulator
```

También se pueden verificar los scripts con `npm run check` y probar la carga en un emulador temporal con `npm run test:seeds`. El runner `scripts/seed.js` aplica los archivos de `firestore/seeds` por versión y registra los aplicados en `_seedHistory`.

## Scripts y colecciones

| Versión | Script | Colecciones |
|---|---|---|
| — | Aún no hay scripts de carga | Aún no hay colecciones de funcionalidades |

Los índices compuestos se incorporarán a `firestore.indexes.json` cuando existan consultas que los necesiten. Las reglas actuales deniegan el acceso directo a todos los documentos; el backend debe acceder mediante el SDK de administración.

## Proyecto real

Configurar `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a un archivo de credenciales autorizado, sin incorporarlo al repositorio. Luego ejecutar `npm run seed` para aplicar los scripts disponibles y `npm run deploy:firestore` para desplegar las reglas y los índices. Revisar el proyecto de destino antes de ejecutar estos comandos.
