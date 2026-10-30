# Backend – Gestión de RR.HH (Spring Boot 4, Java 21)

Este servicio expone el backend REST de la plataforma de Gestión de Recursos Humanos para TECHFORB.

## Requisitos
- Java 21
- Maven 3.9+
- Base de datos MySQL o PostgreSQL (levantar previamente con la capa `database`, ver README de esa capa)

---

## Levantar el backend

1. **Configura las variables de entorno** según tu entorno en el archivo `.env` (crea uno con las siguientes claves y reemplaza los valores según corresponda):

```
DB_URL=jdbc:mysql://localhost:3306/app?allowPublicKeyRetrieval=true&useSSL=false
DB_USER=app
DB_PASSWORD=app
JWT_SECRET=dev-secret-cambiar-en-produccion-0123456789abcdef
FRONT_URL=http://localhost:4200
COOKIE_SECURE=false
```

- `DB_URL`, `DB_USER`, `DB_PASSWORD`: credenciales del motor y base de datos ya migrada por la capa database
- `JWT_SECRET`: secreto de al menos 32 caracteres para firma HS256 del JWT (en demo puedes dejar el ejemplo, ¡cámbialo en producción!)
- `FRONT_URL`: origen del frontend para CORS
- `COOKIE_SECURE`: `true` en producción sobre HTTPS

2. **Ejecuta las migraciones** con la capa database (ver README de la capa database) **antes de iniciar el backend**.

3. **Inicia el backend**:

```
mvn spring-boot:run
```

La API se expone en `http://localhost:8080/api/*`

## Usuario de ejemplo para login

El seed de la base define un usuario habilitado:
- **Email:** admin@techforb.com
- **Contraseña:** `Demo1234!`

> El hash bcrypt correspondiente y el usuario están en la migración seed.

## Seguridad y autenticación
- El login es con **correo corporativo y contraseña**; exige sesión para todas las rutas `/api/**` excepto `/api/auth/login` y `/api/auth/logout`.
- El JWT firmado se emite y lee en una cookie HttpOnly, con duración y nombre configurables.
- Los roles viajan en el claim `role` y coinciden con el campo `role` de la tabla `users`.
- El endpoint `/api/auth/me` devuelve los datos de la sesión actual. Para cerrar sesión, llamar a `/api/auth/logout`.

## Documentación de la API
- **Swagger:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Módulos y endpoints

| Módulo                 | Endpoints            | Descripción                                                                           |
|----------------------- |---------------------|---------------------------------------------------------------------------------------|
| **Inicio de sesión**   | POST /api/auth/login<br>POST /api/auth/logout<br>GET /api/auth/me | Ingreso, cierre y consulta de sesión administradora                                    |
| **Pantalla Principal** | -                   | Acceso visible tras login, navegación entre módulos, indicadores y próximos eventos    |
| **Gestión de Empleados** | GET /api/employees<br>GET /api/employees/{id}<br>POST /api/employees<br>PUT /api/employees/{id}<br>POST /api/employees/{id}/leave<br>POST /api/employees/{id}/rejoin | Colaboradores: listado, ficha, alta, edición, egreso e historial de reingresos         |

## Notas importantes
- Toda tabla usada por el backend debe existir y ser creada por la capa database; el backend NO crea ni migra esquemas.
- Sólo existe una cuenta administradora, y sólo la funcionalidad descrita como MVP está expuesta (más adelante se sumarán nuevos módulos y endpoints).

---

### Scripts útiles

- Build (sin levantar):

```sh
mvn -B package
```

- Ejecutar sólo tests:

```sh
mvn test
```

---

