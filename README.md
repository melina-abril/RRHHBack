# Base de datos · Sistema de Gestión de RR.HH (TECHFORB)

## Levantar la base localmente

1. Copiar variables de entorno:

```bash
cp .env.example .env
```

2. Arrancar la base y aplicar migraciones:

```bash
docker compose up -d
```

- El servicio `db` levanta MySQL 8.4.
- El servicio `flyway` aplica las migraciones de db/migration en orden.
- Los datos persisten en el volumen `hr-db-data`.

## Migraciones / Tablas creadas

- **V1__create_core_tables.sql**: Tablas compartidas (core):
  - `departments` (áreas)
  - `positions` (puestos, FK a departments)
  - `employees` (legajos, FK a departments y positions, auto-relación para manager)
- **V1_1__seed_core.sql**: Datos de ejemplo de core (áreas, puestos, empleados de prueba).
- **V2__create_auth_tables.sql**: Módulo Auth:
  - `admin_accounts` (cuenta admin de RRHH, login único para TECHFORB)
  - `admin_sessions` (sesiones activas/cerradas para auditoría y revocación)
- **V2_1__seed_auth.sql**: Datos de ejemplo sólo para Auth (cuenta administradora de TECHFORB).

## Orden y convenciones de migraciones

- Cada módulo funcional agrega su migración a `db/migration/`:
  - V{n}__create_{modulo}_tables.sql (esquema)
  - V{n}_1__seed_{modulo}.sql (datos de ejemplo)
- Convenciones:
  - Tablas `snake_case` en inglés, plurales.
  - PK: BIGINT UNSIGNED AUTO_INCREMENT
  - FK: mismo tipo exacto, ON DELETE RESTRICT
  - Auditoría: `created_at`, `updated_at`, `deleted_at` donde corresponda
  - Engine: InnoDB, charset/collation utf8mb4
  - Estados como VARCHAR con CHECK
  - Datos sensibles COMMENT 'PII'

## Conexión

Servidor MySQL expuesto en `${DB_PORT:-3306}`:
  - Usuario: `${DB_USER}`
  - Password: `${DB_PASSWORD}`
  - Base: `${DB_NAME}`

> *Nunca usar estos valores de ejemplo en entornos reales.*
