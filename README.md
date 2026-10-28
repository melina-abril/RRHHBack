# Base de datos · Gestión de RR.HH

**Cómo levantar y poblar la base:**

1. Copiar el entorno de ejemplo:

```sh
cp .env.example .env
```

2. Levantar MySQL y aplicar las migraciones por Flyway:

```sh
docker compose up -d
```

Esto crea el servicio MySQL (puerto 3306) y ejecuta Flyway para aplicar todas las migraciones existentes en `db/migration`.

---

## Orden de migraciones
- La carpeta `db/migration` contiene migraciones Flyway:
    - **V1__create_core_tables.sql**: Tablas compartidas (departments, positions, employees)
    - **V1_1__seed_core.sql**: Datos de ejemplo para las tablas compartidas
    - **V2__create_auth_tables.sql**: Tablas del módulo de autenticación (admin_users, admin_sessions, admin_login_history)
    - **V2_1__seed_auth.sql**: Datos de ejemplo para autenticación

---

## Tablas por módulo
- **Compartidas** (V1):
  - `departments`: áreas/departamentos.
  - `positions`: puestos/cargos (ligados a department_id).
  - `employees`: colaboradores/legajos. Incluye referencia a position, department y manager.
- **Auth** (inicio de sesión, V2):
  - `admin_users`: cuenta(s) administrativa(s): email, hash de contraseña, nombre.
  - `admin_sessions`: sesiones activas (token, expiración).
  - `admin_login_history`: historial de logins de la cuenta admin, exitosos/fallidos.

---

## Comandos útiles
- **Levantar la base y aplicar migraciones:**
  - `docker compose up -d`
- **Reaplicar desde cero** (borrar datos importantes):
  - `docker compose down -v && docker compose up -d`

El motor MySQL queda escuchando en el puerto especificado en el archivo `.env` (por defecto 3306) con los usuarios y contraseñas de dicho archivo.

---

## Notas de modelo y uso
- No se borran empleados ni registros sensibles; se marca deleted_at como borrado lógico.
- No incluir datos reales de personas. Todas las credenciales son ficticias de ejemplo.
- Para producción: cambiar todas las contraseñas, credenciales y hashes.
