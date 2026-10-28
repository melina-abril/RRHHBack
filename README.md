# Gestión de RR.HH · Base de Datos (MySQL 8 + Flyway)

Este proyecto contiene la base de datos para el sistema de Gestión de Recursos Humanos, implementada en MySQL 8.4, con migraciones gestionadas por Flyway.

## Estructura

- **Tablas compartidas (core, V1):**
  - `departments`: áreas internas de la organización (nombre único por área).
  - `positions`: puestos/roles internos, referencian departamento.
  - `employees`: empleados (legajo, datos personales/laborales, referencia a departamento, puesto y jefe, borrado lógico y control de auditoría).

- **Módulos actuales:**
  - **auth** (Inicio de sesión): sin tablas propias
  - **inicio** (Pantalla principal): sin tablas propias

## Cómo levantar la base de datos

1. Copiar el archivo de variables de entorno de ejemplo:
    ```sh
    cp .env.example .env
    ```
2. Levantar los servicios y aplicar las migraciones:
    ```sh
    docker compose up -d
    ```
   Esto inicializará MySQL y ejecutará todas las migraciones de `db/migration/` en orden.

## Orden de migraciones

1. `V1__create_core_tables.sql` – crea las tablas compartidas `departments`, `positions` y `employees`.
2. (`V1_1__seed_core.sql`) – agrega datos de ejemplo a las tablas core (no se incluyen seeds dummy aquí).
3. (Próximos): migraciones de módulos funcionales según el plan del MVP.

## Tablas por módulo

| Módulo  | Tablas propias                                                                     |
|---------|-------------------------------------------------------------------------------------|
| core    | departments, positions, employees                                                  |
| auth    | *Sin tablas propias (usa employees)*                                               |
| inicio  | *Sin tablas propias*                                                               |

> Todos los módulos utilizan las tablas core mediante claves foráneas. Ningún módulo debe duplicar empleados, departamentos ni puestos.

## Notas de desarrollo

- Las migraciones siguen la convención: `V{n}__create_{modulo}_tables.sql` (esquema) y `V{n}_1__seed_{modulo}.sql` (datos de ejemplo).
- Todos los scripts SQL están en `db/migration/` y deben ejecutarse automáticamente por Flyway al levantar el servicio `flyway`.
- Las credenciales y nombre de la base provienen del archivo `.env`.
- No modificar ni borrar migraciones ya aplicadas; crear nuevas versiones para cambios al esquema.

## Scripts y conexión manual

- Puedes conectarte a la base con:
    ```sh
    mysql -h 127.0.0.1 -u hr_app -pchange-me hr
    ```
   (usar los valores definidos en `.env`)

## Próximos pasos

- Agregar migraciones de módulos funcionales a medida que se desarrollen (siguiendo la arquitectura: módulos de ausencias/licencias, liquidación de sueldos, evaluaciones, capacitaciones, selección, etc.).
- Agregar y poblar los archivos de seeds según corresponda para cada módulo funcional.
