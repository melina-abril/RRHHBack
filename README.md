# Base de datos · Gestión de RR.HH

Cloud Firestore en modo nativo. Esta es la estructura inicial: todavía no hay colecciones, scripts de carga ni índices compuestos de funcionalidades.

## Requisitos

- Node.js 24 o superior
- npm

## Emulador y carga local

```sh
npm install
npm run emulator
```

En otra terminal:

```sh
npm run seed:emulator
```

El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está en `127.0.0.1:4005`. También se puede ejecutar `npm run test:seeds` para iniciar el emulador y ejecutar la carga en un solo comando. En esta estructura inicial no hay datos para cargar.

## Scripts y colecciones

| Script | Colecciones |
|---|---|
| Ninguno todavía | Ninguna |

Los pasos de core y módulos agregarán scripts versionados en `firestore/seeds/` y documentarán las colecciones que creen en `docs/collections/`. El runner `scripts/seed.js` aplica los scripts en orden de versión y registra los aplicados. No modifiques un script ya aplicado; agrega uno con una versión nueva. Para revisar la carga, ejecuta `npm run check`.

## Proyecto real

Configura `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a las credenciales de tu proyecto y `FIREBASE_PROJECT_ID` con su identificador antes de ejecutar `npm run seed`. No guardes credenciales en el repositorio. Para desplegar las reglas e índices, selecciona el proyecto Firebase correspondiente y ejecuta `npm run deploy:firestore`.

Las reglas actuales deniegan todas las lecturas y escrituras de clientes. El backend debe acceder mediante el SDK de administración; ese SDK no está sujeto a estas reglas.
