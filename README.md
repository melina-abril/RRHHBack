# Gestión de RR.HH. · Base de datos

Cloud Firestore en modo nativo. Los scripts de carga versionados se aplican en orden y el runner registra los ya aplicados en `_seedHistory`. El backend accede mediante el SDK de administración; las reglas de acceso para clientes están cerradas.

## Desarrollo local

Requiere Node.js 24 o posterior. Ejecuta `npm install` y luego `npm run emulator`. En otra terminal, ejecuta `npm run seed:emulator` para cargar los datos de ejemplo en el emulador de Firestore de `demo-app`. Firestore escucha en `127.0.0.1:8085` y el panel del emulador en el puerto `4005`. También puedes ejecutar `npm run test:seeds` para iniciar el emulador, aplicar los scripts y detenerlo al terminar.

La cuenta de demostración del emulador es `rrhh@example.com` con contraseña `Demo1234!` y rol `ADMIN`. No uses esa cuenta fuera del emulador. Los esquemas y sus campos están documentados en `docs/collections/core.md`.

## Scripts y colecciones

| Orden | Script | Colecciones |
|---|---|---|
| 1 | `firestore/seeds/V1__core.js` | `users`, `employees` |

Los módulos movimientos laborales, perfil profesional y documentación, beneficios y saldos, remuneraciones e historial salarial, alta de colaborador, inicio de sesión y pantalla principal no tienen scripts ni colecciones propias en esta generación. Inicio de sesión y pantalla principal utilizan las colecciones compartidas. Los índices compuestos se declaran en `firestore.indexes.json`; actualmente no se requiere ninguno.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el identificador del proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a las credenciales proporcionadas por tu organización; no configures `FIRESTORE_EMULATOR_HOST`. Ejecuta `npm run check` para revisar los scripts y `npm run deploy:firestore` para desplegar reglas e índices. Ejecuta `npm run seed` únicamente después de revisar los datos: el script inicial incluye una cuenta de demostración y no debe cargarse sin cambios en producción.

Para crear la primera cuenta administrativa en un entorno real, usa `npm run create-admin -- --email=correo@ejemplo.com --name="Administración de RR. HH." --role=ADMIN`. Puedes establecer `ADMIN_PASSWORD` en el entorno o dejar que el comando genere una contraseña y la muestre una sola vez. Para restablecerla, ejecuta el mismo comando con `--reset`. No guardes contraseñas ni credenciales en el repositorio.

## Conexión con las otras capas

El backend escucha en el puerto `8080` y se conecta a Firestore usando `FIREBASE_PROJECT_ID` y, solo para desarrollo local, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Utiliza el mismo identificador de proyecto que el emulador (`demo-app`). La configuración del backend está en su `.env.example`; este repositorio compartido no necesita otro archivo de entorno para la base. El frontend escucha en el puerto `4200`, consume `/api` a través del backend y no accede directamente a Firestore.
