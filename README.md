# Gestión de RR.HH. · Base de datos

Cloud Firestore en modo nativo. Los scripts de `firestore/seeds/` se aplican en orden de versión; `scripts/seed.js` registra los aplicados en `_seedHistory`. El backend accede mediante el SDK de administración, por lo que las reglas impiden el acceso directo de clientes.

## Desarrollo local

Requiere Node.js 24 o posterior. Ejecuta `npm install` y luego `npm run emulator`. El emulador escucha en `127.0.0.1:8085` y su panel está en el puerto `4005`. En otra terminal, ejecuta `npm run seed:emulator` para cargar los datos de ejemplo. También puedes ejecutar `npm run test:seeds` para iniciar el emulador y comprobar la carga. `npm run check` comprueba los scripts sin aplicarlos.

| Script | Colecciones creadas | Uso |
|---|---|---|
| `firestore/seeds/V1__core.js` | `users`, `employees` | Cuenta administrativa de ejemplo y colaboradores para la pantalla principal y la gestión de colaboradores |

Los módulos de inicio de sesión, pantalla principal y gestión de colaboradores no crean colecciones propias: utilizan las colecciones compartidas del core. Los campos y valores admitidos están documentados en `docs/collections/core.md`. Ninguna consulta actual requiere un índice compuesto; `firestore.indexes.json` tiene la lista vacía.

La cuenta del emulador es `rrhh@example.com` con contraseña `Demo1234!` y rol `ADMIN`. Su contraseña se almacena como hash bcrypt. **No cargues estos datos de demostración en producción.**

## Conexión con las otras capas

El backend levanta en el puerto `8080` y se conecta al emulador con `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Configura esas mismas variables en el entorno del backend; su configuración de ejemplo ya está en el repositorio del backend. El frontend levanta en el puerto `4200` y accede a los datos únicamente a través de la API del backend bajo `/api`; no se conecta directamente a Firestore. Para un entorno real, configura `FIREBASE_PROJECT_ID` con el identificador del proyecto y las credenciales de Google mediante `GOOGLE_APPLICATION_CREDENTIALS`; no establezcas `FIRESTORE_EMULATOR_HOST`.

## Administrador y despliegue

En un proyecto real, crea la primera cuenta administrativa con `npm run create-admin -- --email=admin@example.com --name="Administración de Recursos Humanos" --role=ADMIN`. Proporciona `ADMIN_PASSWORD` en el entorno o deja que el comando genere una contraseña y la muestre una sola vez. Para restablecerla, utiliza el mismo comando con `--reset`. No utilices el script de carga de demostración para crear usuarios reales.

Con el proyecto y las credenciales configurados, ejecuta `npm run deploy:firestore` para desplegar las reglas y los índices. Antes de aplicarlos, revisa el proyecto de destino: las reglas deniegan todas las lecturas y escrituras directas de clientes.
