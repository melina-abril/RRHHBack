# Gestión de RR.HH · Base de datos

Cloud Firestore en modo nativo. El backend accede mediante Firebase Admin SDK; el frontend no se conecta directamente a Firestore. Por eso, las reglas deniegan el acceso de clientes. No se requieren índices compuestos para las consultas definidas hasta ahora.

## Desarrollo local

Requiere Node.js 24 o posterior. Instala las dependencias y arranca el emulador de Firestore en `127.0.0.1:8085` (panel en el puerto `4005`):

```sh
npm install
npm run emulator
```

En otra terminal, carga los scripts versionados:

```sh
FIREBASE_PROJECT_ID=demo-app FIRESTORE_EMULATOR_HOST=127.0.0.1:8085 npm run seed:emulator
```

El backend usa los mismos nombres de variables, `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST`, para conectarse al emulador; levanta en el puerto `8080`. El frontend levanta en el puerto `4200` y llama al backend bajo `/api`, sin acceso directo a Firestore.

## Scripts y colecciones

Los scripts de `firestore/seeds` se aplican en orden de versión. El runner `scripts/seed.js` registra cuáles se aplicaron; no modifiques un script ya aplicado. Para comprobar los scripts, ejecuta `npm run check`.

| Módulo | Script | Colecciones |
|---|---|---|
| Inicio de sesión | Ninguno | Ninguna |
| Pantalla principal | Ninguno | Ninguna |
| Alta de colaborador | `firestore/seeds/V3__employee_management.js` | `employees` |

El esquema de `employees` se documenta en `docs/collections/employee-management.md`. Esta generación no incluye una colección compartida de usuarios ni datos de acceso; el aprovisionamiento de la cuenta administradora debe definirse junto con el módulo de autenticación del backend.

## Proyecto Firebase

Para cargar datos en un proyecto real, configura `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS` con valores propios antes de ejecutar `npm run seed`. Revisa las reglas y los índices antes de desplegarlos con `npm run deploy:firestore`. No uses las credenciales de producción en el emulador.
