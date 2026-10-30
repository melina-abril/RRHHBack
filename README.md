# Gestión de RR.HH - Backend

Backend de la plataforma de Gestión de Recursos Humanos para TECHFORB.

## Requisitos previos

- Java 21+
- Maven 3.9+
- Docker (para la base de datos de desarrollo y SMTP de prueba)

## Comandos principales

1. Clonar el repositorio y setear variables de entorno:

```sh
docker compose up -d # Levanta PostgreSQL y Mailpit
cp .env.example .env # Editar según corresponda
```

2. Arrancar la app (en otra terminal):

```sh
./mvnw spring-boot:run
```

3. Acceso OpenAPI: http://localhost:8080/swagger-ui.html

## Estructura de módulos

- **colaboradores**: legajo de empleados, listado, ficha, edición, movimientos laborales.
- **employee-list**: listado paginado/filtrado (vía /api/employee-list).
- **employee-profile**: ficha individual del colaborador.
- **work-movements**: cambios laborales, egresos y reingresos.
- **projects-assignments**: clientes, proyectos y asignaciones a colaboradores.
- **employee-technical-profile**: perfil profesional y documentación/archivos de empleados.

> Para detalles y contratos de cada endpoint, consultar la documentación Swagger generada y los paquetes de los módulos en `src/main/java/com/techforb/rrhh/modules/`.


## Variables de entorno

Ver `.env.example`. Obligatorio definir: 
- DB_URL
- DB_USER
- DB_PASSWORD
- JWT_SECRET
- MAIL_HOST
- MAIL_PORT
- FRONT_URL

## Base de datos

- Esquema gestionado por Flyway. Cada módulo tiene su migración propia en `src/main/resources/db/migration/`.
- En desarrollo usa PostgreSQL 16 y Mailpit.
- Usuario admin inicial: usar variable.

## Seguridad

- Login: POST `/api/auth/login` (JWT por cookie HttpOnly 'rrhh_session'), logout: `/api/auth/logout`.
- Rol ADMIN_RRHH requerido para gestionar.
- Auditar eventos de módulos importantes. Consultar auditoría en la app o la DB.
