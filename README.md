# Gestión de RR.HH · Base de datos

Base de datos MySQL 8.4 con migraciones Flyway para el sistema de Gestión de Recursos Humanos.

## Comandos de arranque

1. Copiar variables de entorno de ejemplo:

   cp .env.example .env

2. Levantar la base y aplicar las migraciones:

   docker compose up -d

- El servicio `db` levanta MySQL en el puerto `3306` (configurable por la variable de entorno `DB_PORT`).
- El servicio `flyway` aplica todas las migraciones en orden a la base configurada.
- Los datos se almacenan en un volumen Docker llamado `hr-db-data`.

## Migraciones

Las migraciones se encuentran en la carpeta `db/migration/`.
- Los archivos comienzan con un prefijo de versión, por ejemplo: `V1__create_core_tables.sql`.
- Todo seed de datos de ejemplo usa el sufijo `_1__seed_{modulo}.sql` con la misma versión.
- **NO modificar migraciones ya aplicadas.** Para cambios usar una nueva migración con la siguiente versión.

### Orden de migraciones

1. **V1__create_core_tables.sql** : Tablas compartidas esenciales. Siempre corre primero.
2. (Futuras migraciones de módulos: V2, V3, etc.)

### Tablas de la base

#### Compartidas (core):
- `departments`: áreas/departamentos de la organización.
- `positions`: puestos (depende de áreas/departamentos).
- `employees`: legajos y datos principales de colaboradores.


#### Módulos actuales (v1):
- `auth`  — Inicio de sesión: no agrega tablas (uso de tablas core).
- `inicio` — Pantalla principal: solo consultas, no agrega tablas.

## Datos de ejemplo

Datos ficticios de las tablas compartidas están en el seed correspondiente (a generar en futuras migraciones según corresponda). Los ids jamás se fijan a mano: cualquier relación usa `SELECT ... WHERE ...` por clave de negocio, nunca ids numéricos hardcodeados.

## Conectarse a la base

- Usuario: `${DB_USER}` (por defecto: hr_app)
- Contraseña: `${DB_PASSWORD}`
- Base: `${DB_NAME}`

Con MySQL Workbench o DBeaver, host `localhost`, puerto como en `DB_PORT` (por defecto: 3306).

## Migraciones existentes

- **db/migration/V1__create_core_tables.sql**
  - Tablas: departments, positions, employees

(Actualmente los módulos `auth` e `inicio` no requieren tablas propias; futuros módulos agregarán migraciones propias en la carpeta.)

## Notas sobre el modelo

- Todas las FK referencian por el mismo tipo que la clave principal (`BIGINT UNSIGNED`).
- Las tablas de personas y legajos usan borrado lógico (`deleted_at DATETIME(3) NULL`).
- Datos sensibles (documentos, email, etc.) señalados con `COMMENT 'PII'`.
- Las migraciones siguen las convenciones descritas en este archivo y en la arquitectura del sistema.

