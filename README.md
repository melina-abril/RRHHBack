# Gestión de RR.HH. — Firestore (base de datos)

Este proyecto contiene la base de datos Cloud Firestore, los scripts de carga de datos de ejemplo y documentación del modelo de datos para el sistema de Gestión de Recursos Humanos de TECHFORB.

## ¿Qué contiene este repositorio?

- Firestore: colecciones y campos de RR.HH., reglas e índices.
- Scripts de carga versionados (`firestore/seeds/`): inicializan los datos de las colecciones y usuarios de ejemplo.
- Usuarios de ejemplo para ingresar al sistema (uno por cada rol).
- La API y lógica de backend están en la carpeta `functions/` (proyecto multi-capa, ver backend).
- Documentación del modelo de datos en `docs/collections/`.

## 🔧 Arranque: emuladores y carga de datos

1. Instalar dependencias (incluye Firebase Tools y firebase-admin):

   ```bash
   npm install
   ```
2. Instalar las dependencias del backend (API, opcional):

   ```bash
   npm run functions:install
   ```
3. Levantar los emuladores de Firestore y Auth:

   ```bash
   npm start
   # Panel de emuladores: http://127.0.0.1:4005
   ```
4. En OTRO terminal, cargar los datos de ejemplo (contra los emuladores):

   ```bash
   npm run seed:emulator
   ```

   - Usuarios de ejemplo en Auth y users/{uid}:
     - admin.rrhh@example.com — contraseña: **Demo1234!** — rol: ADMIN (uid: admin-rrhh)
     - martin.perez@example.com — contraseña: **Demo1234!** — rol: EMPLOYEE (uid: empleado)


## 📚 Colecciones y campos del modelo (actuales)

### Colecciones compartidas (core)

- **departments**: áreas (id = código)
- **positions**: puestos (id = código)
- **employees**: legajos (id = employeeNumber; referencias a departmentId y positionId)
- **users**: sesión de usuario (id = uid de Firebase Auth; { email, name, role, employeeId, active, createdAt })

Más detalles en `docs/collections/core.md`.

## 💡 Despliegue en un proyecto real

1. Indicar el proyecto con Firebase CLI:
   ```bash
   firebase use --add
   ```
2. Deploy de reglas, índices y API:
   ```bash
   npm run deploy
   ```
3. Para cargar los datos en la nube:
   ```bash
   # Con GOOGLE_APPLICATION_CREDENTIALS=<ruta/key.json> y FIREBASE_PROJECT_ID=<id_proyecto>:
   npm run seed
   ```

- Si agrega nuevos roles de usuario, modifique el script del core y vuelva a ejecutar el seed.

## 📁 API

La lógica y servicios HTTP del sistema están en `/functions/` (Node 22 + Firebase Functions): se genera desde la capa backend, este repo no incluye la API.

---

> **IMPORTANTE:**
> - El acceso directo a la base y Auth por apps cliente está bloqueado por reglas: la API en Functions es el único canal de comunicación.
> - Cualquier subida de datos o cambios en colecciones deben hacerse por nuevos scripts en `firestore/seeds/` con número de versión siguiente.
