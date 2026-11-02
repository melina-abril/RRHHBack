# API REST – Gestión de RR.HH (Backend)

Esta carpeta (`functions/`) contiene el backend del sistema, implementado como una Cloud Function HTTP (api) con Express 5 y TypeScript. La persistencia es en Cloud Firestore y la sesión se gestiona con Firebase Auth. El backend solo se encarga de la API administrativa (panel de Recursos Humanos, autenticado), no de los formularios externos de los colaboradores.

## Módulos implementados

- **Inicio de sesión** (`login`): la gestión de sesión y verificación de usuario está cubierta por Firebase Auth y el endpoint fijo `/api/auth/me`. No hay endpoints nuevos aquí.
- **Pantalla principal** (`dashboard`): resumen de indicadores e ingresos a módulos. (Ver router de dashboard)
- **Gestión de Empleados** (`employees`): consultas y administración de colaboradores (alta, ficha, asignaciones, etc.). (Ver endpoints de employees)

## Endpoints principales

Toda la API está bajo el prefijo `/api`. Los endpoints principales de cada módulo son:

- `/api/auth/me` [FIJO]: Devuelve los datos del usuario autenticado (requiere sesión mediante Firebase Auth).
- `/api/dashboard...` – [ver router de dashboard] (requiere sesión)
- `/api/employees...` – [ver router de employees] (requiere sesión)

## Cómo ejecutar en desarrollo

1. Instala las dependencias de la raíz y de `functions/` (si es la primera vez):

   ```sh
   npm install
   npm --prefix functions install
   ```

2. Compila el backend:

   ```sh
   npm --prefix functions run build
   ```

3. Levanta el emulador de Firebase (Firestore y Functions):

   ```sh
   firebase emulators:start
   ```

   - La URL local de la API será: `http://127.0.0.1:5001/{tu-proyecto}/us-central1/api`

4. (Opcional) Carga usuarios de ejemplo en Firestore (ver capa database y script `scripts/demo-users.js`).

## Usuarios de ejemplo

La autenticación y los roles se gestionan mediante Firebase Auth y la colección `users` en Firestore. Para acceder, usa un usuario de Auth habilitado como ADMIN en `users/{uid}`. Consulta los datos y la contraseña en la capa de la base.

- El administrador debe tener el rol `ADMIN`.
- Usa el endpoint `/api/auth/me` para obtener el usuario autenticado y su rol.

## Despliegue (producción)

1. Compila el backend:

   ```sh
   npm --prefix functions run build
   ```

2. Despliega solo las funciones (no la web ni Firestore):

   ```sh
   firebase deploy --only functions
   ```

## Estructura de carpetas principal

```
functions/
├── src/
│   ├── app.ts                # App principal (monta los routers)
│   ├── index.ts              # (Fijo) Arranque: exporta la función HTTP
│   ├── modules/
│   │   ├── dashboard/
│   │   └── employees/
│   └── shared/               # Utilidades comunes (FIJO)
├── package.json              # Dependencias (FIJO)
├── tsconfig.json             # Configuración TypeScript (FIJO)
├── .gitignore                # (FIJO)
└── README.md                 # (Este archivo)
```

## Notas

- **No modifiques los archivos FIJOS en `src/shared` ni `src/index.ts`.**
- No hay `/api/login` ni `/api/logout`: la autenticación es con Firebase Auth (el front hace el login).
- Para cambios en la estructura de la base, consulta la carpeta `firestore/` en la raíz del repo (NO se modifican desde aquí).

---

¿Dudas? Revisa los comentarios en el código fuente, las reglas del backend y la documentación en la raíz del proyecto.
