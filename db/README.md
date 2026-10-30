# Base de datos de Gestión de RR.HH

## ¿Cómo levantar la base y aplicar las migraciones?

1. Copia el archivo de ejemplo de entorno:

   cp .env.example .env

2. Levanta los servicios y aplica las migraciones:

   docker compose up -d

Esto levantará un MySQL 8.4 accesible en el puerto 3306 y aplicará automáticamente todas las migraciones Flyway en `db/migration`.


## Orden de migraciones

- V1: core (departments, positions, employees)
- V5: auth (usuarios)
- V7: colaboradores (colaboradores, movimientos_laborales)


## Tablas por módulo

### Core (V1)
- departments
- positions
- employees

### Auth (V5)
- usuarios

### Colaboradores (V7)
- colaboradores (datos extendidos de legajo, referencia a employees)
- movimientos_laborales (historial de movimientos laborales)


## Acceso a la base de ejemplo
- Usuario MySQL: hr_app / change-me (ver `.env.example`)
- Database: hr

Puedes conectarte con:

    mysql -h 127.0.0.1 -P 3306 -u hr_app -pchange-me hr

