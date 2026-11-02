# Gestión de RR.HH - Base de datos (Cloud Firestore)

Este repositorio contiene la base de datos (Cloud Firestore) y la autenticación (Firebase Auth) para el sistema de Gestión de Recursos Humanos. Incluye scripts de carga, documentación de colecciones, reglas e índices, y se integra con el backend en `functions/` (Node.js · Firebase Functions, generado por la capa backend).

## Cómo levantar el proyecto (modo desarrollo)

1. Instalar dependencias:

   ```sh
   npm install
   npm run functions:install
   ```

2. En una terminal, iniciar los emuladores de Firestore, Auth y Functions:

   ```sh
   npm start
   ```

   - Panel de emuladores: http://127.0.0.1:4005
   - Firestore: localhost:8085
   - Auth: localhost:9099
   - Functions (API): localhost:5002

3. En otra terminal, cargar los datos de ejemplo (usuarios, áreas, puestos y empleados):

   ```sh
   npm run seed:emulator
   ```

   Esto aplica los scripts de `firestore/seeds` en orden de versión. Los usuarios de ejemplo se crean en Auth y en la colección `users`.

## Cómo desplegar a un proyecto real de Firebase

1. Configurar el proyecto (si es la primera vez):

   ```sh
   firebase use --add
   ```

2. Crear y descargar una cuenta de servicio con permisos de editor desde la consola de Firebase (IAM y administración > Cuentas de servicio), guardar el JSON como `service-account.json` en la raíz del proyecto.

3. Ejecutar:

   ```sh
   npm run deploy
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json FIREBASE_PROJECT_ID=mi-proyecto npm run seed
   ```

## Usuarios de ejemplo

Se crea un usuario para pruebas técnicas de cada rol:

- Admin RRHH:
  - Correo: laura.gomez@example.com
  - Usuario: admin-rrhh
  - Contraseña: Demo1234!

- Empleado de ejemplo:
  - Correo: martin.perez@example.com
  - Usuario: empleado
  - Contraseña: Demo1234!

Al crear nuevos módulos, agrega los scripts V2__*.js en `firestore/seeds`.

## Colecciones y esquema

Las colecciones compartidas para todos los módulos son:

- `users` (usuarios del sistema, solo para login técnico)
- `departments` (áreas)
- `positions` (puestos laborales)
- `employees` (colaboradores y legajos)

Sus campos y referencias exactos están documentados en [`docs/collections/core.md`](docs/collections/core.md).

La documentación por colección se encuentra en `docs/collections/`, un archivo por módulo.

## Reglas e índices

- Las reglas (`firestore.rules`) deniegan todo acceso directo desde clientes web o móviles: solo el backend accede con el SDK admin.
- `firestore.indexes.json`: índices compuestos. Actualmente no requiere índices compuestos adicionales.

---

> **Nota:** La API del sistema se encuentra en la carpeta `functions/` y es generada por la capa backend.
