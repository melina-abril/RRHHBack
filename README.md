# Gestión de RR.HH — Backend (Spring Boot)

Plataforma web para centralizar la gestión administrativa de Recursos Humanos en TECHFORB.

## Requisitos
- Java 21+
- Maven 3.9+
- Docker (para el stack local: PostgreSQL + Mailpit)

## Levantar entorno de desarrollo

1. Clonar el repo y posicionarse en la raíz
2. Copiar `.env.example` a `.env` y personalizar si es necesario
3. Levantar base y mailpit:

```bash
docker compose up -d
```

4. Levantar el backend (perfil desarrollo):

```bash
./mvnw spring-boot:run
```

- Swagger: <http://localhost:8080/swagger-ui.html>
- Health: <http://localhost:8080/actuator/health>
- API base: <http://localhost:8080/api>

Acceso inicial: usuario ADMIN_RRHH creado al migrar las tablas (ver migraciones en `src/main/resources/db/migration`).

## Módulos
Cada dominio implementa:
- `modules/{modulo}/domain` — modelo puro
- `modules/{modulo}/application` — casos de uso/servicios
- `modules/{modulo}/infrastructure` — entidades JPA, repositorios, adaptadores
- `modules/{modulo}/api` — REST

## Migraciones
Se aplican automáticamente al levantar:
- Modelo base y usuario admin: `V1__esquema_base.sql`
- Colaboradores y movimientos laborales: `V2__colaboradores.sql`

## Variables importantes
- `DB_URL`, `DB_USER`, `DB_PASSWORD`: conexión PostgreSQL
- `JWT_SECRET`: clave JWT (>=32 chars para HS256)
- `MAIL_HOST`/`MAIL_PORT`: SMTP local — por defecto Mailpit
- `FRONT_URL`: origen frontend (CORS)

## Comandos útiles
- Build: `./mvnw -B package`
- Run:  `./mvnw spring-boot:run`
- Test: `./mvnw test`
- Testcontainers/ArchUnit: consultá los tests bajo `src/test/java/com/techforb/rrhh`

## Arquitectura
Monolito modular. Todas las entidades extienden `AuditableEntity`, claves ajenas siempre filtran por `organizacion_id` desde JWT ('org' claim).
