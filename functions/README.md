# API REST – Gestión de RR.HH (Cloud Functions / Firestore)

Esta carpeta contiene el backend (API REST HTTP) de la plataforma de Gestión de Recursos Humanos para TECHFORB. El backend se ejecuta como una única Cloud Function HTTP sobre Express 5 y TypeScript, usando Firestore de Firebase como base de datos y autenticación por Firebase Auth.

## Cómo levantar el backend

1. Instalar las dependencias en la raíz del repo y en `functions/`:
   ```bash
   npm install
   npm --prefix functions install
   ```

2. Build de la función:
   ```bash
   npm --prefix functions run build
   ```

3. Levantar el emulador de Firebase para probar local:
   ```bash
   npm start
   npm run seed:emulator
   ```

4. La función HTTP queda disponible por defecto en:
   - Local: `http://127.0.0.1:5002/{proyecto}/us-central1/api/api`
   - Producción: `/api/*` (Hosting reescribe el path)

5. El frontend debe autenticarse con Firebase Auth y enviar el ID token (Bearer) en Authorization. El rol de usuario se define en la colección `users` de Firestore.

## Endpoints disponibles

### /api/employees
- `GET /api/employees`: Listado paginado y filtrable de colaboradores activos e inactivos.
- `GET /api/employees/:id`: Ficha individual de un colaborador por legajo/id.
- `POST /api/employees`: Alta de colaborador (rol: ADMIN).
- `PUT /api/employees/:id`: Actualiza datos personales/laborales (rol: ADMIN).
- `POST /api/employees/:id/terminate`: Marca egreso/inactivo (rol: ADMIN).
- `POST /api/employees/:id/rejoin`: Registra reingreso (rol: ADMIN).

El resto de módulos del sistema pueden no tener endpoints propios (ejemplo: dashboard = pantalla estática de indicadores).

## Roles y autenticación
- Todo endpoint requiere sesión (ID token válido, Authorization: Bearer …).
- Las acciones administrativas requieren rol `ADMIN` (ver collection `users` en Firestore).
- Para consultar los datos de la sesión: `GET /api/auth/me`

## Usuarios de ejemplo y testing
- Los scripts de la base (`scripts/demo-users.js`, `scripts/seed.js`) cargan usuarios y datos de ejemplo requeridos para login y pruebas.

## Estructura de carpetas
- `src/modules/`: Un folder por módulo funcional (ej: employees, solicitudes, comunicados)
- `src/shared/`: Piezas comunes y utilidades (autenticación, errores, paginado, servicios Firestore)

## Cómo agregar un nuevo módulo
1. Crear el folder en `src/modules/{nombre}` con los 4 archivos por el patrón: dto.ts, repository.ts, service.ts, router.ts.
2. Importar el router en `src/app.ts` y sumarlo al diccionario de createApp.

---

> Generada por IA. No editar manualmente. Los comandos y paths pueden requerir ajustes según la config de Firebase y del entorno local.
