# Gestión de RR.HH. · Base de datos

Cloud Firestore en modo nativo. El backend accede mediante el SDK de administración; el frontend no se conecta directamente a Firestore. Por eso, `firestore.rules` deniega todas las lecturas y escrituras de clientes. Las colecciones y sus campos están documentados en `docs/collections/core.md`.

## Desarrollo local

Requiere Node.js 24 o posterior. Ejecuta `npm install` y, en una terminal, `npm run emulator`. El emulador escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. En otra terminal, ejecuta `npm run seed:emulator` para aplicar los scripts pendientes. `npm run check` permite consultar su estado; el runner registra los scripts aplicados en `_seedHistory`.

El script inicial crea una cuenta administradora de demostración, `rrhh@example.com`, con la contraseña `Demo1234!` y el rol `ADMIN`. Úsala solo en el emulador; no conserves esa contraseña fuera de un entorno de demostración.

## Scripts y colecciones

| Script | Paso | Colecciones |
|---|---|---|
| `firestore/seeds/V1__core.js` | Core compartido | `users`, `employees` |

Los módulos `authentication`, `dashboard` y `employees` no crean colecciones propias en esta generación: utilizan las colecciones compartidas. No se requieren índices compuestos para las consultas documentadas en esta etapa.

## Conexión con las otras capas

Para conectar el backend local al emulador, configura `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` en su entorno. El backend atiende en el puerto `8080`; el frontend, en el `4200`, llama al backend bajo `/api` y no necesita credenciales de Firestore. Usa el mismo ID de proyecto al cargar datos y al iniciar el backend.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` con el ID del proyecto y `GOOGLE_APPLICATION_CREDENTIALS` con la ruta a una credencial autorizada; no establezcas `FIRESTORE_EMULATOR_HOST`. Ejecuta `npm run seed` para aplicar los scripts pendientes. Para crear la cuenta administradora con tus propias credenciales, ejecuta `npm run create-admin -- --email=admin@example.com --name="Administración de Recursos Humanos" --role=ADMIN`. Define `ADMIN_PASSWORD` en tu entorno o deja que la herramienta genere una contraseña que mostrará una sola vez; usa `--reset` para restablecerla. Sustituye o desactiva la cuenta de demostración antes de habilitar el acceso al proyecto real.

Selecciona el proyecto Firebase correspondiente y ejecuta `npm run deploy:firestore` para publicar las reglas y los índices. El despliegue de reglas no carga datos: `npm run seed` es un paso separado.
