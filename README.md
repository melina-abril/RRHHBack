# Sistema de Gestión de Recursos Humanos · Base de datos (Firestore)

Este proyecto contiene la capa de base de datos del sistema de Gestión de RR.HH. sobre Cloud Firestore y Firebase Auth, con scripts de carga y documentación del modelo de datos. La API de la aplicación se desarrolla en la carpeta `functions/` y no forma parte de esta capa.

## Arranque local (emuladores)

1. Clonar el repo y ubicarse en la raíz del proyecto.
2. Instalar dependencias:
   ```sh
   npm install
   npm run functions:install
   ```
3. Levantar los emuladores de Firestore y Auth (abre el panel en http://127.0.0.1:4005):
   ```sh
   npm start
   ```
4. En otra terminal, cargar los datos iniciales sobre los emuladores:
   ```sh
   npm run seed:emulator
   ```
5. Usuarios para ingresar desde el sistema (contraseña `Demo1234!`):

   | Rol        | Usuario                      |
   |------------|-----------------------------|
   | ADMIN      | laura.gomez@example.com      |
   | EMPLOYEE   | martin.perez@example.com     |
   | HR_ANALYST | analia.torres@example.com    |

   - Todos los usuarios usan la contraseña: **Demo1234!**
   - El login del sistema utiliza Firebase Auth contra estos usuarios.

## Despliegue a un proyecto real

1. Conectarse al proyecto con `firebase use --add` y configurar las credenciales:
   ```sh
   export GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   export FIREBASE_PROJECT_ID=mi-proyecto
   ```
2. Deploy de reglas, índices y funciones:
   ```sh
   npm run deploy
   ```
3. Cargar los datos iniciales en la nube:
   ```sh
   npm run seed
   ```

## Colecciones de Firestore

Estas colecciones y campos son la fuente de verdad del sistema. Todos los módulos internos (employees, payroll, requests, notices y overtime) referencian empleados, áreas y puestos definidos aquí.

- users: usuarios autenticados y sus datos de sesión (usuarios de ejemplo: ver arriba)
- departments: áreas internas
- positions: puestos
- employees: colaboradores y excolaboradores

Consulta el esquema y las descripciones de campos en `docs/collections/core.md`.

Los módulos funcionales agregan sus propias colecciones según su documentación.

## API y otras capas

- El backend de la aplicación vive en `functions/` y se conecta a esta base usando el SDK de admin (`firebase-admin`).
- No edites estas colecciones ni sus scripts de carga manualmente por fuera de los seeds versionados.
