# API REST · Gestión de RR.HH.

Este backend implementa la API REST del sistema de Gestión de Recursos Humanos sobre Firebase Cloud Functions, Express 5 y Firestore. La autenticación es por Firebase Auth (el login/logout lo hace el front), y la sesión/datos del usuario se leen de la colección `users/` en Firestore.

## Arranque local (emulador)

1. Instala las dependencias raíz (del monorepo) y de las funciones:

   ```bash
   npm install            # en la raíz del repo (instala paquetes del front y la base)
   npm --prefix functions install   # instala dependencias del backend (API)
   ```

2. Build de las funciones (TypeScript → lib/):

   ```bash
   npm --prefix functions run build
   ```

3. (Con firebase-tools y emuladores instalados) Levanta toda la plataforma en modo desarrollo (API / base de datos / reglas):

   ```bash
   npm start                     # en la raíz (levanta el front con proxy a la API local)
   # O en otra terminal, para solo la API y la base con el emulador:
   firebase emulators:start --only functions,firestore
   ```

   El backend estará expuesto en local en:
   - http://127.0.0.1:5002/{proyecto}/us-central1/api/api

4. Carga los datos de ejemplo (usuarios, tablas de negocio, seeds, etc):

   ```bash
   npm run seed:emulator       # en la raíz (prepara usuarios demo, seed de la base)
   ```

## Despliegue

```bash
npm --prefix functions run build
firebase deploy --only functions
```

El deploy sube la función Cloud Function HTTP única (`api`) y la app queda publicada según la configuración de Hosting.

## Módulos de la API

### employees
- `GET /api/employees`: página de colaboradores activos e inactivos (búsqueda/filtros)
- `POST /api/employees`: alta de colaborador
- `GET /api/employees/:id`: ficha individual
- `PUT /api/employees/:id`: edición
- `POST /api/employees/:id/leave`: egreso (baja)
- `POST /api/employees/:id/rejoin`: reingreso

### payroll
- `GET /api/payroll-periods`: períodos de nómina
- `GET /api/payslips/:employeeId`: pagos y conceptos de un colaborador
- `POST /api/payslips`: registrar pago, adicional o excepción
- `GET /api/bonuses/:employeeId`: bonos asignados e historial
- `POST /api/bonuses`: asignar bono

### requests
- `GET /api/requests`: lista de solicitudes de vacaciones/licencias/ausencias
- `GET /api/requests/:id`: detalle de solicitud
- `POST /api/requests/:id/approve`: aprobar solicitud
- `POST /api/requests/:id/reject`: rechazar solicitud

### notices
- `GET /api/notices`: comunicados
- `POST /api/notices`: crea y envía comunicado
- `GET /api/notices/:id`: detalle y estado de comunicado

### overtime
- `GET /api/overtime-requests`: solicitudes de horas extras
- `POST /api/overtime-requests`: registra nueva solicitud
- `POST /api/overtime-requests/:id/authorize`: autoriza y registra horas trabajadas/compensaciones

### dashboard y home
No exponen rutas del backend (pantalla principal solo navega y consulta indicadores desde los módulos previos).

### auth
El login/logout lo hace el front contra Firebase Auth. La API solo atiende:
- `GET /api/auth/me` — retorna el usuario autenticado (id, name, email, role)

## Seguridad y sesión
- Todas las rutas requieren un ID token de Firebase válido en el header `Authorization: Bearer ...`.
- El usuario debe estar habilitado en `users/{uid}` (role, activo).
- Los roles válidos están definidos en el sistema (mismos que en la base y App).

## Colecciones de Firestore
Este backend usa las siguientes colecciones (ver detalles en docs/collections/*.md):
- `users` (usuarios de sesión, con rol)
- `departments`, `positions`, `employees`, `movements` (gestión de empleados)
- `payrollPeriods`, `payslips`, `bonuses` (sueldos y bonos)
- `vacationRequests`, `leaveRequests`, `absenceRequests` (solicitudes)
- `notices` (comunicados)
- `overtimeRequests` (horas extras)

## Usuarios de ejemplo
En el seed se crean usuarios demo para login. En desarrollo puedes autenticarte desde el front con correo y contraseña cargados por los scripts.

