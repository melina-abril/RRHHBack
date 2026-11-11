# Base de datos · Gestión de RR.HH

Cloud Firestore en modo nativo. Requiere Node.js 24 o superior. El backend accede mediante Firebase Admin SDK; las reglas bloquean el acceso directo de clientes.

## Emulador y carga de datos

```sh
npm install
npm run emulator
```

En otra terminal:

```sh
npm run seed:emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. Para ejecutar la carga y cerrar el emulador al terminar, usa `npm run test:seeds`. El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados. `npm run check` comprueba los scripts disponibles.

## Scripts y colecciones

| Orden | Script | Colecciones |
|---|---|---|
| — | Todavía no hay scripts de carga | Todavía no hay colecciones de funcionalidades |

Los pasos de core y módulos incorporarán sus propios scripts versionados y documentarán sus colecciones en `docs/collections`. No se deben modificar scripts ya aplicados.

## Proyecto real

Configura `GOOGLE_APPLICATION_CREDENTIALS` con la ruta de una cuenta de servicio autorizada y `FIREBASE_PROJECT_ID` con el identificador de tu proyecto. Después ejecuta `npm run seed` para cargar los datos y `npm run deploy:firestore` para desplegar las reglas y los índices. No uses las credenciales de producción en el emulador ni las incorpores al repositorio.
