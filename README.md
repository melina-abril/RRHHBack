# Gestión de RR.HH. · Base de datos

Cloud Firestore en modo nativo. Los scripts de carga versionados crean documentos de ejemplo; el backend accede mediante Firebase Admin SDK. Las reglas impiden el acceso directo desde clientes.

## Desarrollo local

Requiere Node.js 24 o posterior. Ejecuta `npm install`, inicia `npm run emulator` y, en otra terminal, ejecuta `npm run seed:emulator`. El emulador de Firestore escucha en `127.0.0.1:8085` y su panel en el puerto `4005`. El runner aplica los scripts pendientes en orden de versión y registra los aplicados en `_seedHistory`. Para comprobar los scripts sin aplicarlos, ejecuta `npm run check`.

El seed inicial incluye la cuenta de demostración `rrhh@example.com` con contraseña `Demo1234!` y rol `ADMIN`. Úsala solo en el emulador; cambia la contraseña antes de utilizar ese entorno para otros fines. En un entorno real, crea el administrador con `npm run create-admin -- --email=admin@example.com --name="Administración de RR. HH." --role=ADMIN`. El comando utiliza `ADMIN_PASSWORD` si está definida; de lo contrario genera una contraseña y la muestra una sola vez. Para restablecerla, usa el mismo comando con `--reset`. No cargues la contraseña de demostración en producción.

## Colecciones y scripts

| Script | Colecciones | Uso |
|---|---|---|
| `firestore/seeds/V1__core.js` | `users`, `employees` | Cuenta administrativa y colaboradores compartidos por los módulos de colaboradores y pantalla principal. |

El esquema y los campos están documentados en `docs/collections/core.md`. Los módulos de alta de colaborador, inicio de sesión y pantalla principal no crean colecciones propias: utilizan las compartidas. `firestore.indexes.json` no declara índices compuestos porque los scripts y módulos actuales no requieren consultas que filtren por un campo y ordenen por otro.

## Despliegue y conexión con otras capas

Para cargar datos en un proyecto real, configura `FIREBASE_PROJECT_ID` y `GOOGLE_APPLICATION_CREDENTIALS`, y ejecuta `npm run seed`. Despliega las reglas y los índices con `npm run deploy:firestore`. No ejecutes el seed de demostración en producción: contiene una cuenta con contraseña conocida. Crea allí el administrador mediante `npm run create-admin`.

El backend escucha en el puerto `8080` y utiliza `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085` para conectarse al emulador; usa esos mismos nombres de variables al configurarlo. La configuración `.env.example` del repositorio pertenece al backend. El frontend escucha en el puerto `4200`, envía `/api` al backend y no accede directamente a Firestore. Consulta la documentación del backend para iniciar su API y configurar `FRONT_URL=http://localhost:4200`.
