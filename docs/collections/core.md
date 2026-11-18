# Colecciones compartidas

## users

Cuenta administradora de Recursos Humanos para autenticación y atribución de operaciones. Id fijo del documento: `U-0001`. El script carga únicamente una cuenta ficticia de demostración (`rrhh@example.com`); para crear o restablecer la cuenta de un entorno real se utiliza `scripts/create-admin.js`. La contraseña de demostración es `Demo1234!` y se almacena exclusivamente como hash bcrypt.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| name | string | sí | Nombre visible del administrador |
| email | string | sí | Correo en minúsculas usado para iniciar sesión |
| role | string | sí | Código de rol: `ADMIN` |
| active | boolean | sí | Indica si la cuenta puede acceder |
| passwordHash | string | sí | Hash bcrypt de la contraseña |
| createdAt | timestamp | sí | Alta del documento |

Índices compuestos: ninguno.
