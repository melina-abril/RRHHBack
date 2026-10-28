# Base de Datos · Gestión de RR.HH

Esta base implementa el modelo relacional para el sistema Gestión de Recursos Humanos sobre **MySQL 8.4** con migraciones **Flyway** (aplicadas automáticamente al levantar el entorno con Docker Compose).

## Estructura de carpetas

- `db/migration/`: Migraciones Flyway versionadas (esquema y seeds). NO modificar los archivos de migraciones ya aplicadas.
- `.env.example`: Variables de entorno para MySQL y Flyway (copiar a `.env`).
- `docker-compose.yml`: Levanta MySQL y aplica migraciones con Flyway.

## Comandos para levantar y aplicar migraciones

```bash
cp .env.example .env
docker compose up -d
```
Esto levanta MySQL y aplica todas las migraciones de `db/migration/` en orden.

## Orden y detalle de migraciones

### Compartidas (V1)
- **V1__create_core_tables.sql**: Tablas compartidas: `departments`, `positions`, `employees` (legajos y estructura básica de RRHH)
- **V1_1__seed_core.sql**: Datos de ejemplo para los core tables (áreas, puestos y empleados ficticios)

### Módulo de Autenticación (V2)
- **V2__create_auth_tables.sql**: Tablas de autenticación de la cuenta administradora:
    - `admin_users`: Administradores (MVP = 1)
    - `user_sessions`: Sesiones autenticadas (auditoría/login tokens)
- **V2_1__seed_auth.sql**: Usuario administrador de ejemplo (correo: sofia.gomez@example.com)

### Módulo Pantalla Principal (V3)
- **V3__create_inicio_module.sql**: No crea tablas propias. La pantalla principal consulta métricas de las tablas compartidas y de otros módulos.

## Tablas por módulo

- **core**: departments, positions, employees
- **auth**: admin_users, user_sessions
- **inicio**: *(sin tablas propias)*

## Notas y convenciones

- Tablas solo de empleados, puestos y departamentos se crean como *compartidas* y se referencian con claves foráneas.
- Los módulos de RR.HH. crearán sus propias tablas en migraciones posteriores siguiendo el mismo esquema.
- Cada tabla incluye columnas de auditoría (created_at, updated_at); las de personas/usuarios incluyen deleted_at para borrado lógico.
- Los seeds referencian las claves foráneas por subconsulta, nunca por id fijo.

## Acceso a la base

- Conectarse con los valores de `.env`.
- Por defecto:
    - puerto: 3306
    - usuario: hr_app
    - nombre base: hr
