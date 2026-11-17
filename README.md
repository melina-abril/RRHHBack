# Gestión de RR.HH. · Base de datos

Cloud Firestore en modo nativo. Los scripts de `firestore/seeds` cargan datos ficticios; `scripts/seed.js` los aplica en orden de versión y registra los aplicados en `_seedHistory`.

## Desarrollo local

Requiere Node.js 24 o posterior. Ejecuta `npm install` y, en una terminal, `npm run emulator`. El emulador de Firestore escucha en `127.0.0.1:8085` y su panel está disponible en el puerto `4005`. En otra terminal, ejecuta `npm run seed:emulator`. También puedes comprobar los scripts con `npm run check` o probar la carga con `npm run test:seeds`.

La carga inicial crea una cuenta ficticia `rrhh@example.com` con rol `ADMIN` y contraseña `Demo1234!`, almacenada como hash bcrypt. Úsala únicamente en el emulador; no lleves esa cuenta de demostración a producción.

## Colecciones y orden de carga

| Script | Alcance | Colecciones |
|---|---|---|
| `firestore/seeds/V1__core.js` | Compartido | `users`, `employees` |

El esquema y los campos cargados se describen en `docs/collections/core.md`. El listado, la ficha, la edición y el alta de colaboradores usan `employees`; no crean otra colección. Los demás módulos no declaran colecciones propias en esta generación. `_seedHistory` es el registro técnico que mantiene el runner, no una colección de negocio.

## Proyecto real

Configura `FIREBASE_PROJECT_ID` y las credenciales mediante `GOOGLE_APPLICATION_CREDENTIALS`. No establezcas `FIRESTORE_EMULATOR_HOST` fuera del desarrollo local. Ejecuta `npm run seed` solo con scripts de carga apropiados para ese entorno: el script inicial contiene datos de demostración y no debe cargarse en producción. Para crear la cuenta inicial de un entorno real, usa `npm run create-admin -- --email=admin@example.com --name="Administración de Recursos Humanos" --role=ADMIN`. Puedes definir `ADMIN_PASSWORD` en el entorno o dejar que el comando genere una contraseña y la muestre una sola vez; `--reset` restablece la contraseña de una cuenta existente. Despliega las reglas y los índices con `npm run deploy:firestore`. Las reglas deniegan el acceso directo: la API utiliza el SDK de administración.

## Conexión con las otras capas

El backend escucha en el puerto `8080` y se conecta a Firestore con `FIREBASE_PROJECT_ID=demo-app` y, en desarrollo, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Su `.env.example` ya existe en el mismo repositorio; configura esas variables allí según sus instrucciones. El frontend escucha en el puerto `4200` y consume la API del backend bajo `/api`; no se conecta directamente a Firestore. Para permitir ese origen, configura `FRONT_URL=http://localhost:4200` en el backend.
