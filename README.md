# Gestión de RR.HH. — Firestore

Estructura inicial de Cloud Firestore para RH smart. Esta generación no crea colecciones, documentos de ejemplo ni índices compuestos: todavía no hay módulos de datos.

## Requisitos

- Node.js 24 o superior.
- Java para ejecutar el emulador de Firestore.

## Desarrollo local

```sh
npm install
npm run emulator
```

El emulador escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. En otra terminal, cuando existan scripts de carga:

```sh
npm run seed:emulator
```

El runner aplica los scripts de `firestore/seeds` en orden de versión y registra los aplicados. También se puede comprobar su configuración con `npm run check` y probar la carga con `npm run test:seeds` cuando haya scripts.

## Proyecto real

Configura `GOOGLE_APPLICATION_CREDENTIALS` con la ruta de una cuenta de servicio y `FIREBASE_PROJECT_ID` con el identificador del proyecto. No subas credenciales al repositorio. Cuando existan scripts de carga, ejecuta `npm run seed`; para desplegar las reglas y los índices, ejecuta `npm run deploy:firestore`. Las reglas actuales deniegan todo acceso desde clientes; un backend que use Firebase Admin no está sujeto a ellas.

## Scripts y colecciones

| Orden | Script | Colecciones |
|---|---|---|
| — | Ninguno todavía | Ninguna |

## Integración con el backend existente

El backend aprobado escucha en el puerto `8080` y actualmente espera una base SQL mediante `DATABASE_URL`; su contrato declara `users` como tabla. Esta estructura de Firestore no crea esa tabla ni puede sustituir la conexión SQL. Antes de integrar ambas capas, el backend debe adaptarse explícitamente a Firebase Admin y a un modelo de colecciones, o debe utilizarse una base relacional compatible con su contrato. No hay un usuario de demostración cargado en Firestore.
