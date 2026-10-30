# Gestión de RR.HH – Backend

Backend REST de Gestión de Recursos Humanos para TECHFORB

## Funcionalidad general
- App web administrativa para Recursos Humanos
- Sesión con JWT en cookie HttpOnly
- Roles y acceso: solo usuarios autorizados pueden acceder a los módulos internos
- Swagger: documentación en [/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Cada módulo implementa una funcionalidad del MVP

## Arranque rápido

### 1. Levanta la base de datos
- Usa el docker-compose.yml y las migraciones que genera la capa database
- Crea primero la base y luego aplica las migraciones (usuarios, tablas de dominio y seeds)

### 2. Configura las variables de entorno
Se leen en el arranque (ver `src/main/resources/application.yml`):
- `DB_URL` – URL JDBC de la base (ejemplo: `jdbc:mysql://localhost:3306/app?allowPublicKeyRetrieval=true&useSSL=false`)
- `DB_USER` – Usuario de la base (por defecto: `app`)
- `DB_PASSWORD` – Contraseña de la base (por defecto: `app`)
- `JWT_SECRET` – Secreto HS256 de al menos 32 bytes (ej.: `dev-secret-cambiar-en-produccion-0123456789abcdef`)
- `FRONT_URL` – Origen/es permitidos para CORS en desarrollo (`http://localhost:*`)

Valores de ejemplo ya están configurados por defecto; sobreescríbelos por variable si hace falta.

### 3. Arrancar la API

```sh
mvn spring-boot:run
```

La app queda disponible en http://localhost:8080


## Usuario de ejemplo (para login)
- Email: cualquier correo dado de alta en la tabla `users`
- Contraseña de ejemplo generada en el seed de la base (ver documentación de la capa database): `Demo1234!`

Si necesitas crear otro usuario:
- La contraseña debe guardarse con bcrypt (`$2a$10$9AUdMo6RBfpxzRLfrxdQXucbXGPUNKmg.wBNdwquULzzE7612QhGO` para `Demo1234!`)
- El rol debe existir en el campo `role` (ejemplo inicial: `ADMIN`)


## Documentación de la API
- [Swagger UI](http://localhost:8080/swagger-ui.html) – Consulta rutas, ejemplos y esquemas
- Devuelve todos los errores como ProblemDetail (RFC 9457): `{ title, status, detail, code, errors? }`

## Módulos implementados

- **Inicio de sesión** (`auth`):
  - POST `/api/auth/login`: email y contraseña, responde sesión y cookie HttpOnly
  - POST `/api/auth/logout`: cierra sesión
  - GET `/api/auth/me`: datos del usuario logueado

- **Pantalla principal** (`main-dashboard`):
  - GET `/api/dashboard`: indicadores e información general

- **Gestión de Empleados** (`employees`):
  - GET `/api/employees`: listado paginado y filtrado de empleados
  - GET `/api/employees/{id}`: ficha individual del colaborador
  - POST `/api/employees`: alta de colaborador

Para agregar nuevas funcionalidades, crea un paquete en `src/main/java/com/techforb/app/modules/{modulo}` siguiendo el ejemplo existente (API, Application, Domain, Infrastructure).

## Seguridad
- Toda ruta `/api/**` requiere sesión activa salvo login y logout
- Las rutas usan roles en el JWT (`role`) para autorizar si corresponde
- CORS resuelto por patrones (`http://localhost:*` en dev)
- CSRF deshabilitado (la cookie de sesión es SameSite=Lax)

## Errores y resolución de problemas
- Si tienes errores de que no encuentra la base de datos, revisa que el contenedor esté corriendo y la conexión (`DB_URL`, `DB_USER`, `DB_PASSWORD`)
- Si no puedes iniciar sesión, revisa que la tabla `users` tenga un usuario activo y que la contraseña sea el hash bcrypt esperado
- Si Swagger no carga o da 401, revisa la cookie de sesión y/o reinicia el login
