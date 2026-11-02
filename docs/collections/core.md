# Módulo: core

## departments

Áreas o departamentos. Id del documento: código del área (`HR`, `IT`, ...).

| Campo      | Tipo      | Obligatorio | Descripción                |
|------------|-----------|-------------|----------------------------|
| name       | string    | sí          | Nombre visible del área    |
| createdAt  | timestamp | sí          | Alta del documento         |

## positions

Puestos. Id del documento: código del puesto (`HR_MANAGER`, `DEVELOPER`, ...).

| Campo        | Tipo    | Obligatorio | Descripción                         |
|--------------|---------|-------------|-------------------------------------|
| name         | string  | sí          | Nombre del puesto                   |
| departmentId | string → departments | sí   | Referencia al área                |
| createdAt    | timestamp | sí        | Alta del documento                  |

## employees

Legajos (colaboradores de TECHFORB). Id del documento: legajo "E-0001", "E-0002"…

| Campo           | Tipo      | Obligatorio | Descripción                                             |
|-----------------|-----------|-------------|---------------------------------------------------------|
| employeeNumber  | string    | sí          | Legajo único (identificador principal, = id)            |
| firstName       | string    | sí          | Nombre                                                  |
| lastName        | string    | sí          | Apellido                                                |
| documentType    | string    | sí          | Tipo de documento ("DNI", "CUIT", "PASSPORT")          |
| documentNumber  | string    | sí          | Número de documento                                     |
| birthDate       | timestamp | sí          | Fecha de nacimiento                                     |
| email           | string    | sí          | Correo electrónico                                      |
| phone           | string    | sí          | Teléfono de contacto                                    |
| hireDate        | timestamp | sí          | Fecha de alta                                           |
| terminationDate | timestamp | no         | Fecha de egreso (si existe)                             |
| departmentId    | string → departments | sí | Referencia al área                                    |
| positionId      | string → positions | sí | Referencia al puesto                                    |
| managerId       | string → employees | no    | Legajo del jefe directo, si corresponde                 |
| status          | string    | sí          | `ACTIVE`, `ON_LEAVE`, `TERMINATED`                      |
| deletedAt       | timestamp | no          | Borrado lógico                                          |
| createdAt       | timestamp | sí          | Alta del documento                                      |
| updatedAt       | timestamp | sí          | Última actualización                                    |

### Índices

- departmentId + status (búsqueda por área y estado)
- positionId + status (búsqueda por puesto y estado)
- managerId (búsqueda de reportes de un manager)
